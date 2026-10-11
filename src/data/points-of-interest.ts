import type { Region } from "@/data/properties";

export type PoiCategory =
  | "beach"
  | "dining"
  | "shopping"
  | "boating"
  | "golf"
  | "attraction"
  | "airport"
  | "grocery"
  | "resort"
  | "nature";

export type PointOfInterest = {
  id: string;
  name: string;
  category: PoiCategory;
  description: string;
  /** Guest-friendly distance label */
  distance: string;
  driveMinutes?: number;
  walkMinutes?: number;
  mapQuery: string;
  latitude: number;
  longitude: number;
  region: Region;
};

export const poiCategoryLabels: Record<PoiCategory, string> = {
  beach: "Beach",
  dining: "Dining",
  shopping: "Shopping",
  boating: "Boating",
  golf: "Golf",
  attraction: "Attraction",
  airport: "Airport",
  grocery: "Grocery",
  resort: "Resort",
  nature: "Nature",
};

/** Shared POI catalog for Naples & Treasure Cay */
export const pointsOfInterest: PointOfInterest[] = [
  // —— Naples ——
  {
    id: "fifth-ave-south",
    name: "Fifth Avenue South",
    category: "shopping",
    description:
      "Naples’ premier shopping and dining corridor—boutiques, galleries, and waterfront restaurants.",
    distance: "10–15 min drive",
    driveMinutes: 12,
    mapQuery: "Fifth Avenue South, Naples, FL",
    latitude: 26.1412,
    longitude: -81.7949,
    region: "naples",
  },
  {
    id: "naples-pier",
    name: "Naples Pier",
    category: "attraction",
    description:
      "Iconic Gulf pier for sunset walks, fishing, and beach access in the heart of Old Naples.",
    distance: "12–18 min drive",
    driveMinutes: 15,
    mapQuery: "Naples Pier, Naples, FL",
    latitude: 26.1317,
    longitude: -81.8067,
    region: "naples",
  },
  {
    id: "lowdermilk-beach",
    name: "Lowdermilk Beach",
    category: "beach",
    description:
      "Popular public beach with parking, concessions, and classic Gulf of Mexico shoreline.",
    distance: "15 min drive",
    driveMinutes: 15,
    mapQuery: "Lowdermilk Park Beach, Naples, FL",
    latitude: 26.1605,
    longitude: -81.8105,
    region: "naples",
  },
  {
    id: "gulf-beaches",
    name: "Gulf of Mexico Beaches",
    category: "beach",
    description:
      "Soft-sand public beaches along the Naples coastline for swimming and shelling.",
    distance: "10–20 min drive",
    driveMinutes: 15,
    mapQuery: "Naples Beach, Naples, FL",
    latitude: 26.145,
    longitude: -81.81,
    region: "naples",
  },
  {
    id: "ten-thousand-islands",
    name: "10,000 Islands",
    category: "nature",
    description:
      "Mangrove islands, fishing grounds, and boat-day destinations south of Naples.",
    distance: "By boat from dock homes",
    driveMinutes: 25,
    mapQuery: "Ten Thousand Islands, Florida",
    latitude: 25.9,
    longitude: -81.6,
    region: "naples",
  },
  {
    id: "naples-bay-resort-marina",
    name: "Naples Bay Resort Marina",
    category: "boating",
    description:
      "On-site marina with boat rentals and waterfront access for Naples Bay Resort guests.",
    distance: "On-site (I102)",
    walkMinutes: 5,
    mapQuery: "Naples Bay Resort Marina, Naples, FL",
    latitude: 26.124,
    longitude: -81.792,
    region: "naples",
  },
  {
    id: "tin-city",
    name: "Tin City",
    category: "shopping",
    description:
      "Waterfront marketplace with local shops, souvenirs, and casual dining on Naples Bay.",
    distance: "8–12 min drive",
    driveMinutes: 10,
    mapQuery: "Tin City, Naples, FL",
    latitude: 26.1345,
    longitude: -81.7905,
    region: "naples",
  },
  {
    id: "cambier-park",
    name: "Cambier Park",
    category: "attraction",
    description:
      "Downtown green space near Third Street South with events, tennis, and shade.",
    distance: "12 min drive",
    driveMinutes: 12,
    mapQuery: "Cambier Park, Naples, FL",
    latitude: 26.1385,
    longitude: -81.7995,
    region: "naples",
  },
  {
    id: "third-street-south",
    name: "Third Street South",
    category: "dining",
    description:
      "Charming Old Naples district for fine dining, boutiques, and evening strolls.",
    distance: "12–15 min drive",
    driveMinutes: 13,
    mapQuery: "Third Street South, Naples, FL",
    latitude: 26.1365,
    longitude: -81.801,
    region: "naples",
  },
  {
    id: "naples-zoo",
    name: "Naples Zoo at Caribbean Gardens",
    category: "attraction",
    description:
      "Family-friendly zoo and historic gardens—great half-day outing with kids.",
    distance: "15–20 min drive",
    driveMinutes: 18,
    mapQuery: "Naples Zoo at Caribbean Gardens, Naples, FL",
    latitude: 26.1685,
    longitude: -81.7905,
    region: "naples",
  },
  {
    id: "baker-park",
    name: "Baker Park & Gordon River Greenway",
    category: "nature",
    description:
      "Riverfront parks, trails, and playgrounds along the Gordon River corridor.",
    distance: "10–15 min drive",
    driveMinutes: 12,
    mapQuery: "Baker Park, Naples, FL",
    latitude: 26.152,
    longitude: -81.79,
    region: "naples",
  },
  {
    id: "publix-naples",
    name: "Publix Super Market",
    category: "grocery",
    description:
      "Full-service grocery for stocking the kitchen—convenient to both resort and Tahiti homes.",
    distance: "5–10 min drive",
    driveMinutes: 8,
    mapQuery: "Publix, Naples, FL 34104",
    latitude: 26.15,
    longitude: -81.76,
    region: "naples",
  },
  {
    id: "rsw-airport",
    name: "Southwest Florida International (RSW)",
    category: "airport",
    description:
      "Primary commercial airport for Naples guests—Fort Myers / RSW.",
    distance: "35–45 min drive",
    driveMinutes: 40,
    mapQuery: "Southwest Florida International Airport",
    latitude: 26.5362,
    longitude: -81.7552,
    region: "naples",
  },
  {
    id: "tiburon-golf",
    name: "Tiburon Golf Club",
    category: "golf",
    description:
      "Championship golf experience in Naples for guests who want a day on the links.",
    distance: "20 min drive",
    driveMinutes: 20,
    mapQuery: "Tiburon Golf Club, Naples, FL",
    latitude: 26.215,
    longitude: -81.77,
    region: "naples",
  },
  {
    id: "isles-of-capri",
    name: "Isles of Capri",
    category: "boating",
    description:
      "Waterfront community and boating gateway toward the 10,000 Islands.",
    distance: "15–20 min drive / by water",
    driveMinutes: 18,
    mapQuery: "Isles of Capri, Florida",
    latitude: 25.985,
    longitude: -81.72,
    region: "naples",
  },
  {
    id: "naples-botanical",
    name: "Naples Botanical Garden",
    category: "attraction",
    description:
      "World-class gardens and conservatory—ideal for a relaxed afternoon.",
    distance: "15 min drive",
    driveMinutes: 15,
    mapQuery: "Naples Botanical Garden, Naples, FL",
    latitude: 26.1105,
    longitude: -81.773,
    region: "naples",
  },
  {
    id: "mercato",
    name: "Mercato",
    category: "dining",
    description:
      "Open-air lifestyle center north of downtown with restaurants, shops, and cinema.",
    distance: "20–25 min drive",
    driveMinutes: 22,
    mapQuery: "Mercato, Naples, FL",
    latitude: 26.252,
    longitude: -81.802,
    region: "naples",
  },

  // —— Treasure Cay / Abaco ——
  {
    id: "treasure-cay-beach",
    name: "Treasure Cay Beach",
    category: "beach",
    description:
      "Often ranked among the world’s finest beaches—powder sand and turquoise water.",
    distance: "Boardwalk / short walk",
    walkMinutes: 5,
    mapQuery: "Treasure Cay Beach, Abaco, Bahamas",
    latitude: 26.6715,
    longitude: -77.281,
    region: "bahamas",
  },
  {
    id: "bahama-beach-club-pool",
    name: "Bahama Beach Club Pool & Bar",
    category: "resort",
    description:
      "Resort pool and bar steps from 2001 Bahama Beach Club for easy day lounging.",
    distance: "On-site / nearby",
    walkMinutes: 3,
    mapQuery: "Bahama Beach Club, Treasure Cay, Bahamas",
    latitude: 26.6708,
    longitude: -77.2798,
    region: "bahamas",
  },
  {
    id: "treasure-cay-marina",
    name: "Treasure Cay Marina",
    category: "boating",
    description:
      "Marina services, boat charters, and access for exploring the Abacos by water.",
    distance: "5–10 min",
    driveMinutes: 8,
    mapQuery: "Treasure Cay Marina, Bahamas",
    latitude: 26.665,
    longitude: -77.275,
    region: "bahamas",
  },
  {
    id: "treasure-cay-golf",
    name: "Treasure Cay Golf Course",
    category: "golf",
    description:
      "Island golf with tropical fairways—classic Abaco leisure day.",
    distance: "5–10 min",
    driveMinutes: 7,
    mapQuery: "Treasure Cay Golf Course, Bahamas",
    latitude: 26.68,
    longitude: -77.27,
    region: "bahamas",
  },
  {
    id: "treasure-cay-airport",
    name: "Treasure Cay Airport (TCB)",
    category: "airport",
    description:
      "Local airport serving Treasure Cay and nearby Abaco communities.",
    distance: "10–15 min",
    driveMinutes: 12,
    mapQuery: "Treasure Cay Airport, Bahamas",
    latitude: 26.745,
    longitude: -77.391,
    region: "bahamas",
  },
  {
    id: "green-turtle-cay",
    name: "Green Turtle Cay",
    category: "attraction",
    description:
      "Charming ferry-accessible cay with New Plymouth village and quiet beaches.",
    distance: "Ferry day trip",
    driveMinutes: 45,
    mapQuery: "Green Turtle Cay, Abaco, Bahamas",
    latitude: 26.774,
    longitude: -77.328,
    region: "bahamas",
  },
  {
    id: "great-guana-cay",
    name: "Great Guana Cay & Nippers",
    category: "dining",
    description:
      "Famous beach bar and reef snorkeling—popular Abaco boat or ferry outing.",
    distance: "Boat day trip",
    driveMinutes: 60,
    mapQuery: "Nippers Beach Bar, Great Guana Cay, Bahamas",
    latitude: 26.665,
    longitude: -77.11,
    region: "bahamas",
  },
  {
    id: "abaco-snorkel",
    name: "Abaco Reef Snorkeling",
    category: "nature",
    description:
      "Clear water reefs and sea life around Treasure Cay and nearby cays.",
    distance: "By boat / tour",
    mapQuery: "Treasure Cay snorkeling, Bahamas",
    latitude: 26.68,
    longitude: -77.25,
    region: "bahamas",
  },
  {
    id: "treasure-cay-market",
    name: "Treasure Cay grocery & provisions",
    category: "grocery",
    description:
      "Local shops for provisions, ice, and essentials during your island stay.",
    distance: "5–10 min",
    driveMinutes: 8,
    mapQuery: "Treasure Cay, Abaco grocery",
    latitude: 26.668,
    longitude: -77.277,
    region: "bahamas",
  },
];

/** Ordered POI ids nearest / most relevant per property */
export const propertyNearbyPoiIds: Record<string, string[]> = {
  i102: [
    "naples-bay-resort-marina",
    "tin-city",
    "fifth-ave-south",
    "third-street-south",
    "naples-pier",
    "gulf-beaches",
    "naples-botanical",
    "publix-naples",
    "baker-park",
    "rsw-airport",
  ],
  "107-tahiti": [
    "ten-thousand-islands",
    "isles-of-capri",
    "gulf-beaches",
    "naples-botanical",
    "tin-city",
    "fifth-ave-south",
    "publix-naples",
    "naples-zoo",
    "naples-pier",
    "rsw-airport",
  ],
  "119-tahiti": [
    "ten-thousand-islands",
    "isles-of-capri",
    "gulf-beaches",
    "naples-botanical",
    "tin-city",
    "fifth-ave-south",
    "third-street-south",
    "publix-naples",
    "mercato",
    "rsw-airport",
  ],
  "2001-bahama": [
    "treasure-cay-beach",
    "bahama-beach-club-pool",
    "treasure-cay-marina",
    "abaco-snorkel",
    "treasure-cay-golf",
    "treasure-cay-market",
    "green-turtle-cay",
    "great-guana-cay",
    "treasure-cay-airport",
  ],
};

export function getPoiById(id: string): PointOfInterest | undefined {
  return pointsOfInterest.find((p) => p.id === id);
}

export function getNearbyPoisForProperty(
  propertyId: string,
): PointOfInterest[] {
  const ids = propertyNearbyPoiIds[propertyId] ?? [];
  return ids
    .map((id) => getPoiById(id))
    .filter((p): p is PointOfInterest => Boolean(p));
}

export function getPoisForRegion(region: Region): PointOfInterest[] {
  return pointsOfInterest.filter((p) => p.region === region);
}

export function poisToMapLocation(poi: PointOfInterest) {
  return {
    label: poi.name,
    latitude: poi.latitude,
    longitude: poi.longitude,
    query: poi.mapQuery,
    zoom: 14,
  };
}
