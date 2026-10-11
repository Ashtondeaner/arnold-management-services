import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Globe2,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { properties, site, teamNamesList } from "@/data/properties";
import { buildPageMeta, siteKeywords } from "@/data/seo";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: buildPageMeta({
      title: `About ${site.legalName} | Vacation Rental Management Naples & Bahamas`,
      description: `Learn about ${site.legalName} (${site.domain}), led by partners ${teamNamesList()}. Premium vacation rental management for Naples, Florida and Treasure Cay, Abaco Bahamas homes. Email ${site.email} for information and FAQs.`,
      keywords: [
        ...siteKeywords,
        "about Arnold Management Services",
        "vacation rental management company Naples",
        "property management Naples FL",
      ],
      path: "/about",
    }),
    links: [{ rel: "canonical", href: `https://${site.domain}/about` }],
  }),
});

function AboutPage() {
  return (
    <div className="pb-16 md:pb-24">
      <section className="border-b border-border bg-bg-elevated">
        <div className="container-page py-12 md:py-16">
          <div className="flex items-center gap-3">
            <BrandMark size="lg" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                About
              </p>
              <p className="text-sm font-medium text-fg-muted">{site.domain}</p>
            </div>
          </div>
          <h1 className="mt-5 max-w-2xl font-display text-4xl tracking-tight text-fg md:text-5xl">
            {site.legalName}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted">
            Four residences. Two shores. A family of partners who host as they
            would wish to be hosted—in Naples, on the Gulf of Mexico, and at
            Bahama Beach Club on Treasure Cay, Abaco.
          </p>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-fg-muted">
            From our office at {site.headquarters.full}, every arrival is
            prepared by name, and every home is kept as if it were our own.
          </p>
        </div>
      </section>

      {/* Leadership */}
      <section className="container-page py-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col justify-center rounded-2xl border border-border bg-bg-ink p-8 text-fg-on-ink lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Partners & hosts
            </p>
            <ul className="mt-4 space-y-4">
              {site.principals.map((p) => (
                <li key={p.name}>
                  <h2 className="font-display text-2xl tracking-tight text-fg-on-ink">
                    {p.name}
                  </h2>
                  <p className="mt-0.5 text-sm font-medium text-accent">{p.title}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-fg-on-ink-muted">
              Andrea, Tam, and Ashton remain close to the houses and to the
              people who stay in them—from Naples Bay and the Isles of Capri to
              the beach at Treasure Cay.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-fg-on-ink-muted" />
                <a
                  href={`mailto:${site.email}`}
                  className="break-all hover:underline"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-fg-on-ink-muted" />
                <a href={`tel:${site.phoneTel}`} className="hover:underline">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-fg-on-ink-muted" />
                <span>
                  {site.headquarters.line1}
                  <br />
                  {site.headquarters.line2}
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl tracking-tight text-fg">
              A smaller house, on purpose
            </h2>
            <p className="mt-4 text-fg-muted leading-relaxed">
              {site.legalName} tends four distinctive homes, chosen for setting
              and for the way they receive guests. Scale is a courtesy: it
              allows us to prepare each stay ourselves, to answer in our own
              names, and to know the docks, the linens, and the light at
              day’s end.
            </p>
            <p className="mt-4 text-fg-muted leading-relaxed">
              In Naples, the Gulf is close—white sand, the 10,000 Islands, and
              open water from the Isles of Capri. On Treasure Cay, the day
              belongs to trade winds, silken sand, and a beachfront residence
              at Bahama Beach Club. We will help you choose the house that
              suits the occasion, then keep the path to the key unhurried and
              clear.
            </p>
            <p className="mt-4 text-fg-muted leading-relaxed">
              Reserve online, or write to us. Either way, you are received by
              the same partners who care for the homes.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-soft)]">
              <img
                src="/images/interior-living.jpg"
                alt="Coastal vacation rental living room managed by Arnold Management Services"
                className="aspect-[16/9] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-bg-subtle py-14">
        <div className="container-page grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Building2,
              title: "Four residences",
              body: "I102 Naples Bay Resort; 107 Tahiti Street, a waterfront cottage on the Isles of Capri; 119 Tahiti Street, a coastal cottage with pool and custom dock; and 2001 Bahama Beach Club, beachfront on Treasure Cay.",
            },
            {
              icon: Globe2,
              title: "The Gulf, and the Bahamas",
              body: "Days in Naples among beaches, golf, and open water—or island hours in Treasure Cay, where boardwalk, beach, and canal dock meet beneath coconut palms.",
            },
            {
              icon: HeartHandshake,
              title: "Partners you can reach",
              body: `Andrea Arnold Jeppesen, Tam Arnold Wright, and D. Ashton Arnold remain present from first word through departure. Write ${site.email} or telephone ${site.phone}.`,
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-bg-elevated p-6"
            >
              <Icon className="size-5 text-primary" />
              <h3 className="mt-4 font-display text-xl text-fg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="font-display text-3xl tracking-tight text-fg">
          The homes we host
        </h2>
        <p className="mt-3 max-w-2xl text-fg-muted leading-relaxed">
          Each house is named in full, offered at a clear rate, and prepared as
          we would prepare it for our own family.
        </p>
        <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-bg-elevated">
          {properties.map((p) => (
            <li key={p.id}>
              <Link
                to="/properties/$slug"
                params={{ slug: p.slug }}
                className="flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-bg-subtle focus-ring sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium text-fg">{p.name}</span>
                <span className="text-sm text-fg-muted">
                  {p.city}, {p.country}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/properties">Browse portfolio</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
