import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, UserRound } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { destinations, nap } from "@/data/local-seo";
import { properties, site } from "@/data/properties";

export function SiteFooter() {
  return (
    <footer
      className="border-t border-border bg-bg-ink text-fg-on-ink"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <meta itemProp="name" content={nap.name} />
      <meta itemProp="telephone" content={nap.phone} />
      <meta itemProp="email" content={nap.email} />
      <meta itemProp="url" content={`https://${site.domain}`} />
      <meta itemProp="priceRange" content={nap.priceRange} />

      <div className="container-page grid gap-10 py-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3">
            <BrandMark size="md" inverted />
            <div>
              <p className="font-display text-lg leading-tight text-fg-on-ink">
                Arnold Management Services
              </p>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-accent">
                LLC · {site.domain}
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-on-ink-muted">
            Private coastal residences in Naples, Florida and Treasure Cay,
            Abaco, managed by {site.legalName}.
          </p>
          <div className="mt-5 rounded-lg border border-fg-on-ink/10 bg-fg-on-ink/5 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-on-ink-muted">
              Partners
            </p>
            <ul className="mt-2 space-y-1.5">
              {site.principals.map((p) => (
                <li key={p.name}>
                  <p className="font-medium text-fg-on-ink">{p.name}</p>
                  <p className="text-xs text-fg-on-ink-muted">{p.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-on-ink-muted">
            Explore
          </p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link to="/book" className="text-sm text-fg-on-ink/90 hover:text-fg-on-ink">
                Reserve a stay
              </Link>
            </li>
            <li>
              <Link to="/properties" className="text-sm text-fg-on-ink/90 hover:text-fg-on-ink">
                Properties
              </Link>
            </li>
            <li>
              <Link to="/destinations" className="text-sm text-fg-on-ink/90 hover:text-fg-on-ink">
                Destinations
              </Link>
            </li>
            <li>
              <Link to="/events" className="text-sm text-fg-on-ink/90 hover:text-fg-on-ink">
                Local events
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-sm text-fg-on-ink/90 hover:text-fg-on-ink">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm text-fg-on-ink/90 hover:text-fg-on-ink">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-on-ink-muted">
            Service areas
          </p>
          <ul className="mt-4 space-y-2.5">
            {destinations.map((d) => (
              <li key={d.slug}>
                <Link
                  to="/destinations/$slug"
                  params={{ slug: d.slug }}
                  className="text-sm text-fg-on-ink/90 hover:text-fg-on-ink"
                >
                  {d.name}
                </Link>
              </li>
            ))}
            {properties.map((p) => (
              <li key={p.id}>
                <Link
                  to="/properties/$slug"
                  params={{ slug: p.slug }}
                  className="text-sm text-fg-on-ink/90 transition-colors hover:text-fg-on-ink"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-on-ink-muted">
            NAP · Local office
          </p>
          <ul className="mt-4 space-y-3 text-sm text-fg-on-ink/90">
            <li className="flex items-start gap-2.5">
              <UserRound className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>
                <span className="block font-medium text-fg-on-ink" itemProp="name">
                  {site.legalName}
                </span>
                <span className="text-fg-on-ink-muted">
                  Partners & hosts · Information & FAQ: {site.email}
                </span>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-fg-on-ink-muted" />
              <a
                href={`mailto:${nap.email}`}
                className="break-all hover:text-fg-on-ink"
                itemProp="email"
              >
                {nap.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-fg-on-ink-muted" />
              <a
                href={`tel:${nap.phoneTel}`}
                className="hover:text-fg-on-ink"
                itemProp="telephone"
              >
                {nap.phone}
              </a>
            </li>
            <li
              className="flex items-start gap-2.5"
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-fg-on-ink-muted" />
              <a
                href={nap.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fg-on-ink"
              >
                <span itemProp="streetAddress">{nap.streetAddress}</span>
                <br />
                <span itemProp="addressLocality">{nap.addressLocality}</span>,{" "}
                <span itemProp="addressRegion">{nap.addressRegion}</span>{" "}
                <span itemProp="postalCode">{nap.postalCode}</span>
                <meta itemProp="addressCountry" content={nap.addressCountry} />
              </a>
            </li>
          </ul>
          <div
            itemProp="geo"
            itemScope
            itemType="https://schema.org/GeoCoordinates"
            className="sr-only"
          >
            <meta itemProp="latitude" content={String(nap.geo.latitude)} />
            <meta itemProp="longitude" content={String(nap.geo.longitude)} />
          </div>
        </div>
      </div>
      <div className="border-t border-fg-on-ink/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-fg-on-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p>
            {site.domain} · Naples, FL {site.headquarters.zip} · Treasure Cay,
            Abaco
          </p>
        </div>
      </div>
    </footer>
  );
}
