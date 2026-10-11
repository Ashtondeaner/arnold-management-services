import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Compass,
  MapPin,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { destinations } from "@/data/local-seo";
import { properties, site, teamNamesList } from "@/data/properties";
import { buildPageMeta, siteKeywords } from "@/data/seo";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: buildPageMeta({
      title: `Arnold Management Services | Vacation Rentals Naples FL & Treasure Cay Bahamas`,
      description: `Vacation residences managed by ${site.legalName} in Naples, Florida and Treasure Cay, Abaco: I102 Naples Bay Resort, 107 Tahiti Street, 119 Tahiti Street, and 2001 Bahama Beach Club. Reservations are made directly with the management company.`,
      keywords: siteKeywords,
      path: "/",
    }),
    links: [{ rel: "canonical", href: `https://${site.domain}/` }],
  }),
});

function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-bg-ink">
        <img
          src="/images/hero.jpg?v=5"
          alt="Palm-lined boardwalk to turquoise water at Bahama Beach Club, Treasure Cay"
          className="absolute inset-0 h-full w-full object-cover object-[center_68%] brightness-110 contrast-[1.02] saturate-110 hero-photo"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-ink/52 via-bg-ink/22 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-ink/40 via-transparent to-bg-ink/10" />

        <div className="container-page relative flex min-h-[min(88vh,42rem)] flex-col justify-end pb-14 pt-28 md:justify-center md:pb-20 md:pt-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-fg-on-ink/15 bg-bg-ink/40 px-3 py-1.5 backdrop-blur-sm">
              <BrandMark size="sm" inverted />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                Naples, Florida · Treasure Cay, Abaco
              </span>
            </div>
            <h1 className="mt-5 font-display text-[2.35rem] leading-[1.08] tracking-tight text-fg-on-ink sm:text-5xl md:text-[3.35rem]">
              Arnold Management Services
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-on-ink-muted sm:text-lg">
              Four coastal homes—three in Naples, Florida, and one on Treasure
              Cay, Abaco. Reservations are made with {site.legalName}, the
              partners who manage the properties.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="bg-bg-elevated text-fg hover:bg-bg">
                <Link to="/book">
                  Reserve a stay
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-fg-on-ink/30 bg-transparent text-fg-on-ink hover:bg-fg-on-ink/10 hover:text-fg-on-ink"
              >
                <Link to="/destinations">Explore destinations</Link>
              </Button>
            </div>
            <p className="mt-6 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-accent">
              Salt air · Warm teak · Trade winds · Open water
            </p>
            <p className="mt-4 text-sm text-fg-on-ink-muted">
              <span className="text-fg-on-ink/90">{teamNamesList()}</span>
              {" · Partners & hosts · "}
              <a href={`mailto:${site.email}`} className="hover:text-fg-on-ink">
                {site.email}
              </a>
              {" · "}
              <a href={`tel:${site.phoneTel}`} className="hover:text-fg-on-ink">
                {site.phone}
              </a>
              {" · "}
              {site.headquarters.city}, {site.headquarters.state}{" "}
              {site.headquarters.zip}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-bg">
        <div className="container-page grid gap-10 py-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Naples
            </p>
            <p className="mt-3 font-display text-2xl tracking-tight text-fg">
              Late Gulf light, mangrove shade, the knock of a hull against a
              private dock.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Treasure Cay
            </p>
            <p className="mt-3 font-display text-2xl tracking-tight text-fg">
              Trade-wind linen, coconut shade, and the pale sound of water on
              white sand.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-bg-elevated">
        <div className="container-page grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Naples Bay Resort", value: "I102" },
            { label: "Isles of Capri", value: "107 & 119" },
            { label: "Treasure Cay", value: "Bahamas" },
            { label: "Headquarters", value: "Naples" },
          ].map((item) => (
            <div key={item.label} className="text-center sm:text-left">
              <p className="font-display text-2xl text-fg">{item.value}</p>
              <p className="mt-1 text-sm text-fg-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                The collection
              </p>
              <h2 className="mt-2 font-display text-3xl tracking-tight text-fg md:text-4xl">
                Four residences. Two shores.
              </h2>
              <p className="mt-3 text-fg-muted">
                Resort living on Naples Bay, waterfront cottages on the Isles of
                Capri, and beachfront calm at Bahama Beach Club.
              </p>
            </div>
            <Button asChild variant="secondary">
              <Link to="/properties">
                View all
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-bg-subtle py-16 md:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Local destinations
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
              Serving Naples & Treasure Cay
            </h2>
            <p className="mt-3 text-fg-muted">
              City-focused guides built for local search—neighborhoods,
              attractions, FAQs, and homes you can book today.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {destinations.map((d) => (
              <Link
                key={d.slug}
                to="/destinations/$slug"
                params={{ slug: d.slug }}
                className="group overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)] focus-ring"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-bg-subtle">
                  <img
                    src={d.image}
                    alt={`${d.name} vacation rentals`}
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-6">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    <MapPin className="size-3.5" />
                    {d.geoPlacename}
                  </p>
                  <h3 className="mt-2 font-display text-xl text-fg">
                    {d.headline}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-fg-muted">
                    {d.intro}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Explore destination
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Reservations
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
              Made with the management company
            </h2>
            <p className="mt-4 text-fg-muted leading-relaxed">
              Availability, rates, and confirmation are handled by{" "}
              {site.legalName}. There is no third-party booking site between the
              guest and the partners who manage the homes.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Managed by the partners",
                body: `Andrea Arnold Jeppesen, Tam Arnold Wright, and D. Ashton Arnold. Office at ${site.headquarters.full}. ${site.email} · ${site.phone}.`,
              },
              {
                icon: Waves,
                title: "Rates shown in full",
                body: "Nightly rate, fees, and taxes are listed before confirmation. There are no additional marketplace charges.",
              },
              {
                icon: Sparkles,
                title: "Correspondence with the hosts",
                body: "Questions, arrival details, and changes are handled by the partners who manage the residences.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-bg-elevated p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-xl text-fg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-20">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-[var(--shadow-soft)]">
            <img
              src="/images/amenity-pool.jpg"
              alt="Naples Florida vacation rental resort pool"
              className="aspect-[16/10] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 text-primary">
                <Compass className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                  Florida
                </span>
              </div>
              <h3 className="mt-2 font-display text-2xl text-fg">
                Naples, on the Gulf
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                A Naples Bay Resort residence with marina and resort privileges;
                a remodeled waterfront cottage on the Isles of Capri; and a
                coastal cottage with pool and custom dock—both Tahiti Street
                homes with no-bridges access to the Gulf and the 10,000 Islands.
              </p>
              <Button asChild variant="link" className="mt-4 px-0">
                <Link to="/destinations/$slug" params={{ slug: "naples-florida" }}>
                  Discover Naples
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-[var(--shadow-soft)]">
            <img
              src="/images/2001-bahama.jpg"
              alt="Treasure Cay Abaco Bahamas beachfront vacation rental"
              className="aspect-[16/10] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 text-primary">
                <Waves className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                  Bahamas
                </span>
              </div>
              <h3 className="mt-2 font-display text-2xl text-fg">
                Treasure Cay, Abaco
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                2001 Bahama Beach Club—a four-bedroom beachfront residence with
                a private canal dock, boardwalk to silken sand, and the resort
                pool and bar a short stroll away.
              </p>
              <Button asChild variant="link" className="mt-4 px-0">
                <Link
                  to="/destinations/$slug"
                  params={{ slug: "treasure-cay-bahamas" }}
                >
                  Discover Treasure Cay
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-2xl bg-bg-ink px-6 py-12 text-center md:px-12 md:py-16">
            <div className="absolute inset-0 opacity-30">
              <img
                src="/images/interior-living.jpg"
                alt=""
                className="h-full w-full object-cover"
                aria-hidden
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute inset-0 bg-bg-ink/80" />
            <div className="relative mx-auto max-w-xl">
              <BrandMark size="md" inverted className="mx-auto" />
              <h2 className="mt-4 font-display text-3xl tracking-tight text-fg-on-ink md:text-4xl">
                Reserve a stay
              </h2>
              <p className="mt-3 text-fg-on-ink-muted">
                Select a residence and dates. Confirmation is issued by{" "}
                {site.legalName}.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-bg-elevated text-fg hover:bg-bg">
                  <Link to="/book">Reserve dates</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-fg-on-ink/30 bg-transparent text-fg-on-ink hover:bg-fg-on-ink/10 hover:text-fg-on-ink"
                >
                  <a href={`tel:${site.phoneTel}`}>Call {site.phone}</a>
                </Button>
              </div>
              <p className="mt-5 text-xs text-fg-on-ink-muted">
                {site.legalName} · {site.headquarters.full}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
