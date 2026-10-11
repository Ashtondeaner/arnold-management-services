import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Phone,
} from "lucide-react";
import { HostMap, pinsFromProperties } from "@/components/host-map";
import { EventCalendar } from "@/components/events/event-calendar";
import { RegionPoisSection } from "@/components/nearby-pois";
import { PropertyCard } from "@/components/property-card";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { Button } from "@/components/ui/button";
import {
  getDestinationBySlug,
  propertiesForDestination,
} from "@/data/local-seo";
import { site, teamNamesList } from "@/data/properties";
import {
  breadcrumbJsonLd,
  buildPageMeta,
  destinationJsonLd,
  faqJsonLd,
} from "@/data/seo";

export const Route = createFileRoute("/destinations/$slug")({
  loader: ({ params }) => {
    const destination = getDestinationBySlug(params.slug);
    if (!destination) throw notFound();
    return { destination };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.destination) {
      return {
        meta: buildPageMeta({
          title: `Destinations | ${site.legalName}`,
          description: site.tagline,
          path: "/destinations",
        }),
      };
    }
    const d = loaderData.destination;
    return {
      meta: buildPageMeta({
        title: `${d.headline} | ${site.legalName}`,
        description: d.intro,
        keywords: d.localKeywords,
        path: `/destinations/${d.slug}`,
        image: d.image,
        geo: {
          region: d.geoRegion,
          placename: d.geoPlacename,
          position: `${d.geo.latitude};${d.geo.longitude}`,
        },
      }),
      links: [
        {
          rel: "canonical",
          href: `https://${site.domain}/destinations/${d.slug}`,
        },
      ],
    };
  },
  component: DestinationPage,
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl">Destination not found</h1>
      <Button asChild className="mt-6">
        <Link to="/destinations">All destinations</Link>
      </Button>
    </div>
  ),
});

function DestinationPage() {
  const { destination: d } = Route.useLoaderData();
  const homes = propertiesForDestination(d);

  return (
    <div className="pb-16 md:pb-24">
      <SeoJsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Destinations", path: "/destinations" },
          { name: d.name, path: `/destinations/${d.slug}` },
        ])}
      />
      <SeoJsonLd data={destinationJsonLd(d)} />
      <SeoJsonLd data={faqJsonLd(d.faqs)} />

      <section className="border-b border-border bg-bg-elevated">
        <div className="container-page py-6">
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-fg-muted">
            <Link to="/destinations">
              <ArrowLeft className="size-4" />
              All destinations
            </Link>
          </Button>
          <div className="mt-4 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Local guide · {d.geoPlacename}
              </p>
              <h1 className="mt-2 font-display text-3xl tracking-tight text-fg text-balance md:text-5xl">
                {d.headline}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted text-pretty">
                {d.intro}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/properties" search={{ region: d.region }}>
                    View {d.shortName} homes
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/book">Book online</Link>
                </Button>
                <Button asChild variant="outline">
                  <a href="#destination-map">Interactive map</a>
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-soft)]">
                <img
                  src={d.image}
                  alt={`${d.name} vacation rental destination`}
                  className="aspect-[16/10] w-full object-cover"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <article className="space-y-4">
            {d.body.map((para) => (
              <p
                key={para.slice(0, 40)}
                className="text-base leading-[1.7] text-fg-muted text-pretty"
              >
                {para}
              </p>
            ))}
          </article>

          <section id="destination-map" className="mt-12 scroll-mt-28">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Explore the area
            </p>
            <h2 className="mt-2 font-display text-2xl text-fg">
              Homes we host in {d.shortName}
            </h2>
            <p className="mt-2 text-sm text-fg-muted">
              {homes.length > 1
                ? `All ${homes.length} ${d.shortName} properties appear on this Google Map (${homes.map((h) => h.name).join(", ")}). Choose All homes to see them together, or select a home to focus its pin.`
                : `Pan and zoom this Google Map, then open ${homes[0]?.name ?? d.name} in Google Maps for directions.`}
            </p>
            <div className="mt-5">
              <HostMap
                title={`${d.shortName} vacation rentals`}
                locations={pinsFromProperties(homes)}
                aspect="wide"
              />
            </div>
          </section>

          {homes.length > 0 ? (
            <section className="mt-12">
              <h2 className="font-display text-2xl text-fg">
                Property locations
              </h2>
              <p className="mt-2 text-sm text-fg-muted">
                Letters on the Google Map match the homes below. Open a listing
                for its own Google Map, nearby points of interest, and booking
                calendar.
              </p>
              <ol className="mt-5 grid gap-3">
                {homes.map((p, i) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-bg-elevated px-4 py-3"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-fg">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-lg text-fg">{p.name}</h3>
                        <p className="text-xs text-fg-muted">{p.map.query}</p>
                      </div>
                    </div>
                    <Button asChild variant="link" className="h-auto px-0">
                      <Link to="/properties/$slug" params={{ slug: p.slug }}>
                        View listing
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <section className="mt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Local event calendar
            </p>
            <h2 className="mt-2 font-display text-2xl text-fg">
              What's on in {d.shortName}
            </h2>
            <p className="mt-2 text-sm text-fg-muted">
              Browse festivals, markets, boating days, and holiday events near
              our {d.shortName} homes. Book stays that line up with the calendar.
            </p>
            <div className="mt-5">
              <EventCalendar
                initialRegion={d.region}
                showFilters={false}
              />
            </div>
          </section>

          <RegionPoisSection region={d.region} />

          <section className="mt-12">
            <h2 className="font-display text-2xl text-fg">
              Areas & neighborhoods
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {d.neighborhoods.map((n) => (
                <li
                  key={n}
                  className="flex items-start gap-2 rounded-lg border border-border bg-bg-elevated px-3.5 py-2.5 text-sm text-fg"
                >
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  {n}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-2xl text-fg">
              Nearby attractions
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {d.attractions.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-2 text-sm text-fg-muted"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-2xl text-fg">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-3">
              {d.faqs.map((f) => (
                <details
                  key={f.question}
                  className="group rounded-xl border border-border bg-bg-elevated px-4 py-3"
                >
                  <summary className="cursor-pointer list-none font-medium text-fg marker:content-none">
                    <span className="flex items-start justify-between gap-3">
                      {f.question}
                      <span className="text-fg-subtle transition group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-border bg-bg-ink p-5 text-fg-on-ink">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Local host
            </p>
            <p className="mt-2 font-display text-xl">{site.legalName}</p>
            <p className="mt-1 text-sm text-fg-on-ink-muted">
              {teamNamesList()}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-fg-on-ink/90">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-fg-on-ink-muted" />
                <span>
                  {site.headquarters.line1}
                  <br />
                  {site.headquarters.line2}
                </span>
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-fg-on-ink-muted" />
                <a href={`tel:${site.phoneTel}`} className="hover:underline">
                  {site.phone}
                </a>
              </li>
            </ul>
            <Button
              asChild
              className="mt-5 w-full bg-bg-elevated text-fg hover:bg-bg"
            >
              <Link to="/contact">Contact local office</Link>
            </Button>
          </div>

          <HostMap
            title={`${d.shortName} homes`}
            locations={pinsFromProperties(homes)}
            aspect="tall"
            compact
          />
        </aside>
      </div>

      <section className="border-t border-border bg-bg-subtle py-14">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl text-fg md:text-3xl">
                Homes in {d.shortName}
              </h2>
              <p className="mt-2 text-fg-muted">
                Book directly with {site.legalName}.
              </p>
            </div>
            <Button asChild variant="secondary">
              <Link to="/properties" search={{ region: d.region }}>
                All {d.shortName} listings
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {homes.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
