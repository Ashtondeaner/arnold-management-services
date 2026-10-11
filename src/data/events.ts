import type { Region } from "@/data/properties";

export type EventCategory =
  | "festival"
  | "market"
  | "music"
  | "food"
  | "sports"
  | "arts"
  | "family"
  | "boating"
  | "holiday";

export type LocalEvent = {
  id: string;
  title: string;
  region: Region;
  category: EventCategory;
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD inclusive; same as start for single-day */
  endDate: string;
  startTime?: string;
  endTime?: string;
  venue: string;
  city: string;
  description: string;
  mapQuery: string;
  latitude: number;
  longitude: number;
  url?: string;
  /** Property ids this event is especially relevant for */
  relatedPropertyIds?: string[];
  featured?: boolean;
};

export const eventCategoryLabels: Record<EventCategory, string> = {
  festival: "Festival",
  market: "Market",
  music: "Music",
  food: "Food & drink",
  sports: "Sports",
  arts: "Arts",
  family: "Family",
  boating: "Boating",
  holiday: "Holiday",
};

/**
 * Curated local event calendar for guest planning.
 * Dates span late 2026 – early 2027 to match the live booking window.
 */
export const localEvents: LocalEvent[] = [
  // —— Naples, FL ——
  {
    id: "naples-farmers-market-aug",
    title: "Third Street South Farmers Market",
    region: "naples",
    category: "market",
    startDate: "2026-08-09",
    endDate: "2026-08-09",
    startTime: "8:00 AM",
    endTime: "12:00 PM",
    venue: "Third Street South",
    city: "Naples",
    description:
      "Weekly open-air market with local produce, baked goods, flowers, and artisan vendors in Old Naples.",
    mapQuery: "Third Street South, Naples, FL",
    latitude: 26.1365,
    longitude: -81.801,
    relatedPropertyIds: ["i102", "107-tahiti", "119-tahiti"],
    featured: true,
  },
  {
    id: "naples-sunset-cruise-series",
    title: "Naples Bay Sunset Cruise Series",
    region: "naples",
    category: "boating",
    startDate: "2026-08-15",
    endDate: "2026-08-15",
    startTime: "6:30 PM",
    endTime: "8:30 PM",
    venue: "Naples Bay waterfront",
    city: "Naples",
    description:
      "Guided evening cruise on Naples Bay—ideal after a day at the resort or launching from your private dock.",
    mapQuery: "Naples Bay Resort Marina, Naples, FL",
    latitude: 26.124,
    longitude: -81.792,
    relatedPropertyIds: ["i102", "107-tahiti", "119-tahiti"],
    featured: true,
  },
  {
    id: "naples-jazz-fifth-ave",
    title: "Jazz on Fifth Avenue South",
    region: "naples",
    category: "music",
    startDate: "2026-08-22",
    endDate: "2026-08-22",
    startTime: "6:00 PM",
    endTime: "9:00 PM",
    venue: "Fifth Avenue South",
    city: "Naples",
    description:
      "Outdoor jazz performances along Naples’ premier dining and shopping street.",
    mapQuery: "Fifth Avenue South, Naples, FL",
    latitude: 26.1412,
    longitude: -81.7949,
    relatedPropertyIds: ["i102", "107-tahiti", "119-tahiti"],
  },
  {
    id: "laborday-beach-cleanup",
    title: "Labor Day Weekend Beach Walk & Cleanup",
    region: "naples",
    category: "family",
    startDate: "2026-09-05",
    endDate: "2026-09-05",
    startTime: "8:00 AM",
    endTime: "10:00 AM",
    venue: "Lowdermilk Beach",
    city: "Naples",
    description:
      "Community beach walk with optional cleanup—great family outing on the Gulf.",
    mapQuery: "Lowdermilk Park Beach, Naples, FL",
    latitude: 26.1605,
    longitude: -81.8105,
    relatedPropertyIds: ["i102", "107-tahiti", "119-tahiti"],
  },
  {
    id: "naples-boat-show-preview",
    title: "Southwest Florida Boat & Yacht Showcase",
    region: "naples",
    category: "boating",
    startDate: "2026-09-18",
    endDate: "2026-09-20",
    startTime: "10:00 AM",
    endTime: "6:00 PM",
    venue: "Naples Bay waterfront",
    city: "Naples",
    description:
      "Multi-day showcase of boats, yacht gear, and marina exhibitors—perfect for docking guests.",
    mapQuery: "Naples Bay, Naples, FL",
    latitude: 26.13,
    longitude: -81.79,
    relatedPropertyIds: ["i102", "107-tahiti", "119-tahiti"],
    featured: true,
  },
  {
    id: "stone-crab-festival",
    title: "Naples Stone Crab Festival Kickoff",
    region: "naples",
    category: "food",
    startDate: "2026-10-15",
    endDate: "2026-10-18",
    venue: "Tin City & Bayfront",
    city: "Naples",
    description:
      "Celebrate stone crab season with waterfront tastings, chefs, and live music near Tin City.",
    mapQuery: "Tin City, Naples, FL",
    latitude: 26.1345,
    longitude: -81.7905,
    relatedPropertyIds: ["i102", "107-tahiti", "119-tahiti"],
    featured: true,
  },
  {
    id: "naples-art-walk",
    title: "Downtown Naples Art Walk",
    region: "naples",
    category: "arts",
    startDate: "2026-10-24",
    endDate: "2026-10-24",
    startTime: "5:00 PM",
    endTime: "9:00 PM",
    venue: "Fifth Avenue & galleries",
    city: "Naples",
    description:
      "Evening gallery openings, street art, and local artists across downtown Naples.",
    mapQuery: "Fifth Avenue South, Naples, FL",
    latitude: 26.1412,
    longitude: -81.7949,
    relatedPropertyIds: ["i102"],
  },
  {
    id: "halloween-family-fest",
    title: "Cambier Park Family Fall Festival",
    region: "naples",
    category: "family",
    startDate: "2026-10-31",
    endDate: "2026-10-31",
    startTime: "4:00 PM",
    endTime: "7:00 PM",
    venue: "Cambier Park",
    city: "Naples",
    description:
      "Costume parade, games, and treats for families spending Halloween week in Naples.",
    mapQuery: "Cambier Park, Naples, FL",
    latitude: 26.1385,
    longitude: -81.7995,
    relatedPropertyIds: ["107-tahiti", "119-tahiti", "i102"],
  },
  {
    id: "naples-turkey-trot",
    title: "Naples Turkey Trot 5K",
    region: "naples",
    category: "sports",
    startDate: "2026-11-26",
    endDate: "2026-11-26",
    startTime: "7:30 AM",
    endTime: "10:00 AM",
    venue: "Fleischmann Park area",
    city: "Naples",
    description:
      "Thanksgiving morning community run—register early; popular with visiting families.",
    mapQuery: "Fleischmann Park, Naples, FL",
    latitude: 26.16,
    longitude: -81.79,
    relatedPropertyIds: ["i102", "107-tahiti", "119-tahiti"],
  },
  {
    id: "christmas-on-fifth",
    title: "Christmas on Fifth Avenue",
    region: "naples",
    category: "holiday",
    startDate: "2026-12-05",
    endDate: "2026-12-05",
    startTime: "5:00 PM",
    endTime: "9:00 PM",
    venue: "Fifth Avenue South",
    city: "Naples",
    description:
      "Tree lighting, carolers, and holiday storefronts—classic Naples December evening.",
    mapQuery: "Fifth Avenue South, Naples, FL",
    latitude: 26.1412,
    longitude: -81.7949,
    relatedPropertyIds: ["i102", "107-tahiti", "119-tahiti"],
    featured: true,
  },
  {
    id: "new-years-naples-bay",
    title: "New Year’s Eve on Naples Bay",
    region: "naples",
    category: "holiday",
    startDate: "2026-12-31",
    endDate: "2026-12-31",
    startTime: "8:00 PM",
    endTime: "12:30 AM",
    venue: "Naples Bay waterfront restaurants",
    city: "Naples",
    description:
      "Waterfront dining and countdown celebrations along Naples Bay.",
    mapQuery: "Naples Bay, Naples, FL",
    latitude: 26.13,
    longitude: -81.79,
    relatedPropertyIds: ["i102"],
    featured: true,
  },
  {
    id: "winter-wine-festival-week",
    title: "Naples Winter Wine Preview Week",
    region: "naples",
    category: "food",
    startDate: "2027-01-22",
    endDate: "2027-01-25",
    venue: "Various Naples venues",
    city: "Naples",
    description:
      "Tastings and wine dinners leading into Naples’ signature winter hospitality season.",
    mapQuery: "Naples, FL",
    latitude: 26.142,
    longitude: -81.7948,
    relatedPropertyIds: ["i102", "119-tahiti"],
  },
  {
    id: "everglades-eco-tour-day",
    title: "10,000 Islands Eco-Tour Day",
    region: "naples",
    category: "boating",
    startDate: "2026-09-12",
    endDate: "2026-09-12",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    venue: "Departing toward 10,000 Islands",
    city: "Naples",
    description:
      "Guided mangrove and wildlife eco-tour—especially convenient from Tahiti Street dock homes.",
    mapQuery: "Ten Thousand Islands, Florida",
    latitude: 25.9,
    longitude: -81.6,
    relatedPropertyIds: ["107-tahiti", "119-tahiti"],
    featured: true,
  },
  {
    id: "botanical-garden-lights",
    title: "Naples Botanical Garden Evening Lights",
    region: "naples",
    category: "arts",
    startDate: "2026-12-12",
    endDate: "2026-12-23",
    startTime: "5:30 PM",
    endTime: "9:00 PM",
    venue: "Naples Botanical Garden",
    city: "Naples",
    description:
      "Seasonal illuminated garden paths and family photo moments.",
    mapQuery: "Naples Botanical Garden, Naples, FL",
    latitude: 26.1105,
    longitude: -81.773,
    relatedPropertyIds: ["i102", "107-tahiti", "119-tahiti"],
  },

  // —— Treasure Cay / Abaco ——
  {
    id: "treasure-cay-beach-yoga",
    title: "Sunrise Beach Yoga — Treasure Cay",
    region: "bahamas",
    category: "sports",
    startDate: "2026-08-10",
    endDate: "2026-08-10",
    startTime: "7:00 AM",
    endTime: "8:00 AM",
    venue: "Treasure Cay Beach",
    city: "Treasure Cay",
    description:
      "Oceanfront yoga on powder-soft sand—steps from Bahama Beach Club via boardwalk.",
    mapQuery: "Treasure Cay Beach, Abaco, Bahamas",
    latitude: 26.6715,
    longitude: -77.281,
    relatedPropertyIds: ["2001-bahama"],
    featured: true,
  },
  {
    id: "abaco-full-moon-party",
    title: "Treasure Cay Full Moon Beach Gathering",
    region: "bahamas",
    category: "music",
    startDate: "2026-08-28",
    endDate: "2026-08-28",
    startTime: "7:00 PM",
    endTime: "11:00 PM",
    venue: "Treasure Cay Beach",
    city: "Treasure Cay",
    description:
      "Casual beach music, local food stalls, and moonlight on one of the world’s best beaches.",
    mapQuery: "Treasure Cay Beach, Abaco, Bahamas",
    latitude: 26.6715,
    longitude: -77.281,
    relatedPropertyIds: ["2001-bahama"],
    featured: true,
  },
  {
    id: "treasure-cay-fishing-tournament",
    title: "Abaco Invitational Fishing Weekend",
    region: "bahamas",
    category: "boating",
    startDate: "2026-09-11",
    endDate: "2026-09-13",
    startTime: "6:00 AM",
    venue: "Treasure Cay Marina",
    city: "Treasure Cay",
    description:
      "Weekend fishing tournament and marina festivities—ideal for canal-dock guests.",
    mapQuery: "Treasure Cay Marina, Bahamas",
    latitude: 26.665,
    longitude: -77.275,
    relatedPropertyIds: ["2001-bahama"],
    featured: true,
  },
  {
    id: "guana-cay-day-sail",
    title: "Great Guana Cay Day Sail & Nippers",
    region: "bahamas",
    category: "boating",
    startDate: "2026-09-26",
    endDate: "2026-09-26",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    venue: "Depart Treasure Cay Marina",
    city: "Treasure Cay",
    description:
      "Popular boat day to Great Guana Cay for reef snorkeling and the famous beach bar.",
    mapQuery: "Nippers Beach Bar, Great Guana Cay, Bahamas",
    latitude: 26.665,
    longitude: -77.11,
    relatedPropertyIds: ["2001-bahama"],
  },
  {
    id: "green-turtle-heritage",
    title: "Green Turtle Cay Heritage Day",
    region: "bahamas",
    category: "festival",
    startDate: "2026-10-10",
    endDate: "2026-10-10",
    startTime: "10:00 AM",
    endTime: "4:00 PM",
    venue: "New Plymouth, Green Turtle Cay",
    city: "Green Turtle Cay",
    description:
      "Ferry-accessible cultural day with local crafts, history walks, and island food.",
    mapQuery: "Green Turtle Cay, Abaco, Bahamas",
    latitude: 26.774,
    longitude: -77.328,
    relatedPropertyIds: ["2001-bahama"],
  },
  {
    id: "bahama-beach-club-pool-party",
    title: "Bahama Beach Club Poolside Social",
    region: "bahamas",
    category: "food",
    startDate: "2026-10-17",
    endDate: "2026-10-17",
    startTime: "2:00 PM",
    endTime: "6:00 PM",
    venue: "Bahama Beach Club Pool & Bar",
    city: "Treasure Cay",
    description:
      "Resort pool gathering with light bites and tropical drinks—steps from 2001 Bahama Beach Club.",
    mapQuery: "Bahama Beach Club, Treasure Cay, Bahamas",
    latitude: 26.6708,
    longitude: -77.2798,
    relatedPropertyIds: ["2001-bahama"],
    featured: true,
  },
  {
    id: "abaco-regatta-watch",
    title: "Abaco Regatta Watch Party",
    region: "bahamas",
    category: "sports",
    startDate: "2026-11-07",
    endDate: "2026-11-07",
    startTime: "12:00 PM",
    endTime: "6:00 PM",
    venue: "Treasure Cay waterfront",
    city: "Treasure Cay",
    description:
      "Cheer on sailboats with island music and waterfront dining.",
    mapQuery: "Treasure Cay, Abaco, Bahamas",
    latitude: 26.6767,
    longitude: -77.278,
    relatedPropertyIds: ["2001-bahama"],
  },
  {
    id: "thanksgiving-island-bbq",
    title: "Island Thanksgiving Beach BBQ",
    region: "bahamas",
    category: "holiday",
    startDate: "2026-11-26",
    endDate: "2026-11-26",
    startTime: "1:00 PM",
    endTime: "5:00 PM",
    venue: "Treasure Cay Beach",
    city: "Treasure Cay",
    description:
      "Casual Thanksgiving feast on the sand—reserve early with the resort bar.",
    mapQuery: "Treasure Cay Beach, Abaco, Bahamas",
    latitude: 26.6715,
    longitude: -77.281,
    relatedPropertyIds: ["2001-bahama"],
  },
  {
    id: "christmas-boat-parade-abaco",
    title: "Treasure Cay Christmas Boat Parade",
    region: "bahamas",
    category: "holiday",
    startDate: "2026-12-19",
    endDate: "2026-12-19",
    startTime: "6:00 PM",
    endTime: "9:00 PM",
    venue: "Treasure Cay canals & marina",
    city: "Treasure Cay",
    description:
      "Decorated boats parade the canals—excellent viewing from canal-side docks.",
    mapQuery: "Treasure Cay Marina, Bahamas",
    latitude: 26.665,
    longitude: -77.275,
    relatedPropertyIds: ["2001-bahama"],
    featured: true,
  },
  {
    id: "new-years-treasure-cay",
    title: "New Year’s Eve Beach Bonfire",
    region: "bahamas",
    category: "holiday",
    startDate: "2026-12-31",
    endDate: "2026-12-31",
    startTime: "9:00 PM",
    endTime: "12:30 AM",
    venue: "Treasure Cay Beach",
    city: "Treasure Cay",
    description:
      "Beach bonfire, music, and midnight countdown under Caribbean skies.",
    mapQuery: "Treasure Cay Beach, Abaco, Bahamas",
    latitude: 26.6715,
    longitude: -77.281,
    relatedPropertyIds: ["2001-bahama"],
    featured: true,
  },
  {
    id: "winter-snorkel-clinic",
    title: "Abaco Reef Snorkel Clinic",
    region: "bahamas",
    category: "family",
    startDate: "2027-01-16",
    endDate: "2027-01-16",
    startTime: "9:30 AM",
    endTime: "12:00 PM",
    venue: "Treasure Cay reefs",
    city: "Treasure Cay",
    description:
      "Guided snorkeling intro for families—gear tips and best nearby reefs.",
    mapQuery: "Treasure Cay snorkeling, Bahamas",
    latitude: 26.68,
    longitude: -77.25,
    relatedPropertyIds: ["2001-bahama"],
  },
];

export function parseEventDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatEventDateRange(event: LocalEvent): string {
  const start = parseEventDate(event.startDate);
  const end = parseEventDate(event.endDate);
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  if (event.startDate === event.endDate) {
    return start.toLocaleDateString("en-US", opts);
  }
  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}–${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

export function eventOccursOnDay(event: LocalEvent, dayIso: string): boolean {
  return dayIso >= event.startDate && dayIso <= event.endDate;
}

export function toDayIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getEvents(options?: {
  region?: Region | "all";
  propertyId?: string;
  from?: string;
  to?: string;
  category?: EventCategory | "all";
  featuredOnly?: boolean;
}): LocalEvent[] {
  const region = options?.region ?? "all";
  const category = options?.category ?? "all";
  return localEvents
    .filter((e) => (region === "all" ? true : e.region === region))
    .filter((e) => (category === "all" ? true : e.category === category))
    .filter((e) =>
      options?.propertyId
        ? e.relatedPropertyIds?.includes(options.propertyId) ||
          e.region ===
            (options.propertyId === "2001-bahama" ? "bahamas" : "naples")
        : true,
    )
    .filter((e) => (options?.featuredOnly ? e.featured : true))
    .filter((e) => (options?.from ? e.endDate >= options.from : true))
    .filter((e) => (options?.to ? e.startDate <= options.to : true))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function getUpcomingEvents(
  limit = 6,
  region?: Region | "all",
  fromIso?: string,
): LocalEvent[] {
  const today = fromIso ?? toDayIso(new Date());
  return getEvents({ region: region ?? "all", from: today }).slice(0, limit);
}

export function getEventsForMonth(
  year: number,
  monthIndex: number,
  region?: Region | "all",
): LocalEvent[] {
  const start = `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const end = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return getEvents({ region: region ?? "all", from: start, to: end });
}

export function monthMatrix(year: number, monthIndex: number): (Date | null)[][] {
  const first = new Date(year, monthIndex, 1);
  const startPad = first.getDay(); // 0 Sun
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, monthIndex, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}
