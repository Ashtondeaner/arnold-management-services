/** Pricing & inventory rules for the AMS booking engine. */

export type PropertyPricing = {
  propertyId: string;
  /** Full property name as listed publicly */
  propertyName: string;
  currency: "USD";
  nightlyRate: number;
  weekendPremium: number; // extra on Fri/Sat nights
  /** Stay fees (resort fees, cleaning, etc.) charged per reservation */
  cleaningFee: number;
  /** Guest-facing label for stay fees */
  feeLabel: string;
  /** Short suffix for rate badges, e.g. "+ Resort fees" */
  rateSuffix: string;
  taxRate: number; // e.g. 0.115
  securityDeposit: number;
  minNights: number;
  maxNights: number;
  maxGuests: number;
};

export type DateRange = {
  start: string; // YYYY-MM-DD inclusive
  end: string; // YYYY-MM-DD exclusive (checkout day)
  reason?: string;
};

/** Nightly rates & fees by property id */
export const propertyPricing: Record<string, PropertyPricing> = {
  i102: {
    propertyId: "i102",
    propertyName: "I102 Naples Bay Resort",
    currency: "USD",
    nightlyRate: 375,
    weekendPremium: 0,
    cleaningFee: 185,
    feeLabel: "Resort fees",
    rateSuffix: "+ Resort fees",
    taxRate: 0.115,
    securityDeposit: 500,
    minNights: 3,
    maxNights: 28,
    maxGuests: 6,
  },
  "107-tahiti": {
    propertyId: "107-tahiti",
    propertyName: "107 Tahiti Street",
    currency: "USD",
    nightlyRate: 275,
    weekendPremium: 0,
    cleaningFee: 150,
    feeLabel: "Fees",
    rateSuffix: "+ fees",
    taxRate: 0.115,
    securityDeposit: 400,
    minNights: 3,
    maxNights: 28,
    maxGuests: 4,
  },
  "119-tahiti": {
    propertyId: "119-tahiti",
    propertyName: "119 Tahiti Street",
    currency: "USD",
    nightlyRate: 475,
    weekendPremium: 0,
    cleaningFee: 200,
    feeLabel: "Fees",
    rateSuffix: "+ fees",
    taxRate: 0.115,
    securityDeposit: 500,
    minNights: 3,
    maxNights: 28,
    maxGuests: 8,
  },
  "2001-bahama": {
    propertyId: "2001-bahama",
    propertyName: "2001 Bahama Beach Club",
    currency: "USD",
    nightlyRate: 675,
    weekendPremium: 0,
    cleaningFee: 275,
    feeLabel: "Fees",
    rateSuffix: "+ fees",
    taxRate: 0.1,
    securityDeposit: 750,
    minNights: 4,
    maxNights: 21,
    maxGuests: 10,
  },
};

/**
 * Owner-blocked / maintenance / already-booked windows (demo inventory).
 * Ranges use exclusive end dates (checkout day is free).
 */
export const seedBlockedRanges: Record<string, DateRange[]> = {
  i102: [
    { start: "2026-08-14", end: "2026-08-21", reason: "Booked" },
    { start: "2026-09-05", end: "2026-09-12", reason: "Booked" },
    { start: "2026-11-20", end: "2026-11-29", reason: "Thanksgiving" },
    { start: "2026-12-20", end: "2027-01-04", reason: "Holiday" },
  ],
  "107-tahiti": [
    { start: "2026-08-10", end: "2026-08-17", reason: "Booked" },
    { start: "2026-10-01", end: "2026-10-08", reason: "Booked" },
    { start: "2026-12-18", end: "2027-01-05", reason: "Holiday" },
  ],
  "119-tahiti": [
    { start: "2026-08-22", end: "2026-08-29", reason: "Booked" },
    { start: "2026-09-15", end: "2026-09-22", reason: "Booked" },
    { start: "2026-12-22", end: "2027-01-03", reason: "Holiday" },
  ],
  "2001-bahama": [
    { start: "2026-08-08", end: "2026-08-18", reason: "Booked" },
    { start: "2026-09-01", end: "2026-09-10", reason: "Booked" },
    { start: "2026-11-01", end: "2026-11-08", reason: "Maintenance" },
    { start: "2026-12-15", end: "2027-01-08", reason: "Holiday" },
  ],
};

export function getPricing(propertyId: string): PropertyPricing | undefined {
  return propertyPricing[propertyId];
}
