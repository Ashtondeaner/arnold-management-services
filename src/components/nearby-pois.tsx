import {
  Anchor,
  Building2,
  ExternalLink,
  Flag,
  Leaf,
  MapPinned,
  Plane,
  ShoppingBag,
  TreePine,
  Utensils,
  Waves,
  type LucideIcon,
} from "lucide-react";
import {
  getNearbyPoisForProperty,
  getPoisForRegion,
  poiCategoryLabels,
  type PointOfInterest,
  type PoiCategory,
} from "@/data/points-of-interest";
import type { Region } from "@/data/properties";
import { googleMapsSearchUrl } from "@/lib/maps";
import { cn } from "@/lib/utils";

const categoryIcons: Record<PoiCategory, LucideIcon> = {
  beach: Waves,
  dining: Utensils,
  shopping: ShoppingBag,
  boating: Anchor,
  golf: Flag,
  attraction: Building2,
  airport: Plane,
  grocery: ShoppingBag,
  resort: Building2,
  nature: TreePine,
};

function PoiCard({
  poi,
  className,
}: {
  poi: PointOfInterest;
  className?: string;
}) {
  const Icon = categoryIcons[poi.category] ?? MapPinned;
  const mapsUrl = googleMapsSearchUrl(poi.mapQuery);

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex gap-3 rounded-xl border border-border bg-bg-elevated p-3.5 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)] focus-ring",
        className,
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="font-medium text-fg group-hover:text-primary">
            {poi.name}
          </span>
          <span className="rounded-full bg-bg-subtle px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-fg-subtle">
            {poiCategoryLabels[poi.category]}
          </span>
        </span>
        <span className="mt-1 block text-xs font-medium text-primary">
          {poi.distance}
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-fg-muted">
          {poi.description}
        </span>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-fg-muted group-hover:text-primary">
          Open in Google Maps
          <ExternalLink className="size-3" />
        </span>
      </span>
    </a>
  );
}

export function NearbyPoisSection({
  propertyId,
  title = "Nearby points of interest",
  subtitle,
  className,
  limit,
}: {
  propertyId: string;
  title?: string;
  subtitle?: string;
  className?: string;
  limit?: number;
}) {
  let pois = getNearbyPoisForProperty(propertyId);
  if (limit) pois = pois.slice(0, limit);
  if (pois.length === 0) return null;

  return (
    <section id="nearby-pois" className={cn("mt-12 scroll-mt-28", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        Explore nearby
      </p>
      <h3 className="mt-2 font-display text-2xl text-fg">{title}</h3>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">{subtitle}</p>
      ) : (
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Hand-picked beaches, dining, boating, and local favorites—tap any
          place to open it in Google Maps.
        </p>
      )}
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {pois.map((poi) => (
          <li key={poi.id}>
            <PoiCard poi={poi} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RegionPoisSection({
  region,
  title,
  className,
}: {
  region: Region;
  title?: string;
  className?: string;
}) {
  const pois = getPoisForRegion(region);
  if (pois.length === 0) return null;

  const label =
    title ??
    (region === "naples"
      ? "Naples points of interest"
      : "Treasure Cay points of interest");

  const byCategory = pois.reduce(
    (acc, poi) => {
      (acc[poi.category] ??= []).push(poi);
      return acc;
    },
    {} as Partial<Record<PoiCategory, PointOfInterest[]>>,
  );

  const order: PoiCategory[] = [
    "beach",
    "boating",
    "dining",
    "shopping",
    "resort",
    "attraction",
    "nature",
    "golf",
    "grocery",
    "airport",
  ];

  return (
    <section className={cn("mt-12", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        Local guide
      </p>
      <h2 className="mt-2 font-display text-2xl text-fg">{label}</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        Popular places guests visit from our vacation homes. Each opens in
        Google Maps with directions.
      </p>

      <div className="mt-6 space-y-8">
        {order.map((cat) => {
          const list = byCategory[cat];
          if (!list?.length) return null;
          const Icon = categoryIcons[cat];
          return (
            <div key={cat}>
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-fg">
                <Icon className="size-4 text-primary" />
                {poiCategoryLabels[cat]}
              </h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {list.map((poi) => (
                  <li key={poi.id}>
                    <PoiCard poi={poi} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function CompactPoiList({
  propertyId,
  limit = 5,
}: {
  propertyId: string;
  limit?: number;
}) {
  const pois = getNearbyPoisForProperty(propertyId).slice(0, limit);
  if (!pois.length) return null;

  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-4 shadow-[var(--shadow-soft)]">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-fg-subtle">
        <Leaf className="size-3.5 text-primary" />
        Nearby highlights
      </p>
      <ul className="mt-3 space-y-2.5">
        {pois.map((poi) => {
          const Icon = categoryIcons[poi.category];
          return (
            <li key={poi.id}>
              <a
                href={googleMapsSearchUrl(poi.mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 rounded-lg px-1 py-1 text-sm transition-colors hover:bg-bg-subtle focus-ring"
              >
                <Icon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block font-medium text-fg">{poi.name}</span>
                  <span className="text-xs text-fg-muted">{poi.distance}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <a
        href="#nearby-pois"
        className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
      >
        See all nearby places
      </a>
    </div>
  );
}
