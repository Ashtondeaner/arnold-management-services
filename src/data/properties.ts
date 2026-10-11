export type Region = "naples" | "bahamas";

export type Property = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  /** Professional classification shown on listings */
  propertyType: string;
  region: Region;
  location: string;
  city: string;
  country: string;
  /** Short headline for cards and meta */
  tagline: string;
  /** Full description; paragraphs separated by blank lines */
  description: string;
  bedrooms: number;
  bathrooms: number;
  sleeps: number;
  sqft?: number;
  heroImage: string;
  gallery: string[];
  amenities: string[];
  highlights: string[];
  featured: boolean;
  /** Map pin for interactive Google Maps */
  map: {
    latitude: number;
    longitude: number;
    query: string;
    zoom?: number;
  };
};

export type Principal = {
  name: string;
  title: string;
};

export const site = {
  name: "Arnold Management Services",
  shortName: "AMS",
  legalName: "Arnold Management Services, LLC",
  domain: "AMS50LLC.com",
  tagline: "Private coastal residences in Naples and the Bahamas",
  /** Primary email for information, FAQ, and guest inquiries */
  email: "AALLC@ArnoldCompanies.Net",
  phone: "(239) 643-6333",
  phoneTel: "+12396436333",
  headquarters: {
    line1: "1100 Commercial Blvd., Suite 118",
    line2: "Naples, FL 34104",
    city: "Naples",
    state: "FL",
    zip: "34104",
    full: "1100 Commercial Blvd., Suite 118, Naples, FL 34104",
  },
  /** All principal partners / hosts */
  principals: [
    { name: "Andrea Arnold Jeppesen", title: "Partner / Host" },
    { name: "Tam Arnold Wright", title: "Partner / Host" },
    { name: "D. Ashton Arnold", title: "Chairman / Partner" },
  ] as Principal[],
  /**
   * Chairman contact for short single-name contexts.
   * Prefer `principals` when listing full leadership.
   */
  principal: {
    name: "D. Ashton Arnold",
    title: "Chairman / Partner",
    email: "AALLC@ArnoldCompanies.Net",
  },
  locations: ["Naples, Florida", "Treasure Cay, Abaco, Bahamas"] as const,
};

/** "Andrea Arnold Jeppesen, Tam Arnold Wright, and D. Ashton Arnold" */
export function teamNamesList(
  principals: readonly Principal[] = site.principals,
): string {
  if (principals.length === 0) return "";
  if (principals.length === 1) return principals[0].name;
  if (principals.length === 2) {
    return `${principals[0].name} and ${principals[1].name}`;
  }
  const head = principals
    .slice(0, -1)
    .map((p) => p.name)
    .join(", ");
  return `${head}, and ${principals[principals.length - 1].name}`;
}

export const properties: Property[] = [
  {
    id: "i102",
    slug: "i102-naples-bay-resort",
    name: "I102 Naples Bay Resort",
    shortName: "I102",
    propertyType: "Resort Residence",
    region: "naples",
    location: "Naples Bay Resort",
    city: "Naples",
    country: "Florida, USA",
    tagline:
      "A refined Naples Bay Resort residence with marina boat rentals and full resort privileges.",
    description: `Welcome to I102 Naples Bay Resort, a professionally appointed residence within one of Naples’ most distinguished waterfront communities. Guests enjoy the convenience of on-site marina boat rentals and unrestricted access to the full complement of Naples Bay Resort amenities—including resort pools, dining, fitness facilities, and guest services.

This is resort living defined by access and ease rather than a marina vista. From your residence, step into a complete hospitality environment designed for leisure: rent a vessel for a day on the water, lounge by the pool, or stroll to resort dining before exploring Fifth Avenue South and the Gulf beaches just minutes away.

Ideal for couples and families seeking a polished Southwest Florida base, I102 combines thoughtful interiors with the operational advantages of true resort management—so your stay remains seamless from arrival through departure.`,
    bedrooms: 2,
    bathrooms: 2,
    sleeps: 6,
    sqft: 1450,
    heroImage: "/images/i102-naples-bay/01-living.jpg",
    gallery: [
      "/images/i102-naples-bay/01-living.jpg",
      "/images/i102-naples-bay/02-living-room.jpg",
      "/images/i102-naples-bay/03-living-kitchen.jpg",
      "/images/i102-naples-bay/04-great-room.jpg",
      "/images/i102-naples-bay/05-kitchen.jpg",
      "/images/i102-naples-bay/06-kitchen-detail.jpg",
      "/images/i102-naples-bay/07-dining.jpg",
      "/images/i102-naples-bay/08-master-bedroom.jpg",
      "/images/i102-naples-bay/09-master-bath.jpg",
      "/images/i102-naples-bay/10-guest-bedroom.jpg",
      "/images/i102-naples-bay/11-guest-bath.jpg",
      "/images/i102-naples-bay/12-lanai.jpg",
    ],
    amenities: [
      "Marina boat rental access",
      "Full Naples Bay Resort amenities",
      "Resort swimming pools",
      "Fully equipped kitchen",
      "In-unit washer & dryer",
      "High-speed Wi-Fi",
      "Assigned parking",
      "Smart television",
      "Central air conditioning",
      "On-site resort dining",
    ],
    highlights: [
      "On-site marina boat rentals for guest use",
      "Complete access to Naples Bay Resort amenities",
      "Minutes from Fifth Avenue South and Gulf beaches",
    ],
    map: {
      latitude: 26.1361,
      longitude: -81.78305,
      query: "985 Sandpiper Street, Naples Bay Resort, Naples, FL 34102",
      zoom: 16,
    },
    featured: true,
  },
  {
    id: "107-tahiti",
    slug: "107-tahiti-street",
    name: "107 Tahiti Street",
    shortName: "107 Tahiti",
    propertyType: "Waterfront Cottage",
    region: "naples",
    location: "Isles of Capri",
    city: "Naples",
    country: "Florida, USA",
    tagline: "Waterfront Cottage on the Isles of Capri",
    description: `Nestled in the tropical beauty of the Isles of Capri, this beautifully remodeled 2-bedroom, 2-bath waterfront home offers a perfect blend of modern comfort and laid-back island charm. Completely updated with a brand-new kitchen and stylish bathrooms, the home provides everything you need for a relaxing coastal escape. Furnished with a cozy yet elegant touch, every corner of this cottage was designed to help you unwind and feel at ease.

Step inside and you’ll discover a bright, open layout filled with natural light and coastal-inspired décor. The fully equipped kitchen features new appliances, stone counters, and all the essentials for preparing fresh seafood feasts. The living and dining areas flow seamlessly, making it easy to gather with family and friends. With two comfortable bedrooms and updated bathrooms, this home accommodates up to four guests with convenience and style.

Outdoors, the property truly shines. A covered lanai and private dock set the stage for afternoons spent lounging with a drink in hand, spotting dolphins in the water, or casting a line to fish right from your backyard. The dock can accommodate boats up to 40 feet, providing direct Gulf of Mexico access for boating and water adventures. Whether you’re enjoying a quiet sunrise over the water or watching the sky transform at sunset, the setting is pure coastal bliss.

Beyond the home, the Isles of Capri is a vibrant yet tranquil island community filled with character. Here you’ll find four restaurants, three marinas, and abundant wildlife all just steps away. Located only one mile from Marco Island and just 20 minutes from Downtown Naples, you can explore upscale dining, world-class golf, boutique shopping, and pristine white-sand beaches with ease. From casual island days to cosmopolitan nights, this location balances serenity with access to everything.

Perfect for couples, small families, or anyone seeking an island escape, this waterfront bungalow delivers an unforgettable Southwest Florida experience. With its combination of modern updates, direct Gulf access, and serene island setting, it’s an ideal retreat where you can relax, recharge, and embrace the sights, sounds, and flavors of true coastal living.`,
    bedrooms: 2,
    bathrooms: 2,
    sleeps: 4,
    sqft: 1400,
    heroImage: "/images/107-tahiti/01-front-yard.jpg",
    gallery: [
      "/images/107-tahiti/01-front-yard.jpg",
      "/images/107-tahiti/02-entry.jpg",
      "/images/107-tahiti/03-front-porch.jpg",
      "/images/107-tahiti/04-aerial-front.jpg",
      "/images/107-tahiti/05-aerial-rear.jpg",
      "/images/107-tahiti/06-family-room.jpg",
      "/images/107-tahiti/07-dining-kitchen.jpg",
      "/images/107-tahiti/08-kitchen.jpg",
      "/images/107-tahiti/09-kitchen-laundry.jpg",
      "/images/107-tahiti/10-master-bedroom.jpg",
      "/images/107-tahiti/11-master-bedroom-2.jpg",
      "/images/107-tahiti/12-master-bath.jpg",
      "/images/107-tahiti/13-guest-bedroom.jpg",
      "/images/107-tahiti/14-guest-bath.jpg",
      "/images/107-tahiti/15-back-of-house.jpg",
      "/images/107-tahiti/16-back-deck.jpg",
      "/images/107-tahiti/17-patio.jpg",
      "/images/107-tahiti/18-back-yard.jpg",
      "/images/107-tahiti/19-walkway.jpg",
      "/images/107-tahiti/20-dock-to-house.jpg",
      "/images/107-tahiti/21-boat-dock.jpg",
      "/images/107-tahiti/22-canal.jpg",
      "/images/107-tahiti/23-grill.jpg",
    ],
    amenities: [
      "Private boat dock (up to 40 ft)",
      "Direct Gulf of Mexico access",
      "Covered lanai",
      "Brand-new kitchen with stone counters",
      "New appliances",
      "Updated bathrooms",
      "Fully remodeled interiors",
      "Coastal-inspired furnishings",
      "Washer & dryer",
      "High-speed Wi-Fi",
      "Driveway parking",
      "Outdoor seating",
    ],
    highlights: [
      "Beautifully remodeled 2-bedroom, 2-bath waterfront cottage",
      "Private dock for boats up to 40 feet with direct Gulf access",
      "Covered lanai for fishing, dolphin-watching, sunrise and sunset",
      "One mile from Marco Island; 20 minutes to Downtown Naples",
    ],
    map: {
      latitude: 25.98007,
      longitude: -81.73009,
      query: "107 Tahiti Street, Naples, FL 34113",
      zoom: 17,
    },
    featured: true,
  },
  {
    id: "119-tahiti",
    slug: "119-tahiti-street",
    name: "119 Tahiti Street",
    shortName: "119 Tahiti",
    propertyType: "Coastal Cottage",
    region: "naples",
    location: "Tahiti Street",
    city: "Naples",
    country: "Florida, USA",
    tagline:
      "Three-bedroom coastal cottage with swimming pool, custom boat dock, and no-bridges Gulf access.",
    description: `Presenting 119 Tahiti Street, a charming coastal cottage offering three bedrooms and three bathrooms, a private swimming pool, and a custom boat dock with fast, no-bridges access to the Gulf of Mexico and the 10,000 Islands.

Mornings begin on the water; afternoons unwind poolside. This residence is purpose-built for boaters and families who want private dock privileges, resort-style outdoor living, and open-water freedom without the inconvenience of bridge clearances. The custom dock supports an active Southwest Florida lifestyle—from fishing and cruising to island day trips—while the pool and outdoor spaces create a private sanctuary at home.

Managed to a professional hospitality standard, 119 Tahiti Street delivers space, water access, and comfort in equal measure—an exceptional Naples cottage for multi-generational gatherings and extended stays.`,
    bedrooms: 3,
    bathrooms: 3,
    sleeps: 8,
    sqft: 1900,
    heroImage: "/images/119-tahiti/01-aerial-sunset.jpg",
    gallery: [
      "/images/119-tahiti/01-aerial-sunset.jpg",
      "/images/119-tahiti/02-aerial-day.jpg",
      "/images/119-tahiti/03-aerial-overhead.jpg",
      "/images/119-tahiti/04-waterfront-dusk.jpg",
      "/images/119-tahiti/05-dock-boat.jpg",
      "/images/119-tahiti/06-boat-side.jpg",
      "/images/119-tahiti/07-boat-engines.jpg",
      "/images/119-tahiti/08-boat-lift.jpg",
    ],
    amenities: [
      "Private swimming pool",
      "Custom boat dock",
      "No-bridges Gulf access",
      "10,000 Islands access",
      "Fully equipped kitchen",
      "Washer & dryer",
      "High-speed Wi-Fi",
      "Pool deck & outdoor living",
      "Central air conditioning",
      "Family-friendly layout",
    ],
    highlights: [
      "Three-bedroom, three-bathroom coastal cottage",
      "Private swimming pool and custom boat dock",
      "Fast no-bridges access to the Gulf and 10,000 Islands",
    ],
    map: {
      latitude: 25.97991,
      longitude: -81.72985,
      query: "119 Tahiti Street, Naples, FL 34113",
      zoom: 17,
    },
    featured: true,
  },
  {
    id: "2001-bahama",
    slug: "2001-bahama-beach-club",
    name: "2001 Bahama Beach Club",
    shortName: "Bahama Beach Club",
    propertyType: "Luxury Beachfront Residence",
    region: "bahamas",
    location: "Bahama Beach Club",
    city: "Treasure Cay",
    country: "Abaco, Bahamas",
    tagline:
      "Luxury four-bedroom beachfront residence with private canal dock, boardwalk beach access, and Bahama Beach Club resort living.",
    description: `Experience 2001 Bahama Beach Club, a luxury four-bedroom, three-bathroom beachfront residence in Treasure Cay, Abaco. Bathed by the emerald-green waters of the Bahamian Sea and surrounded by lush tropical gardens, swaying coconut palms, and glorious vistas, this distinguished island home features a private canal-side boat dock, boardwalk access to silken white sand, and convenient proximity to the resort pool and bar.

Set along one of the Caribbean’s most celebrated stretches of shoreline, the property pairs true beachfront living with practical boating convenience. Keep your vessel at the private canal dock, stroll the boardwalk to turquoise water, and enjoy resort amenities just moments away—plunge into an aquamarine sea, float sun-drenched in a freshwater pool, luxuriate in a revitalizing Jacuzzi, or sip a Bahama Mama, Goombay Smash, or Rum Punch at the in-pool or island beach bar. Lie in the shade of palm fronds, refreshed by trade-wind breezes blown in from the Caribbean.

At Bahama Beach Club the choice is entirely yours: escape into the soothing calm of luxurious amenities and natural surroundings, or come play. There is an aquatic thrill for guests of all ages—snorkeling over vibrantly colored coral reefs, scuba diving among dolphins, starfish, and metallic blue angelfish, world-class deep-sea fishing, sailing, or water skiing. Spend a morning beachcombing, take an out-island trip by ferry, enjoy championship golf, tennis, and beach volleyball, then return home for a beach party, steel-band island music, or a barbecue.

Spacious enough for families and larger groups, 2001 Bahama Beach Club is managed by Arnold Management Services, LLC to the standards discerning travelers expect. Warm, relaxed, and intimate, this Abaco residence offers flawless island hospitality, a spectacular view of the sea, and an unforgettable setting in which to rejuvenate body and soul in the permanent green truth of the tropics.`,
    bedrooms: 4,
    bathrooms: 3,
    sleeps: 10,
    sqft: 2200,
    heroImage: "/images/2001-bahama/01-boardwalk-beach.jpg",
    gallery: [
      "/images/2001-bahama/01-boardwalk-beach.jpg",
      "/images/2001-bahama/02-porch-beach-view.jpg",
      "/images/2001-bahama/03-porch-ocean.jpg",
      "/images/2001-bahama/04-porch-dining.jpg",
      "/images/2001-bahama/05-living-ocean-view.jpg",
      "/images/2001-bahama/06-living-room.jpg",
      "/images/2001-bahama/07-living-seating.jpg",
      "/images/2001-bahama/08-dining.jpg",
      "/images/2001-bahama/09-kitchen.jpg",
      "/images/2001-bahama/10-kitchen-to-living.jpg",
      "/images/2001-bahama/11-wet-bar.jpg",
      "/images/2001-bahama/12-guest-bedroom.jpg",
      "/images/2001-bahama/13-guest-bedroom-2.jpg",
      "/images/2001-bahama/14-bedroom.jpg",
      "/images/2001-bahama/15-bathroom.jpg",
      "/images/2001-bahama/16-bathroom-suite.jpg",
    ],
    amenities: [
      "Beachfront residence",
      "Private canal boat dock",
      "Boardwalk beach access",
      "Near resort pool & bar",
      "Fully equipped kitchen",
      "High-speed Wi-Fi",
      "Air conditioning",
      "Outdoor living space",
      "Treasure Cay resort community",
      "Family & group friendly",
    ],
    highlights: [
      "Luxury four-bedroom, three-bathroom beachfront home",
      "Private canal dock with boardwalk access to silken white sand",
      "Close proximity to the resort pool, Jacuzzi, and island beach bar",
      "Snorkeling, diving, fishing, golf, and unhurried island days",
    ],
    map: {
      latitude: 26.6705,
      longitude: -77.2795,
      query: "Bahama Beach Club, Treasure Cay, Abaco, Bahamas",
      zoom: 15,
    },
    featured: true,
  },
];

/** Split a multi-paragraph description into display-ready blocks */
export function descriptionParagraphs(description: string): string[] {
  return description
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function getPropertiesByRegion(region?: Region | "all"): Property[] {
  if (!region || region === "all") return properties;
  return properties.filter((p) => p.region === region);
}

export const regionLabels: Record<Region | "all", string> = {
  all: "All destinations",
  naples: "Naples, Florida",
  bahamas: "Treasure Cay, Bahamas",
};
