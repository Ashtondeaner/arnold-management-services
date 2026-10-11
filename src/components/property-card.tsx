import { Link } from "@tanstack/react-router";
import { Bath, BedDouble, MapPin, Users } from "lucide-react";
import type { Property } from "@/data/properties";
import { getPricing } from "@/data/pricing";
import { formatMoney } from "@/lib/booking-engine";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PropertyCard({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) {
  const pricing = getPricing(property.id);

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-[var(--shadow-soft)] transition-[transform,shadow] duration-500 ease-[var(--ease-water)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      <Link
        to="/properties/$slug"
        params={{ slug: property.slug }}
        className="relative block aspect-4/3 overflow-hidden bg-bg-subtle focus-ring"
      >
        <img
          src={property.heroImage}
          alt={property.name}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-water)] group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-ink/45 to-transparent" />
        <Badge
          variant="outline"
          className="absolute left-3 top-3 border-0 bg-bg-elevated/95 text-fg shadow-sm backdrop-blur-sm"
        >
          {property.propertyType}
        </Badge>
        {pricing ? (
          <span className="absolute bottom-3 right-3 max-w-[min(100%-1.5rem,14rem)] rounded-md bg-bg-ink/85 px-2.5 py-1 text-right text-xs font-medium leading-snug text-fg-on-ink backdrop-blur-sm">
            {formatMoney(pricing.nightlyRate)}/night
            <span className="block font-normal text-fg-on-ink-muted">
              {pricing.rateSuffix}
            </span>
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-fg-subtle">
          {property.city}, {property.country === "Florida, USA" ? "Florida" : property.country}
        </p>
        <h3 className="mt-1 font-display text-xl tracking-tight text-fg text-balance">
          <Link
            to="/properties/$slug"
            params={{ slug: property.slug }}
            className="focus-ring rounded-sm hover:text-primary"
          >
            {property.name}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-fg-muted">
          <MapPin className="size-3.5 shrink-0" />
          {property.location}
        </p>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-fg-muted text-pretty">
          {property.tagline}
        </p>

        <p className="mt-3 text-xs font-medium tracking-wide text-fg">
          {property.bedrooms} BR · {property.bathrooms} BA · Sleeps{" "}
          {property.sleeps}
        </p>

        {pricing ? (
          <p className="mt-2 text-sm font-medium text-fg">
            {formatMoney(pricing.nightlyRate)}/night{" "}
            <span className="font-normal text-fg-muted">{pricing.rateSuffix}</span>
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-xs font-medium text-fg-muted">
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="size-3.5" />
            {property.bedrooms} bed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bath className="size-3.5" />
            {property.bathrooms} bath
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" />
            Sleeps {property.sleeps}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            to="/properties/$slug"
            params={{ slug: property.slug }}
            className="text-sm font-medium text-primary transition-colors hover:text-primary-hover focus-ring rounded-sm"
          >
            View the residence
          </Link>
          <Link
            to="/book"
            search={{ property: property.slug }}
            className="text-sm font-medium text-fg transition-colors hover:text-primary focus-ring rounded-sm"
          >
            Reserve
          </Link>
        </div>
      </div>
    </article>
  );
}
