import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { EventCalendar } from "@/components/events/event-calendar";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { Button } from "@/components/ui/button";
import {
  getEvents,
  toDayIso,
  type LocalEvent,
} from "@/data/events";
import { site } from "@/data/properties";
import {
  breadcrumbJsonLd,
  buildPageMeta,
  siteKeywords,
} from "@/data/seo";

const searchSchema = z.object({
  region: z.enum(["all", "naples", "bahamas"]).optional(),
});

function eventsJsonLd(events: LocalEvent[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Local events near ${site.legalName} vacation rentals`,
    itemListElement: events.slice(0, 20).map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: e.title,
        description: e.description,
        startDate: e.startDate,
        endDate: e.endDate,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: e.venue,
          address: {
            "@type": "PostalAddress",
            addressLocality: e.city,
            addressRegion: e.region === "naples" ? "FL" : "Abaco",
            addressCountry: e.region === "naples" ? "US" : "BS",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: e.latitude,
            longitude: e.longitude,
          },
        },
        organizer: {
          "@type": "Organization",
          name: site.legalName,
          url: `https://${site.domain}`,
        },
      },
    })),
  };
}

export const Route = createFileRoute("/events")({
  validateSearch: searchSchema,
  component: EventsPage,
  head: () => ({
    meta: buildPageMeta({
      title: `Local Event Calendar | Naples FL & Treasure Cay | ${site.legalName}`,
      description: `Interactive local event calendars for Naples, Florida and Treasure Cay, Abaco Bahamas near vacation rentals managed by ${site.legalName}. Festivals, markets, boating, and holiday events to plan your stay.`,
      keywords: [
        ...siteKeywords,
        "Naples FL events calendar",
        "Treasure Cay events",
        "things to do Naples Florida",
        "Abaco Bahamas events",
        "Naples festivals",
        "vacation rental events nearby",
      ],
      path: "/events",
    }),
    links: [{ rel: "canonical", href: `https://${site.domain}/events` }],
  }),
});

function EventsPage() {
  const { region = "all" } = Route.useSearch();
  const upcoming = getEvents({
    region: region === "all" ? "all" : region,
    from: toDayIso(new Date()),
  });

  return (
    <div className="pb-16 md:pb-24">
      <SeoJsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
        ])}
      />
      <SeoJsonLd data={eventsJsonLd(upcoming)} />

      <section className="border-b border-border bg-bg-elevated">
        <div className="container-page py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            The season
          </p>
          <h1 className="mt-2 max-w-2xl font-display text-4xl tracking-tight text-fg text-balance md:text-5xl">
            What is happening nearby
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted text-pretty">
            Festivals, markets, and island gatherings near our homes in Naples
            and Treasure Cay—timed so your stay can meet the moment.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/book">Reserve around an occasion</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/destinations">Explore destinations</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container-page py-10">
        <EventCalendar
          initialRegion={region === "all" ? "all" : region}
          showFilters
        />
      </div>

      <section className="border-t border-border bg-bg-subtle py-12">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-bg-elevated p-6">
            <h2 className="font-display text-xl text-fg">Naples, Florida</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Markets, bay cruises, Fifth Avenue entertainment, stone crab
              season, and holiday lights—pair events with I102 Naples Bay Resort
              or the Tahiti Street dock homes.
            </p>
            <Button asChild variant="link" className="mt-3 px-0">
              <Link to="/events" search={{ region: "naples" }}>
                Naples calendar only
              </Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-bg-elevated p-6">
            <h2 className="font-display text-xl text-fg">
              Treasure Cay, Abaco
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Beach yoga, fishing weekends, cay day sails, and canal boat
              parades—best enjoyed from 2001 Bahama Beach Club.
            </p>
            <Button asChild variant="link" className="mt-3 px-0">
              <Link to="/events" search={{ region: "bahamas" }}>
                Treasure Cay calendar only
              </Link>
            </Button>
          </div>
        </div>
        <p className="container-page mt-8 text-xs text-fg-subtle">
          Event details are curated for guest planning and may change. Confirm
          times locally or with {site.legalName} when you book. Call{" "}
          {site.phone}.
        </p>
      </section>
    </div>
  );
}
