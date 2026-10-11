import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "@/data/pricing";
import { getPricing } from "@/data/pricing";
import {
  buildMonthGrid,
  canEndStay,
  canStartStay,
  monthLabel,
  nightsBetween,
  todayISO,
} from "@/lib/booking-engine";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  propertyId: string;
  checkIn: string | null;
  checkOut: string | null;
  onChange: (checkIn: string | null, checkOut: string | null) => void;
  extraBlocked?: DateRange[];
  className?: string;
};

export function DateCalendar({
  propertyId,
  checkIn,
  checkOut,
  onChange,
  extraBlocked = [],
  className,
}: Props) {
  const now = new Date();
  const [cursor, setCursor] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const minNights = getPricing(propertyId)?.minNights ?? 3;

  const cells = useMemo(
    () =>
      buildMonthGrid(
        cursor.year,
        cursor.month,
        propertyId,
        checkIn,
        checkOut,
        extraBlocked,
      ),
    [cursor, propertyId, checkIn, checkOut, extraBlocked],
  );

  const pickingCheckout = Boolean(checkIn && !checkOut);

  function prevMonth() {
    setCursor((c) => {
      const d = new Date(c.year, c.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function nextMonth() {
    setCursor((c) => {
      const d = new Date(c.year, c.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function isDayDisabled(iso: string, inMonth: boolean, past: boolean) {
    if (!inMonth || past || iso < todayISO()) return true;
    if (!pickingCheckout) {
      return !canStartStay(propertyId, iso, minNights, extraBlocked);
    }
    if (iso <= checkIn!) return true;
    return !canEndStay(propertyId, checkIn!, iso, minNights, extraBlocked);
  }

  function handleDayClick(iso: string, disabled: boolean) {
    if (disabled) return;

    if (!checkIn || (checkIn && checkOut)) {
      onChange(iso, null);
      return;
    }

    if (iso <= checkIn) {
      onChange(iso, null);
      return;
    }

    if (!canEndStay(propertyId, checkIn, iso, minNights, extraBlocked)) {
      return;
    }

    onChange(checkIn, iso);
  }

  const canGoPrev =
    cursor.year > now.getFullYear() ||
    (cursor.year === now.getFullYear() && cursor.month > now.getMonth());

  return (
    <div className={cn("select-none", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={prevMonth}
          disabled={!canGoPrev}
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <p className="font-display text-base text-fg">
          {monthLabel(cursor.year, cursor.month)}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={nextMonth}
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[0.7rem] font-medium uppercase tracking-wide text-fg-subtle">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          const disabled = isDayDisabled(cell.iso, cell.inMonth, cell.past);
          const tooShort =
            pickingCheckout &&
            cell.inMonth &&
            !cell.past &&
            cell.iso > checkIn! &&
            nightsBetween(checkIn!, cell.iso) < minNights;
          return (
            <button
              key={`${cell.iso}-${cell.inMonth}`}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(cell.iso, disabled)}
              className={cn(
                "relative flex h-9 items-center justify-center rounded-md text-sm transition-colors",
                !cell.inMonth && "invisible",
                disabled &&
                  cell.inMonth &&
                  "cursor-not-allowed text-fg-subtle line-through opacity-40",
                !disabled &&
                  !cell.selected &&
                  !cell.inRange &&
                  "text-fg hover:bg-bg-subtle",
                cell.inRange && "bg-primary/10 text-fg",
                cell.selected && "bg-primary font-semibold text-primary-fg",
                cell.blocked && cell.inMonth && !cell.past && !pickingCheckout &&
                  "bg-bg-subtle",
              )}
              title={
                tooShort
                  ? `${minNights}-night minimum`
                  : cell.blocked && !pickingCheckout
                    ? "Unavailable"
                    : cell.isCheckIn
                      ? "Check-in"
                      : cell.isCheckOut
                        ? "Check-out"
                        : cell.iso
              }
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-fg-muted">
        {pickingCheckout
          ? `Select check-out · ${minNights}-night minimum`
          : checkIn && checkOut
            ? "Click a date to start a new search"
            : `Select check-in, then check-out · ${minNights}-night minimum`}
      </p>

      <div className="mt-2 flex flex-wrap gap-3 text-[0.7rem] text-fg-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-primary" /> Selected
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-primary/15" /> Stay
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-bg-subtle ring-1 ring-border" />{" "}
          Unavailable
        </span>
      </div>
    </div>
  );
}
