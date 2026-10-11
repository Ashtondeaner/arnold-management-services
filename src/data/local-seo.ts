import { properties, site, type Region } from "@/data/properties";

/** Consistent NAP (Name · Address · Phone) for local SEO */
export const nap = {
  name: site.legalName,
  legalName: site.legalName,
  brandName: site.name,
  phone: site.phone,
  phoneTel: site.phoneTel,
  email: site.email,
  streetAddress: site.headquarters.line1,
  addressLocality: site.headquarters.city,
  addressRegion: site.headquarters.state,
  postalCode: site.headquarters.zip,
  addressCountry: "US",
  addressCountryName: "United States",
  fullAddress: site.headquarters.full,
  /** HQ geo — Naples, FL commercial corridor */
  geo: {
    latitude: 26.1672,
    longitude: -81.7395,
  },
  mapQuery: encodeURIComponent(site.headquarters.full),
  googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.headquarters.full)}`,
  priceRange: "$$$",
  openingHours: ["Mo-Su 09:00-18:00"],
  currenciesAccepted: "USD",
  paymentAccepted: "Credit Card, Bank Transfer, Cash",
} as const;

export type Destination = {
  slug: string;
  region: Region;
  name: string;
  shortName: string;
  headline: string;
  intro: string;
  body: string[];
  neighborhoods: string[];
  attractions: string[];
  localKeywords: string[];
  geo: { latitude: number; longitude: number };
  geoRegion: string;
  geoPlacename: string;
  addressCountry: string;
  addressRegion: string;
  image: string;
  mapQuery: string;
  faqs: { question: string; answer: string }[];
};

export const destinations: Destination[] = [
  {
    slug: "naples-florida",
    region: "naples",
    name: "Naples, Florida",
    shortName: "Naples",
    headline: "Vacation rentals in Naples, FL",
    intro:
      "Arnold Management Services, LLC offers professionally managed vacation rentals in Naples, Florida—including Naples Bay Resort and a remodeled waterfront cottage on the Isles of Capri (Tahiti Street) with a private boat dock and direct Gulf of Mexico access.",
    body: [
      "Naples is a premier Southwest Florida destination known for Gulf beaches, Fifth Avenue South dining, world-class golf, and a year-round boating lifestyle. Guests who book with AMS stay in carefully managed homes rather than anonymous listings—backed by a local Naples headquarters at 1100 Commercial Blvd., Suite 118.",
      "Our Naples portfolio includes I102 Naples Bay Resort (marina boat rentals and full resort amenities), 107 Tahiti Street (a remodeled 2-bedroom waterfront cottage on the Isles of Capri with a private dock for boats up to 40 feet), and 119 Tahiti Street (3 bedroom coastal cottage with pool and custom boat dock). All are available to reserve online with live calendars and transparent rates.",
      "Whether you are searching for a Naples Bay Resort vacation rental, a boat-dock home near the Ten Thousand Islands, or a family coastal cottage in Naples FL, AMS provides direct booking with our partners—Andrea Arnold Jeppesen, Tam Arnold Wright, and D. Ashton Arnold. Email AALLC@ArnoldCompanies.Net for information and FAQs.",
    ],
    neighborhoods: [
      "Naples Bay Resort",
      "Isles of Capri / Tahiti Street",
      "Downtown Naples & Fifth Avenue South (nearby)",
      "Marco Island (nearby)",
      "Gulf beaches (short drive)",
    ],
    attractions: [
      "Gulf of Mexico beaches",
      "10,000 Islands / Ten Thousand Islands",
      "Fifth Avenue South shopping & dining",
      "Naples Pier & waterfront promenades",
      "Boating, fishing & island day trips",
      "Southwest Florida golf courses",
    ],
    localKeywords: [
      "vacation rentals Naples FL",
      "Naples Florida vacation homes",
      "Naples Bay Resort rental",
      "boat dock vacation rental Naples",
      "no bridges Gulf access Naples",
      "10,000 Islands vacation rental",
      "Isles of Capri vacation rental",
      "waterfront cottage Isles of Capri",
      "Marco Island nearby vacation rental",
      "Collier County vacation rental",
      "Southwest Florida vacation rental",
      "Gulf Coast Florida vacation home",
      "Naples FL short term rental",
      "book vacation rental Naples Florida",
    ],
    geo: { latitude: 26.142, longitude: -81.7948 },
    geoRegion: "US-FL",
    geoPlacename: "Naples, Florida",
    addressCountry: "US",
    addressRegion: "FL",
    image: "/images/amenity-pool.jpg",
    mapQuery: "Naples, Florida",
    faqs: [
      {
        question: "Where are your Naples vacation rentals located?",
        answer:
          "We manage I102 at Naples Bay Resort and waterfront homes on Tahiti Street in the Isles of Capri, Naples, Florida. Our office is at 1100 Commercial Blvd., Suite 118, Naples, FL 34104.",
      },
      {
        question: "Do any Naples homes include a boat dock?",
        answer:
          "Yes. 107 Tahiti Street is a remodeled waterfront cottage on the Isles of Capri with a private dock for boats up to 40 feet and direct Gulf of Mexico access. 119 Tahiti Street also features a private boat dock plus a swimming pool and custom dock.",
      },
      {
        question: "How do I book a Naples vacation rental with AMS?",
        answer:
          "Choose a property on AMS50LLC.com, select available dates in the booking calendar, and confirm online. Or call (239) 643-6333 or email AALLC@ArnoldCompanies.Net for information and FAQs.",
      },
      {
        question: "Is I102 Naples Bay Resort a marina-view unit?",
        answer:
          "I102 offers access to marina boat rentals and full Naples Bay Resort amenities. It is positioned for resort access and convenience rather than a marina view.",
      },
    ],
  },
  {
    slug: "treasure-cay-bahamas",
    region: "bahamas",
    name: "Treasure Cay, Abaco, Bahamas",
    shortName: "Treasure Cay",
    headline: "Vacation rental in Treasure Cay, Abaco",
    intro:
      "2001 Bahama Beach Club is a luxury beachfront vacation rental in Treasure Cay, Abaco, Bahamas—managed by Arnold Management Services, LLC with private canal boat dock, boardwalk beach access, and proximity to the resort pool and bar.",
    body: [
      "Treasure Cay is celebrated for one of the Caribbean’s most beautiful beaches, calm turquoise water, and a relaxed Abaco island pace. Guests staying at Bahama Beach Club enjoy beachfront living with true boating convenience.",
      "Our Treasure Cay home, 2001 Bahama Beach Club, is a luxury 4 bedroom, 3 bathroom residence with a private canal-side boat dock, boardwalk access to the sand, and close proximity to the resort pool and bar—ideal for families and groups seeking a premium Abaco getaway.",
      "Reservations are handled by Arnold Management Services from our Naples, Florida headquarters, with online booking and personal coordination from partners Andrea Arnold Jeppesen, Tam Arnold Wright, and D. Ashton Arnold. Call (239) 643-6333, email AALLC@ArnoldCompanies.Net, or book at AMS50LLC.com.",
    ],
    neighborhoods: [
      "Bahama Beach Club",
      "Treasure Cay Beach",
      "Treasure Cay Resort community",
    ],
    attractions: [
      "Treasure Cay Beach",
      "Snorkeling & island boating",
      "Resort pool & bar",
      "Abaco island day trips",
      "Caribbean fishing",
      "Quiet beachfront dining & sunsets",
    ],
    localKeywords: [
      "Treasure Cay vacation rental",
      "Abaco Bahamas vacation rental",
      "Bahama Beach Club rental",
      "2001 Bahama Beach Club",
      "beachfront vacation rental Treasure Cay",
      "Treasure Cay Abaco house rental",
      "Bahamas canal dock vacation home",
      "Caribbean vacation rental Abaco",
      "book Treasure Cay vacation home",
    ],
    geo: { latitude: 26.6767, longitude: -77.278 },
    geoRegion: "BS",
    geoPlacename: "Treasure Cay, Abaco, Bahamas",
    addressCountry: "BS",
    addressRegion: "Abaco",
    image: "/images/2001-bahama.jpg",
    mapQuery: "Treasure Cay, Abaco, Bahamas",
    faqs: [
      {
        question: "What vacation rental do you offer in Treasure Cay?",
        answer:
          "We manage 2001 Bahama Beach Club—a luxury 4 bedroom, 3 bathroom beachfront home with a private canal boat dock and boardwalk access to Treasure Cay Beach.",
      },
      {
        question: "Is the Bahama Beach Club property near the resort pool?",
        answer:
          "Yes. 2001 Bahama Beach Club is in close proximity to the resort pool and bar, while also offering private canal docking and beach boardwalk access.",
      },
      {
        question: "How do I contact AMS about a Bahamas stay?",
        answer:
          "Call (239) 643-6333, email AALLC@ArnoldCompanies.Net for information and FAQs, or book online at AMS50LLC.com. Our headquarters is in Naples, Florida.",
      },
    ],
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function propertiesForDestination(dest: Destination) {
  return properties.filter((p) => p.region === dest.region);
}

export const localBusinessKeywords = [
  "vacation rental management Naples FL",
  "vacation rental company Naples Florida",
  "short term rental manager Collier County",
  "Naples FL 34104 vacation rentals",
  "local vacation rental host Naples",
  "Treasure Cay vacation rental manager",
  "AMS50LLC Naples",
  "Arnold Management Services Naples Florida",
  ...destinations.flatMap((d) => d.localKeywords),
] as const;

export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
