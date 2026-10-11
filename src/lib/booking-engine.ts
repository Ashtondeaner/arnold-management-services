import {
  getPricing,
  seedBlockedRanges,
  type DateRange,
  type PropertyPricing,
} from "@/data/pricing";

export type StayQuote = {
  propertyId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  nightlyBase: number;
  weekendNights: number;
  subtotal: number;
  cleaningFee: number;
  feeLabel: string;
  tax: number;
  taxRate: number;
  total: number;
  securityDeposit: number;
  currency: "USD";
  minNights: number;
  lineItems: { label: string; amount: number }[];
};

export type AvailabilityResult =
  | { ok: true }
  | { ok: false; reason: string };

const DAY_MS = 86_400_000;

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = parseISODate(checkIn).getTime();
  const b = parseISODate(checkOut).getTime();
  return Math.round((b - a) / DAY_MS);
}

export function isSameOrBefore(a: string, b: string): boolean {
  return a <= b;
}

export function formatDisplayDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMoney(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMoneyExact(
  amount: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/** e.g. "$375/night + Resort fees" */
export function formatRateWithFees(pricing: PropertyPricing): string {
  return `${formatMoney(pricing.nightlyRate)}/night ${pricing.rateSuffix}`;
}

function dateInRange(iso: string, range: DateRange): boolean {
  return iso >= range.start && iso < range.end;
}

/** Night of stay is occupied if that calendar day is in any blocked range */
export function isNightBlocked(
  propertyId: string,
  nightISO: string,
  extraBlocked: DateRange[] = [],
): boolean {
  const ranges = [
    ...(seedBlockedRanges[propertyId] ?? []),
    ...extraBlocked,
  ];
  return ranges.some((r) => dateInRange(nightISO, r));
}

export function rangeOverlapsBlocked(
  propertyId: string,
  checkIn: string,
  checkOut: string,
  extraBlocked: DateRange[] = [],
): boolean {
  const nights = nightsBetween(checkIn, checkOut);
  for (let i = 0; i < nights; i++) {
    if (isNightBlocked(propertyId, addDays(checkIn, i), extraBlocked)) {
      return true;
    }
  }
  return false;
}

export function checkAvailability(
  propertyId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
  extraBlocked: DateRange[] = [],
): AvailabilityResult {
  const pricing = getPricing(propertyId);
  if (!pricing) return { ok: false, reason: "Property not available for booking." };

  if (!checkIn || !checkOut) {
    return { ok: false, reason: "Select check-in and check-out dates." };
  }

  if (checkIn < todayISO()) {
    return { ok: false, reason: "Check-in cannot be in the past." };
  }

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) {
    return { ok: false, reason: "Check-out must be after check-in." };
  }

  if (nights < pricing.minNights) {
    return {
      ok: false,
      reason: `Minimum stay is ${pricing.minNights} nights.`,
    };
  }

  if (nights > pricing.maxNights) {
    return {
      ok: false,
      reason: `Maximum stay is ${pricing.maxNights} nights.`,
    };
  }

  if (guests < 1) {
    return { ok: false, reason: "At least one guest is required." };
  }

  if (guests > pricing.maxGuests) {
    return {
      ok: false,
      reason: `This home sleeps up to ${pricing.maxGuests} guests.`,
    };
  }

  if (rangeOverlapsBlocked(propertyId, checkIn, checkOut, extraBlocked)) {
    return {
      ok: false,
      reason: "Those dates are not available. Choose another range.",
    };
  }

  return { ok: true };
}

function isWeekendNight(iso: string): boolean {
  const day = parseISODate(iso).getDay(); // 0 Sun … 5 Fri 6 Sat
  return day === 5 || day === 6;
}

export function quoteStay(
  propertyId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
  extraBlocked: DateRange[] = [],
): StayQuote | null {
  const pricing = getPricing(propertyId);
  if (!pricing) return null;

  const avail = checkAvailability(
    propertyId,
    checkIn,
    checkOut,
    guests,
    extraBlocked,
  );
  if (!avail.ok) return null;

  const nights = nightsBetween(checkIn, checkOut);
  let subtotal = 0;
  let weekendNights = 0;

  for (let i = 0; i < nights; i++) {
    const night = addDays(checkIn, i);
    const weekend = isWeekendNight(night);
    if (weekend) weekendNights += 1;
    subtotal += pricing.nightlyRate + (weekend ? pricing.weekendPremium : 0);
  }

  const cleaningFee = pricing.cleaningFee;
  const tax = Math.round((subtotal + cleaningFee) * pricing.taxRate * 100) / 100;
  const total = Math.round((subtotal + cleaningFee + tax) * 100) / 100;

  const lineItems: StayQuote["lineItems"] = [
    {
      label: `${nights} night${nights === 1 ? "" : "s"} at ${pricing.propertyName}`,
      amount: subtotal,
    },
  ];
  if (weekendNights > 0 && pricing.weekendPremium > 0) {
    lineItems[0] = {
      label: `${nights} nights at ${pricing.propertyName} (incl. ${weekendNights} weekend)`,
      amount: subtotal,
    };
  }
  lineItems.push({ label: pricing.feeLabel, amount: cleaningFee });
  lineItems.push({
    label: `Taxes (${Math.round(pricing.taxRate * 1000) / 10}%)`,
    amount: tax,
  });

  return {
    propertyId,
    propertyName: pricing.propertyName,
    checkIn,
    checkOut,
    nights,
    guests,
    nightlyBase: pricing.nightlyRate,
    weekendNights,
    subtotal,
    cleaningFee,
    feeLabel: pricing.feeLabel,
    tax,
    taxRate: pricing.taxRate,
    total,
    securityDeposit: pricing.securityDeposit,
    currency: pricing.currency,
    minNights: pricing.minNights,
    lineItems,
  };
}

export function averageNightly(pricing: PropertyPricing): number {
  return pricing.nightlyRate;
}

/** Generate calendar cells for a month (Sun–Sat weeks) */
export type CalendarDay = {
  iso: string;
  day: number;
  inMonth: boolean;
  past: boolean;
  blocked: boolean;
  selected: boolean;
  inRange: boolean;
  isCheckIn: boolean;
  isCheckOut: boolean;
};

export function buildMonthGrid(
  year: number,
  month: number, // 0-indexed
  propertyId: string,
  checkIn: string | null,
  checkOut: string | null,
  extraBlocked: DateRange[] = [],
): CalendarDay[] {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayISO();
  const cells: CalendarDay[] = [];

  const totalCells = Math.ceil((startPad + daysInMonth) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const date = new Date(year, month, 1 - startPad + i);
    const iso = toISODate(date);
    const inMonth = date.getMonth() === month;
    const past = iso < today;
    const blocked = isNightBlocked(propertyId, iso, extraBlocked);
    const isCheckIn = checkIn === iso;
    const isCheckOut = checkOut === iso;
    const inRange = Boolean(
      checkIn &&
        checkOut &&
        iso > checkIn &&
        iso < checkOut,
    );
    const selected = isCheckIn || isCheckOut;

    cells.push({
      iso,
      day: date.getDate(),
      inMonth,
      past,
      blocked,
      selected,
      inRange,
      isCheckIn,
      isCheckOut,
    });
  }

  return cells;
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function canStartStay(
  propertyId: string,
  checkIn: string,
  minNights: number,
  extraBlocked: DateRange[] = [],
): boolean {
  if (checkIn < todayISO()) return false;
  const checkOut = addDays(checkIn, minNights);
  return !rangeOverlapsBlocked(propertyId, checkIn, checkOut, extraBlocked);
}

export function canEndStay(
  propertyId: string,
  checkIn: string,
  checkOut: string,
  minNights: number,
  extraBlocked: DateRange[] = [],
): boolean {
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < minNights) return false;
  return !rangeOverlapsBlocked(propertyId, checkIn, checkOut, extraBlocked);
}

export function generateConfirmationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "AMS-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
