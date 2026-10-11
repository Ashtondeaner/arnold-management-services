import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { HostMap, pinsFromProperties } from "@/components/host-map";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { Button } from "@/components/ui/button";
import { destinations, propertiesForDestination } from "@/data/local-seo";
import { site } from "@/data/properties";
import {
  breadcrumbJsonLd,
  buildPageMeta,
  localServiceJsonLd,
  siteKeywords,
} from "@/data/seo";

export const Route = createFileRoute("/destinations/")({
  component: DestinationsIndexPage,
  head: () => ({
    meta: buildPageMeta({
      title: `Destinations | Naples FL & Treasure Cay Bahamas Vacation Rentals | ${site.legalName}`,
      description: `Local vacation rental destinations managed by ${site.legalName}: Naples, Florida (Naples Bay Resort & Tahiti Street) and Treasure Cay, Abaco, Bahamas (Bahama Beach Club). Interactive maps and local office: ${site.headquarters.full}.`,
      keywords: [
        ...siteKeywords,
        "Naples FL vacation destinations",
        "Treasure Cay destinations",
        "where to stay Naples Florida",
        "where to stay Treasure Cay",
      ],
      path: "/destinations",
      geo: {
        region: "US-FL",
        placename: "Naples, Florida",
        position: "26.142;-81.7948",
      },
    }),
    links: [{ rel: "canonical", href: `https://${site.domain}/destinations` }],
  }),
});

function DestinationsIndexPage() {
  return (
    <div className="pb-16 md:pb-24">
      <SeoJsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Destinations", path: "/destinations" },
        ])}
      />
      <SeoJsonLd data={localServiceJsonLd()} />

      <section className="border-b border-border bg-bg-elevated">
        <div className="container-page py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Destinations
          </p>
          <h1 className="mt-2 max-w-2xl font-display text-4xl tracking-tight text-fg text-balance md:text-5xl">
            Where we host
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted text-pretty">
            Naples, on Florida’s Gulf, and Treasure Cay, in the Abacos—two
            shores, one standard of care. Each home is marked on the map below.
          </p>
          <p className="mt-3 text-sm text-fg-muted">
            <MapPin className="mr-1 inline size-3.5 text-primary" />
            Local office: {site.headquarters.full} · {site.phone}
          </p>
        </div>
      </section>

      <div className="container-page grid gap-8 py-12 lg:grid-cols-2">
        {destinations.map((d) => (
          <article
            key={d.slug}
            className="overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-[var(--shadow-soft)]"
          >
            <HostMap
              title={
                d.region === "naples"
                  ? "Naples homes we host"
                  : "Treasure Cay home we host"
              }
              locations={pinsFromProperties(propertiesForDestination(d))}
              aspect="video"
              compact
              className="rounded-none border-0 border-b border-border shadow-none"
            />
            <div className="p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                {d.region === "naples" ? "Florida, USA" : "Abaco, Bahamas"}
              </p>
              <h2 className="mt-2 font-display text-2xl text-fg">{d.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {d.intro}
              </p>
              <Button asChild variant="link" className="mt-4 px-0">
                <Link to="/destinations/$slug" params={{ slug: d.slug }}>
                  Explore {d.shortName}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
