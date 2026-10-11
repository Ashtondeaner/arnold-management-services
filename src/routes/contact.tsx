import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { z } from "zod";
import { GoogleMap } from "@/components/google-map";
import { InquiryForm } from "@/components/inquiry-form";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { destinations, nap } from "@/data/local-seo";
import { properties, site, teamNamesList } from "@/data/properties";
import {
  breadcrumbJsonLd,
  buildPageMeta,
  organizationJsonLd,
  siteKeywords,
} from "@/data/seo";

const contactSearchSchema = z.object({
  property: z.string().optional(),
});

export const Route = createFileRoute("/contact")({
  validateSearch: contactSearchSchema,
  component: ContactPage,
  head: () => ({
    meta: buildPageMeta({
      title: `Contact ${site.legalName} | Naples FL ${nap.postalCode} Vacation Rentals`,
      description: `Contact ${site.legalName} partners (${teamNamesList()}) for vacation rentals. Phone ${site.phone}, email ${site.email} for information and FAQs. Office: ${site.headquarters.full}.`,
      keywords: [
        ...siteKeywords,
        "contact vacation rental Naples FL",
        "Naples FL 34104 vacation rental office",
        "Arnold Management Services phone number",
      ],
      path: "/contact",
      geo: {
        region: "US-FL",
        placename: "Naples, Florida",
        position: `${nap.geo.latitude};${nap.geo.longitude}`,
      },
    }),
    links: [{ rel: "canonical", href: `https://${site.domain}/contact` }],
  }),
});

function ContactPage() {
  const { property } = Route.useSearch();

  return (
    <div className="pb-16 md:pb-24">
      <SeoJsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <SeoJsonLd data={organizationJsonLd()} />

      <section className="border-b border-border bg-bg-elevated">
        <div className="container-page py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Concierge · Naples
          </p>
          <h1 className="mt-2 max-w-2xl font-display text-4xl tracking-tight text-fg md:text-5xl">
            We would be pleased to hear from you
          </h1>
          <p className="mt-4 max-w-2xl text-fg-muted">
            Write or telephone our partners—{teamNamesList()}—at the Naples
            office. For information and arrangements, {site.email}.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-border bg-bg-elevated p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <h2 className="font-display text-2xl text-fg">Write to us</h2>
            <p className="mt-1 text-sm text-fg-muted">
              Fields marked as required help us respond faster.
            </p>
            <div className="mt-6">
              <InquiryForm defaultPropertySlug={property} />
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <div
            className="rounded-2xl border border-border bg-bg-ink p-6 text-fg-on-ink sm:p-8"
            itemScope
            itemType="https://schema.org/LocalBusiness"
          >
            <meta itemProp="name" content={site.legalName} />
            <div className="border-b border-fg-on-ink/15 pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                Partners & hosts
              </p>
              <p className="mt-1 text-sm text-fg-on-ink-muted" itemProp="name">
                {site.legalName}
              </p>
              <ul className="mt-4 space-y-3">
                {site.principals.map((p) => (
                  <li key={p.name} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <UserRound className="size-4" />
                    </span>
                    <span>
                      <span className="block font-display text-lg text-fg-on-ink">
                        {p.name}
                      </span>
                      <span className="text-sm text-fg-on-ink-muted">{p.title}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-fg-on-ink-muted" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-fg-on-ink-muted">
                    Email · Information & FAQ
                  </p>
                  <a
                    href={`mailto:${site.email}`}
                    className="mt-0.5 block break-all text-base text-fg-on-ink hover:underline"
                    itemProp="email"
                  >
                    {site.email}
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-fg-on-ink-muted" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-fg-on-ink-muted">
                    Phone
                  </p>
                  <a
                    href={`tel:${site.phoneTel}`}
                    className="mt-0.5 block text-base text-fg-on-ink hover:underline"
                    itemProp="telephone"
                  >
                    {site.phone}
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Building2 className="mt-0.5 size-4 shrink-0 text-fg-on-ink-muted" />
                <div
                  itemProp="address"
                  itemScope
                  itemType="https://schema.org/PostalAddress"
                >
                  <p className="text-xs uppercase tracking-wide text-fg-on-ink-muted">
                    Headquarters (NAP)
                  </p>
                  <p className="mt-0.5 text-base text-fg-on-ink">
                    <span itemProp="streetAddress">{nap.streetAddress}</span>
                    <br />
                    <span itemProp="addressLocality">{nap.addressLocality}</span>
                    , <span itemProp="addressRegion">{nap.addressRegion}</span>{" "}
                    <span itemProp="postalCode">{nap.postalCode}</span>
                    <meta
                      itemProp="addressCountry"
                      content={nap.addressCountry}
                    />
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-fg-on-ink-muted" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-fg-on-ink-muted">
                    Service areas
                  </p>
                  <ul className="mt-1 space-y-1 text-base text-fg-on-ink">
                    {destinations.map((d) => (
                      <li key={d.slug}>
                        <Link
                          to="/destinations/$slug"
                          params={{ slug: d.slug }}
                          className="hover:underline"
                        >
                          {d.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
            <p className="mt-8 border-t border-fg-on-ink/15 pt-6 text-xs text-fg-on-ink-muted">
              {site.legalName} · {site.domain} · {nap.postalCode}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg-subtle py-12">
        <div className="container-page">
          <h2 className="font-display text-2xl text-fg md:text-3xl">
            Headquarters map
          </h2>
          <p className="mt-2 max-w-2xl text-fg-muted">
            Interactive Google Map for our Naples office. Pan, zoom, and get
            directions.
          </p>
          <div className="mt-6">
            <GoogleMap
              location={{
                label: `${site.legalName} Headquarters`,
                latitude: nap.geo.latitude,
                longitude: nap.geo.longitude,
                query: nap.fullAddress,
                zoom: 16,
              }}
              aspect="wide"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <h2 className="font-display text-2xl text-fg md:text-3xl">
            Maps for every rental
          </h2>
          <p className="mt-2 max-w-2xl text-fg-muted">
            Each vacation home includes an interactive Google Map on its
            listing page.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {properties.map((p) => (
              <div key={p.id} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg text-fg">{p.name}</h3>
                  <Link
                    to="/properties/$slug"
                    params={{ slug: p.slug }}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Listing
                  </Link>
                </div>
                <GoogleMap
                  location={{
                    label: p.name,
                    latitude: p.map.latitude,
                    longitude: p.map.longitude,
                    query: p.map.query,
                    zoom: p.map.zoom ?? 15,
                  }}
                  aspect="video"
                  compact
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
