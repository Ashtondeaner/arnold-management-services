import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Ruler,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BookingWidget } from "@/components/booking/booking-widget";
import { GoogleMap } from "@/components/google-map";
import { UpcomingEventsWidget } from "@/components/events/event-calendar";
import {
  CompactPoiList,
  NearbyPoisSection,
} from "@/components/nearby-pois";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPricing } from "@/data/pricing";
import {
  descriptionParagraphs,
  getPropertyBySlug,
  properties,
  site,
  teamNamesList,
} from "@/data/properties";
import { destinations } from "@/data/local-seo";
import {
  breadcrumbJsonLd,
  buildPageMeta,
  keywordsForProperty,
  vacationRentalJsonLd,
} from "@/data/seo";
import { formatMoney } from "@/lib/booking-engine";

export const Route = createFileRoute("/properties/$slug")({
  loader: ({ params }) => {
    const property = getPropertyBySlug(params.slug);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.property) {
      return {
        meta: buildPageMeta({
          title: `Property | ${site.legalName}`,
          description: site.tagline,
          path: "/properties",
        }),
      };
    }
    const p = loaderData.property;
    const pricing = getPricing(p.id);
    const dest = destinations.find((d) => d.region === p.region);
    const rateBit = pricing
      ? ` From ${formatMoney(pricing.nightlyRate)}/night ${pricing.rateSuffix}.`
      : "";
    return {
      meta: buildPageMeta({
        title: `${p.name} | ${p.propertyType} in ${p.city} | ${site.legalName}`,
        description: `${p.name} — ${p.tagline} ${p.bedrooms} BR / ${p.bathrooms} BA, sleeps ${p.sleeps}.${rateBit} Managed locally by ${site.legalName}, Naples FL. Book online.`,
        keywords: keywordsForProperty(p),
        path: `/properties/${p.slug}`,
        image: p.heroImage,
        type: "article",
        geo: {
          region: dest?.geoRegion ?? "US-FL",
          placename: dest?.geoPlacename ?? `${p.city}`,
          position: `${p.map.latitude};${p.map.longitude}`,
        },
      }),
      links: [
        {
          rel: "canonical",
          href: `https://${site.domain}/properties/${p.slug}`,
        },
      ],
    };
  },
  component: PropertyDetailPage,
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl">Property not found</h1>
      <p className="mt-2 text-fg-muted">
        That listing isn’t in our portfolio.
      </p>
      <Button asChild className="mt-6">
        <Link to="/properties">Back to properties</Link>
      </Button>
    </div>
  ),
});

function PropertyDetailPage() {
  const { property } = Route.useLoaderData();
  const others = properties.filter((p) => p.id !== property.id).slice(0, 3);
  const pricing = getPricing(property.id);
  const paragraphs = descriptionParagraphs(property.description);
  const dest = destinations.find((d) => d.region === property.region);
  const specsLine = [
    `${property.bedrooms} Bedroom${property.bedrooms === 1 ? "" : "s"}`,
    `${property.bathrooms} Bathroom${property.bathrooms === 1 ? "" : "s"}`,
    `Sleeps ${property.sleeps}`,
    property.sqft ? `${property.sqft.toLocaleString()} sq ft` : null,
  ]
    .filter(Boolean)
    .join("  ·  ");

  const mapLocation = {
    label: property.name,
    latitude: property.map.latitude,
    longitude: property.map.longitude,
    query: property.map.query,
    zoom: property.map.zoom ?? 15,
  };

  return (
    <div className="pb-16 md:pb-24">
      <SeoJsonLd data={vacationRentalJsonLd(property)} />
      <SeoJsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Properties", path: "/properties" },
          ...(dest
            ? [
                {
                  name: dest.name,
                  path: `/destinations/${dest.slug}`,
                },
              ]
            : []),
          {
            name: property.name,
            path: `/properties/${property.slug}`,
          },
        ])}
      />

      <div className="border-b border-border bg-bg-elevated">
        <div className="container-page py-6">
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-fg-subtle"
          >
            <Link to="/" className="hover:text-fg">
              Home
            </Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-fg">
              Properties
            </Link>
            {dest ? (
              <>
                <span>/</span>
                <Link
                  to="/destinations/$slug"
                  params={{ slug: dest.slug }}
                  className="hover:text-fg"
                >
                  {dest.shortName}
                </Link>
              </>
            ) : null}
            <span>/</span>
            <span className="text-fg-muted">{property.name}</span>
          </nav>
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-fg-muted">
            <Link to="/properties">
              <ArrowLeft className="size-4" />
              All properties
            </Link>
          </Button>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">{property.propertyType}</Badge>
                <Badge variant="outline">
                  {property.region === "bahamas"
                    ? "Treasure Cay, Bahamas"
                    : "Naples, Florida"}
                </Badge>
                {pricing ? (
                  <Badge variant="outline">
                    {formatMoney(pricing.nightlyRate)}/night {pricing.rateSuffix}
                  </Badge>
                ) : null}
              </div>
              <h1 className="mt-3 font-display text-3xl tracking-tight text-fg text-balance md:text-5xl">
                {property.name}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-fg-muted">
                <MapPin className="size-4 shrink-0" />
                {property.location} · {property.city}, {property.country}
              </p>
              <p className="mt-3 text-sm font-medium tracking-wide text-fg">
                {specsLine}
              </p>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-fg-muted text-pretty">
                {property.tagline}
              </p>
              {dest ? (
                <p className="mt-3 text-sm text-fg-muted">
                  Part of our{" "}
                  <Link
                    to="/destinations/$slug"
                    params={{ slug: dest.slug }}
                    className="font-medium text-primary hover:underline"
                  >
                    {dest.name}
                  </Link>{" "}
                  vacation rental collection · Managed from Naples, FL{" "}
                  {site.headquarters.zip}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Button asChild size="lg" className="shrink-0">
                <a href="#book">Check availability</a>
              </Button>
              <Button asChild size="lg" variant="secondary" className="shrink-0">
                <a href="#location-map">View map</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page pt-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <PropertyGallery
              name={property.name}
              city={property.city}
              gallery={property.gallery}
            />

            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Property description
              </p>
              <h2 className="mt-2 font-display text-2xl text-fg text-balance">
                About {property.name}
              </h2>
              <div className="mt-5 space-y-4">
                {paragraphs.map((para) => (
                  <p
                    key={para.slice(0, 48)}
                    className="text-base leading-[1.7] text-fg-muted text-pretty"
                  >
                    {para}
                  </p>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  {
                    icon: BedDouble,
                    label: "Bedrooms",
                    value: String(property.bedrooms),
                  },
                  {
                    icon: Bath,
                    label: "Bathrooms",
                    value: String(property.bathrooms),
                  },
                  {
                    icon: Users,
                    label: "Sleeps",
                    value: String(property.sleeps),
                  },
                  {
                    icon: Ruler,
                    label: "Size",
                    value: property.sqft
                      ? `${property.sqft.toLocaleString()} sq ft`
                      : "—",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border bg-bg-elevated p-4"
                  >
                    <Icon className="size-4 text-primary" />
                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-fg-subtle">
                      {label}
                    </p>
                    <p className="mt-0.5 font-display text-xl text-fg">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <h3 className="font-display text-xl text-fg">
                  Property highlights
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {property.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-fg-muted"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <h3 className="font-display text-xl text-fg">
                  Amenities & features
                </h3>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {property.amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2.5 rounded-lg border border-border bg-bg-elevated px-3.5 py-2.5 text-sm text-fg"
                    >
                      <Check className="size-3.5 shrink-0 text-primary" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <NearbyPoisSection
                propertyId={property.id}
                title={`Nearby points of interest — ${property.city}`}
              />

              <UpcomingEventsWidget
                propertyId={property.id}
                region={property.region}
                title={`Events near ${property.name}`}
              />

              <section id="location-map" className="mt-12 scroll-mt-28">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Location
                </p>
                <h3 className="mt-2 font-display text-2xl text-fg">
                  Interactive map
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-fg-muted">
                  Explore the neighborhood around {property.name}. Pan and zoom
                  the map, or open Google Maps for turn-by-turn directions.
                </p>
                <div className="mt-5">
                  <GoogleMap location={mapLocation} aspect="video" />
                </div>
              </section>

              <div className="mt-10 rounded-xl border border-border bg-bg-subtle px-5 py-4 text-sm leading-relaxed text-fg-muted">
                <p className="font-medium text-fg">
                  Locally managed by {site.legalName}
                </p>
                <p className="mt-1">
                  {site.headquarters.full} ·{" "}
                  <a
                    href={`tel:${site.phoneTel}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {site.phone}
                  </a>
                  . Inquiries for {property.name} go to our partners ({teamNamesList()}). Email {site.email} for information and FAQs.
                </p>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div id="book" className="sticky top-24 space-y-4">
              <BookingWidget property={property} />
              <CompactPoiList propertyId={property.id} />
              <GoogleMap
                location={mapLocation}
                aspect="square"
                compact
                className="hidden lg:block"
              />
            </div>
          </aside>
        </div>

        {others.length > 0 ? (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="font-display text-2xl text-fg">
              Additional properties
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {others.map((p) => (
                <Link
                  key={p.id}
                  to="/properties/$slug"
                  params={{ slug: p.slug }}
                  className="group overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)] focus-ring"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-bg-subtle">
                    <img
                      src={p.heroImage}
                      alt={`${p.name} vacation rental`}
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-fg-subtle">
                      {p.propertyType}
                    </p>
                    <p className="mt-1 font-display text-lg text-fg">{p.name}</p>
                    <p className="mt-1 text-xs text-fg-muted">
                      {p.bedrooms} BR · {p.bathrooms} BA · Sleeps {p.sleeps}
                    </p>
                    {getPricing(p.id) ? (
                      <p className="mt-2 text-sm font-medium text-fg">
                        {formatMoney(getPricing(p.id)!.nightlyRate)}/night{" "}
                        <span className="font-normal text-fg-muted">
                          {getPricing(p.id)!.rateSuffix}
                        </span>
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function PropertyGallery({
  name,
  city,
  gallery,
}: {
  name: string;
  city: string;
  gallery: string[];
}) {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = gallery.length;
  const activeImage = gallery[index] ?? gallery[0];
  const canScroll = count > 1;

  useEffect(() => {
    setIndex(0);
  }, [gallery]);

  useEffect(() => {
    if (!canScroll) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      event.preventDefault();
      setIndex(
        (current) =>
          (current + (event.key === "ArrowRight" ? 1 : -1) + count) % count,
      );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canScroll, count]);

  const go = (delta: number) => {
    if (!canScroll) return;
    setIndex((current) => (current + delta + count) % count);
  };

  return (
    <div>
      <div
        className="relative aspect-16/10 overflow-hidden rounded-2xl border border-border bg-bg-subtle"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${name} photo gallery`}
        onTouchStart={(event) => {
          touchX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchX.current == null) return;
          const dx = (event.changedTouches[0]?.clientX ?? 0) - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) < 40) return;
          go(dx < 0 ? 1 : -1);
        }}
      >
        <img
          src={activeImage}
          alt={`${name} vacation rental photo ${index + 1} of ${count} in ${city}`}
          className="absolute inset-0 size-full object-cover"
          decoding="async"
        />
        {canScroll ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-bg-elevated/92 text-fg shadow-[var(--shadow-lift)] backdrop-blur-sm transition hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:left-4 sm:size-12"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-bg-elevated/92 text-fg shadow-[var(--shadow-lift)] backdrop-blur-sm transition hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:right-4 sm:size-12"
            >
              <ChevronRight className="size-6" />
            </button>
            <p className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-bg-ink/80 px-2.5 py-1 text-xs font-medium tabular-nums text-fg-on-ink backdrop-blur-sm">
              {index + 1} / {count}
            </p>
          </>
        ) : null}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
        {gallery.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show photo ${i + 1}`}
            aria-current={index === i ? "true" : undefined}
            className={`relative aspect-4/3 overflow-hidden rounded-lg border-2 transition-colors focus-ring ${
              index === i
                ? "border-primary"
                : "border-transparent opacity-80 hover:opacity-100"
            }`}
          >
            <img
              src={src}
              alt=""
              className="absolute inset-0 size-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
