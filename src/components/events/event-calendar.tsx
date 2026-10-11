import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  MapPin,
} from "lucide-react";
import {
  eventCategoryLabels,
  eventOccursOnDay,
  formatEventDateRange,
  getEvents,
  getEventsForMonth,
  monthMatrix,
  parseEventDate,
  toDayIso,
  type EventCategory,
  type LocalEvent,
} from "@/data/events";
import type { Region } from "@/data/properties";
import { googleMapsSearchUrl } from "@/lib/maps";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const regionLabels: Record<Region | "all", string> = {
  all: "All destinations",
  naples: "Naples, FL",
  bahamas: "Treasure Cay",
};

function formatDayLabel(iso: string): string {
  return parseEventDate(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function EventCard({
  event,
  compact,
}: {
  event: LocalEvent;
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-bg-elevated p-4 shadow-[var(--shadow-soft)]",
        compact && "p-3",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent">{eventCategoryLabels[event.category]}</Badge>
        <Badge variant="outline">
          {event.region === "naples" ? "Naples, FL" : "Treasure Cay"}
        </Badge>
        {event.featured ? (
          <Badge variant="outline" className="border-accent/40 text-accent">
            Featured
          </Badge>
        ) : null}
      </div>
      <h3
        className={cn(
          "mt-2 font-display text-fg text-balance",
          compact ? "text-lg" : "text-xl",
        )}
      >
        {event.title}
      </h3>
      <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-muted">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-3.5 text-primary" />
          {formatEventDateRange(event)}
        </span>
        {event.startTime ? (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-primary" />
            {event.startTime}
            {event.endTime ? ` – ${event.endTime}` : ""}
          </span>
        ) : null}
      </p>
      <p className="mt-1 flex items-start gap-1.5 text-sm text-fg-muted">
        <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
        {event.venue}, {event.city}
      </p>
      {!compact ? (
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          {event.description}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={googleMapsSearchUrl(event.mapQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-medium text-fg hover:bg-bg-subtle focus-ring"
        >
          Map
          <ExternalLink className="size-3" />
        </a>
        <Link
          to="/book"
          search={
            event.region === "bahamas"
              ? { property: "2001-bahama-beach-club" }
              : {}
          }
          className="inline-flex items-center rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-fg hover:bg-primary-hover focus-ring"
        >
          Reserve nearby
        </Link>
      </div>
    </article>
  );
}

export function EventCalendar({
  initialRegion = "all",
  propertyId,
  showFilters = true,
  className,
}: {
  initialRegion?: Region | "all";
  propertyId?: string;
  showFilters?: boolean;
  className?: string;
}) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [region, setRegion] = useState<Region | "all">(initialRegion);
  const [category, setCategory] = useState<EventCategory | "all">("all");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const monthEvents = useMemo(() => {
    let events = getEventsForMonth(year, month, region);
    if (category !== "all") {
      events = events.filter((e) => e.category === category);
    }
    if (propertyId) {
      events = events.filter(
        (e) =>
          e.relatedPropertyIds?.includes(propertyId) ||
          (propertyId === "2001-bahama"
            ? e.region === "bahamas"
            : e.region === "naples"),
      );
    }
    return events;
  }, [year, month, region, category, propertyId]);

  const listEvents = useMemo(() => {
    const from = toDayIso(new Date(year, month, 1));
    const to = toDayIso(new Date(year, month + 1, 0));
    return getEvents({
      region,
      category,
      propertyId,
      from,
      to,
    });
  }, [year, month, region, category, propertyId]);

  const selectedEvents = useMemo(() => {
    if (!selectedDay) return monthEvents;
    return monthEvents.filter((e) => eventOccursOnDay(e, selectedDay));
  }, [monthEvents, selectedDay]);

  const matrix = useMemo(() => monthMatrix(year, month), [year, month]);

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
    setSelectedDay(null);
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
    setSelectedDay(null);
  }

  function goToday() {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth());
    setSelectedDay(toDayIso(t));
  }

  const categories = Object.keys(eventCategoryLabels) as EventCategory[];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <h3 className="min-w-[10rem] text-center font-display text-xl text-fg sm:min-w-[12rem] sm:text-2xl">
            {monthLabel}
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={goToday}>
            Today
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="inline-flex rounded-lg border border-border bg-bg-elevated p-0.5">
            {(["calendar", "list"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors focus-ring",
                  view === v
                    ? "bg-primary text-primary-fg"
                    : "text-fg-muted hover:text-fg",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showFilters ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <label className="flex flex-col gap-1 text-xs font-medium text-fg-subtle">
            Destination
            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value as Region | "all");
                setSelectedDay(null);
              }}
              className="h-10 rounded-md border border-border bg-bg-elevated px-3 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(Object.keys(regionLabels) as (Region | "all")[]).map((r) => (
                <option key={r} value={r}>
                  {regionLabels[r]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-fg-subtle">
            Category
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as EventCategory | "all")
              }
              className="h-10 rounded-md border border-border bg-bg-elevated px-3 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {eventCategoryLabels[c]}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      {view === "calendar" ? (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-[var(--shadow-soft)] lg:col-span-7">
            <div className="grid grid-cols-7 border-b border-border bg-bg-subtle">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="px-1 py-2 text-center text-[0.65rem] font-semibold uppercase tracking-wide text-fg-subtle sm:text-xs"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {matrix.flat().map((day, idx) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="min-h-[4.5rem] border-b border-r border-border/60 bg-bg-subtle/40 sm:min-h-[5.5rem]"
                    />
                  );
                }
                const iso = toDayIso(day);
                const dayEvents = monthEvents.filter((e) =>
                  eventOccursOnDay(e, iso),
                );
                const isSelected = selectedDay === iso;
                const isToday = iso === toDayIso(new Date());
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() =>
                      setSelectedDay((prev) => (prev === iso ? null : iso))
                    }
                    className={cn(
                      "min-h-[4.5rem] border-b border-r border-border/60 p-1.5 text-left transition-colors focus-ring sm:min-h-[5.5rem] sm:p-2",
                      isSelected
                        ? "bg-primary/10"
                        : "bg-bg-elevated hover:bg-bg-subtle",
                      isToday && "ring-1 ring-inset ring-primary/40",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                        isSelected
                          ? "bg-primary text-primary-fg"
                          : isToday
                            ? "bg-primary/15 text-primary"
                            : "text-fg",
                      )}
                    >
                      {day.getDate()}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {dayEvents.slice(0, 2).map((e) => (
                        <span
                          key={e.id}
                          className="block truncate rounded bg-bg-subtle px-1 py-0.5 text-[0.6rem] font-medium leading-tight text-fg-muted sm:text-[0.65rem]"
                          title={e.title}
                        >
                          {e.title}
                        </span>
                      ))}
                      {dayEvents.length > 2 ? (
                        <span className="block text-[0.6rem] text-primary">
                          +{dayEvents.length - 2} more
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {selectedDay
                ? `Events on ${formatDayLabel(selectedDay)}`
                : `Events in ${monthLabel}`}
            </p>
            <div className="mt-3 max-h-[32rem] space-y-3 overflow-y-auto pr-1">
              {selectedEvents.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border bg-bg-subtle px-4 py-8 text-center text-sm text-fg-muted">
                  No events for this selection. Try another day, month, or
                  destination.
                </p>
              ) : (
                selectedEvents.map((e) => (
                  <EventCard key={e.id} event={e} compact />
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {listEvents.length === 0 ? (
            <p className="col-span-full rounded-xl border border-dashed border-border bg-bg-subtle px-4 py-10 text-center text-sm text-fg-muted">
              No events this month for the selected filters.
            </p>
          ) : (
            listEvents.map((e) => <EventCard key={e.id} event={e} />)
          )}
        </div>
      )}
    </div>
  );
}

export function UpcomingEventsWidget({
  region,
  propertyId,
  limit = 4,
  title = "Upcoming local events",
}: {
  region?: Region | "all";
  propertyId?: string;
  limit?: number;
  title?: string;
}) {
  const events = useMemo(() => {
    const today = toDayIso(new Date());
    return getEvents({
      region: region ?? "all",
      propertyId,
      from: today,
    }).slice(0, limit);
  }, [region, propertyId, limit]);

  if (events.length === 0) return null;

  const searchRegion =
    region && region !== "all"
      ? region
      : propertyId === "2001-bahama"
        ? "bahamas"
        : propertyId
          ? "naples"
          : undefined;

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Local calendar
          </p>
          <h3 className="mt-2 font-display text-2xl text-fg">{title}</h3>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link
            to="/events"
            search={searchRegion ? { region: searchRegion } : {}}
          >
            Full calendar
          </Link>
        </Button>
      </div>
      <ul className="mt-5 space-y-3">
        {events.map((e) => (
          <li key={e.id}>
            <EventCard event={e} compact />
          </li>
        ))}
      </ul>
    </section>
  );
}
