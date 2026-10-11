import { properties, site, type Property } from "@/data/properties";
import {
  destinations,
  getDestinationBySlug,
  localBusinessKeywords,
  nap,
  type Destination,
} from "@/data/local-seo";
import { getPricing } from "@/data/pricing";
import { getNearbyPoisForProperty } from "@/data/points-of-interest";

/** Primary SEO keywords for Arnold Management Services, LLC */
export const siteKeywords = [
  "Arnold Management Services",
  "Arnold Management Services LLC",
  "AMS50LLC",
  "AMS50LLC.com",
  "D. Ashton Arnold",
  "Andrea Arnold Jeppesen",
  "Tam Arnold Wright",
  "AALLC@ArnoldCompanies.Net",
  "vacation rentals Naples Florida",
  "Naples FL vacation rentals",
  "Naples vacation homes",
  "vacation rental management Naples",
  "Naples Bay Resort vacation rental",
  "I102 Naples Bay Resort",
  "107 Tahiti Street Naples",
  "Isles of Capri vacation rental",
  "waterfront cottage Isles of Capri",
  "119 Tahiti Street Naples",
  "Tahiti Street vacation rental",
  "boat dock vacation rental Naples",
  "no bridges Gulf access Naples",
  "10000 Islands vacation rental",
  "Gulf of Mexico vacation home",
  "Treasure Cay vacation rental",
  "Abaco Bahamas vacation rental",
  "Bahama Beach Club Treasure Cay",
  "2001 Bahama Beach Club",
  "beachfront vacation rental Bahamas",
  "luxury vacation rentals",
  "waterfront vacation rental Florida",
  "private boat dock rental Naples",
  "coastal cottage Naples FL",
  "book vacation rental online",
  "Naples FL 34104",
  "Collier County vacation rental",
  ...localBusinessKeywords,
] as const;

export function keywordsForProperty(property: Property): string[] {
  const dest = destinations.find((d) => d.region === property.region);
  const base = [
    property.name,
    property.propertyType,
    property.location,
    property.city,
    property.country,
    `${property.bedrooms} bedroom vacation rental`,
    `${property.bathrooms} bathroom vacation home`,
    "vacation rental",
    "holiday rental",
    "short term rental",
    site.name,
    site.legalName,
    site.domain,
    nap.fullAddress,
  ];

  if (dest) base.push(...dest.localKeywords);

  if (property.region === "naples") {
    base.push(
      "Naples Florida vacation rental",
      "Naples FL vacation home",
      "Southwest Florida vacation rental",
      "Gulf Coast vacation rental",
      "near Fifth Avenue South Naples",
    );
    if (property.id === "i102") {
      base.push(
        "Naples Bay Resort",
        "marina boat rentals Naples",
        "resort vacation rental Naples",
      );
    }
    if (property.id === "107-tahiti") {
      base.push(
        "Isles of Capri",
        "Isles of Capri vacation rental",
        "waterfront cottage Isles of Capri",
        "waterfront bungalow Naples",
        "40 foot boat dock Naples",
        "near Marco Island vacation rental",
        "remodeled waterfront home Naples",
      );
    }
    if (property.id === "107-tahiti" || property.id === "119-tahiti") {
      base.push(
        "Tahiti Street Naples",
        "private boat dock Naples",
        "no bridges Gulf access",
        "10,000 Islands",
        "Ten Thousand Islands vacation rental",
      );
    }
    if (property.id === "119-tahiti") {
      base.push(
        "coastal cottage Naples",
        "vacation rental with pool Naples",
        "custom boat dock Naples",
      );
    }
  }

  if (property.region === "bahamas") {
    base.push(
      "Treasure Cay Abaco",
      "Abaco Bahamas vacation rental",
      "Bahama Beach Club",
      "beachfront vacation rental Bahamas",
      "canal boat dock Bahamas",
      "Caribbean vacation home",
    );
  }

  return [...new Set(base)];
}

export function keywordsToMeta(keywords: readonly string[]): string {
  return keywords.join(", ");
}

export type MetaEntry =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string };

export function buildPageMeta(options: {
  title: string;
  description: string;
  keywords?: readonly string[];
  path?: string;
  image?: string;
  type?: string;
  geo?: {
    region?: string;
    placename?: string;
    position?: string; // "lat;lng"
  };
}): MetaEntry[] {
  const keywords = options.keywords ?? siteKeywords;
  const url = options.path
    ? `https://${site.domain.replace(/\/$/, "")}${options.path.startsWith("/") ? options.path : `/${options.path}`}`
    : `https://${site.domain}`;
  const image = options.image
    ? options.image.startsWith("http")
      ? options.image
      : `https://${site.domain}${options.image}`
    : `https://${site.domain}/images/hero.jpg`;

  const geoRegion = options.geo?.region ?? "US-FL";
  const geoPlacename = options.geo?.placename ?? "Naples, Florida";
  const geoPosition =
    options.geo?.position ??
    `${nap.geo.latitude};${nap.geo.longitude}`;
  const [lat, lng] = geoPosition.split(";");

  return [
    { title: options.title },
    { name: "description", content: options.description },
    { name: "keywords", content: keywordsToMeta(keywords) },
    { name: "author", content: `${site.legalName} · Partners: Andrea Arnold Jeppesen, Tam Arnold Wright, D. Ashton Arnold` },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { name: "geo.region", content: geoRegion },
    { name: "geo.placename", content: geoPlacename },
    { name: "geo.position", content: geoPosition },
    { name: "ICBM", content: `${lat}, ${lng}` },
    {
      name: "business:contact_data:street_address",
      content: nap.streetAddress,
    },
    {
      name: "business:contact_data:locality",
      content: nap.addressLocality,
    },
    {
      name: "business:contact_data:region",
      content: nap.addressRegion,
    },
    {
      name: "business:contact_data:postal_code",
      content: nap.postalCode,
    },
    {
      name: "business:contact_data:country_name",
      content: nap.addressCountryName,
    },
    {
      name: "business:contact_data:phone_number",
      content: nap.phone,
    },
    {
      name: "business:contact_data:email",
      content: nap.email,
    },
    { name: "og:locale", content: "en_US" },
    { property: "og:title", content: options.title },
    { property: "og:description", content: options.description },
    { property: "og:type", content: options.type ?? "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: site.legalName },
    { property: "og:locale", content: "en_US" },
    { property: "og:image", content: image },
    {
      property: "place:location:latitude",
      content: String(lat),
    },
    {
      property: "place:location:longitude",
      content: String(lng),
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: options.title },
    { name: "twitter:description", content: options.description },
    { name: "twitter:image", content: image },
  ];
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LodgingBusiness", "LocalBusiness", "TravelAgency"],
    "@id": `https://${site.domain}/#organization`,
    name: nap.name,
    legalName: nap.legalName,
    alternateName: [site.name, site.shortName, "AMS50 LLC", "AMS50LLC"],
    url: `https://${site.domain}`,
    email: nap.email,
    telephone: nap.phone,
    description: `${site.tagline}. Headquarters in Naples, Florida. Vacation rentals in Naples FL and Treasure Cay, Abaco, Bahamas.`,
    keywords: keywordsToMeta(siteKeywords),
    image: `https://${site.domain}/images/hero.jpg`,
    logo: `https://${site.domain}/images/hero.jpg`,
    priceRange: nap.priceRange,
    currenciesAccepted: nap.currenciesAccepted,
    paymentAccepted: nap.paymentAccepted,
    openingHours: nap.openingHours,
    foundingLocation: {
      "@type": "Place",
      name: "Naples, Florida",
    },
    founder: site.principals.map((p) => ({
      "@type": "Person",
      name: p.name,
      jobTitle: p.title,
      email: site.email,
      worksFor: { "@id": `https://${site.domain}/#organization` },
    })),
    employee: site.principals.map((p) => ({
      "@type": "Person",
      name: p.name,
      jobTitle: p.title,
      email: site.email,
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: nap.streetAddress,
      addressLocality: nap.addressLocality,
      addressRegion: nap.addressRegion,
      postalCode: nap.postalCode,
      addressCountry: nap.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: nap.geo.latitude,
      longitude: nap.geo.longitude,
    },
    hasMap: nap.googleMapsUrl,
    areaServed: [
      {
        "@type": "City",
        name: "Naples",
        containedInPlace: {
          "@type": "State",
          name: "Florida",
        },
      },
      {
        "@type": "AdministrativeArea",
        name: "Collier County",
        containedInPlace: {
          "@type": "State",
          name: "Florida",
        },
      },
      {
        "@type": "Place",
        name: "Treasure Cay, Abaco, Bahamas",
        geo: {
          "@type": "GeoCoordinates",
          latitude: 26.6767,
          longitude: -77.278,
        },
      },
    ],
    knowsAbout: [
      "Vacation rental management",
      "Naples Florida short-term rentals",
      "Treasure Cay beachfront rentals",
      "Waterfront and boat-dock homes",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: nap.phone,
        contactType: "reservations",
        areaServed: ["US", "BS"],
        availableLanguage: ["English"],
        email: nap.email,
      },
      {
        "@type": "ContactPoint",
        telephone: nap.phone,
        contactType: "customer service",
        areaServed: ["Naples, FL", "Treasure Cay, Bahamas"],
        availableLanguage: ["English"],
      },
    ],
    makesOffer: properties.map((p) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "VacationRental",
        name: p.name,
        url: `https://${site.domain}/properties/${p.slug}`,
      },
      areaServed:
        p.region === "naples" ? "Naples, Florida" : "Treasure Cay, Abaco",
    })),
    department: destinations.map((d) => ({
      "@type": "LocalBusiness",
      name: `${site.name} — ${d.name}`,
      url: `https://${site.domain}/destinations/${d.slug}`,
      areaServed: d.name,
    })),
  };
}

export function vacationRentalJsonLd(property: Property) {
  const pricing = getPricing(property.id);
  const dest = destinations.find((d) => d.region === property.region);
  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: property.name,
    description: property.tagline,
    url: `https://${site.domain}/properties/${property.slug}`,
    image: property.gallery.map((src) =>
      src.startsWith("http") ? src : `https://${site.domain}${src}`,
    ),
    keywords: keywordsToMeta(keywordsForProperty(property)),
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: property.sleeps,
    },
    floorSize: property.sqft
      ? {
          "@type": "QuantitativeValue",
          value: property.sqft,
          unitCode: "FTK",
        }
      : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city,
      addressRegion: property.region === "naples" ? "FL" : "Abaco",
      addressCountry: property.region === "naples" ? "US" : "BS",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: property.map.latitude,
      longitude: property.map.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.map.query)}`,
    containedInPlace: dest
      ? {
          "@type": "Place",
          name: dest.name,
          url: `https://${site.domain}/destinations/${dest.slug}`,
        }
      : undefined,
    amenityFeature: property.amenities.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    subjectOf: getNearbyPoisForProperty(property.id).slice(0, 8).map((poi) => ({
      "@type": "TouristAttraction",
      name: poi.name,
      description: poi.description,
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(poi.mapQuery)}`,
      geo: {
        "@type": "GeoCoordinates",
        latitude: poi.latitude,
        longitude: poi.longitude,
      },
    })),
    offers: pricing
      ? {
          "@type": "Offer",
          priceCurrency: pricing.currency,
          price: pricing.nightlyRate,
          unitText: "NIGHT",
          description: `${pricing.nightlyRate} per night ${pricing.rateSuffix}`,
          url: `https://${site.domain}/book?property=${property.slug}`,
          availability: "https://schema.org/InStock",
        }
      : undefined,
    provider: {
      "@id": `https://${site.domain}/#organization`,
      "@type": "LocalBusiness",
      name: site.legalName,
      telephone: nap.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: nap.streetAddress,
        addressLocality: nap.addressLocality,
        addressRegion: nap.addressRegion,
        postalCode: nap.postalCode,
        addressCountry: nap.addressCountry,
      },
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.legalName,
    alternateName: site.domain,
    url: `https://${site.domain}`,
    description: site.tagline,
    keywords: keywordsToMeta(siteKeywords),
    inLanguage: "en-US",
    publisher: {
      "@id": `https://${site.domain}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `https://${site.domain}/properties?region={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://${site.domain}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function destinationJsonLd(dest: Destination) {
  const homes = properties.filter((p) => p.region === dest.region);
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: dest.name,
    description: dest.intro,
    url: `https://${site.domain}/destinations/${dest.slug}`,
    image: `https://${site.domain}${dest.image}`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: dest.geo.latitude,
      longitude: dest.geo.longitude,
    },
    touristType: "Vacation rental travelers",
    containsPlace: homes.map((p) => ({
      "@type": "VacationRental",
      name: p.name,
      url: `https://${site.domain}/properties/${p.slug}`,
    })),
    provider: {
      "@id": `https://${site.domain}/#organization`,
    },
  };
}

export function localServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Vacation rental management & direct booking",
    serviceType: "Vacation rental management",
    provider: {
      "@id": `https://${site.domain}/#organization`,
    },
    areaServed: destinations.map((d) => ({
      "@type": "Place",
      name: d.name,
    })),
    url: `https://${site.domain}/book`,
  };
}

export { getDestinationBySlug, destinations, nap };
