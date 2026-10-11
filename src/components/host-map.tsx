import { ExternalLink, MapPinned, Navigation } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  googleMapsDirectionsUrl,
  googleMapsEmbedUrl,
  googleMapsMultiDirUrl,
  googleMapsMultiEmbedUrl,
  googleMapsSearchUrl,
  type MapLocation,
} from "@/lib/maps";
import type { Property } from "@/data/properties";
import { cn } from "@/lib/utils";

export type HostMapPin = MapLocation & {
  slug?: string;
};

type Props = {
  locations: HostMapPin[];
  title: string;
  className?: string;
  aspect?: "video" | "square" | "wide" | "tall";
  compact?: boolean;
};

const aspectClass = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  tall: "aspect-[4/5] sm:aspect-[5/4]",
} as const;

const PIN_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function pinsFromProperties(homes: Property[]): HostMapPin[] {
  return homes.map((p) => ({
    label: p.name,
    latitude: p.map.latitude,
    longitude: p.map.longitude,
    query: p.map.query,
    zoom: p.map.zoom,
    slug: p.slug,
  }));
}

export function HostMap({
  locations,
  title,
  className,
  aspect = "video",
  compact = false,
}: Props) {
  const [active, setActive] = useState<"all" | number>("all");
  const multi = locations.length > 1;
  const focused =
    active === "all" || !locations[active] ? null : locations[active];

  const embedSrc = focused
    ? googleMapsEmbedUrl(focused)
    : googleMapsMultiEmbedUrl(locations);
  const openUrl = focused
    ? googleMapsSearchUrl(focused.query)
    : googleMapsMultiDirUrl(locations);
  const directionsUrl = focused
    ? googleMapsDirectionsUrl(focused.query)
    : googleMapsMultiDirUrl(locations);
  const iframeTitle = focused
    ? `Google Map: ${focused.label}`
    : `Google Map: ${title}`;

  if (locations.length === 0) return null;

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      {multi ? (
        <div
          className={cn(
            "flex flex-wrap gap-1.5 border-b border-border bg-bg-subtle",
            compact ? "px-3 py-2" : "px-4 py-2.5",
          )}
        >
          <button
            type="button"
            onClick={() => setActive("all")}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus-ring",
              active === "all"
                ? "bg-primary text-primary-fg"
                : "bg-bg-elevated text-fg hover:bg-bg",
            )}
          >
            All homes
          </button>
          {locations.map((loc, i) => (
            <button
              key={loc.label}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus-ring",
                active === i
                  ? "bg-primary text-primary-fg"
                  : "bg-bg-elevated text-fg hover:bg-bg",
              )}
            >
              {PIN_LETTERS[i]} · {loc.label}
            </button>
          ))}
        </div>
      ) : null}
      <div className={cn("relative w-full bg-bg-subtle", aspectClass[aspect])}>
        <iframe
          key={embedSrc}
          title={iframeTitle}
          src={embedSrc}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <figcaption
        className={cn(
          "border-t border-border bg-bg-elevated",
          compact ? "px-3 py-2.5" : "px-4 py-3 sm:px-5",
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p
              className={cn(
                "flex items-start gap-1.5 font-medium text-fg",
                compact ? "text-sm" : "text-sm sm:text-base",
              )}
            >
              <MapPinned className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{focused ? focused.label : title}</span>
            </p>
            <ol className="mt-2 space-y-1.5 pl-5">
              {locations.map((loc, i) => (
                <li
                  key={loc.label}
                  className="flex items-start gap-2 text-xs text-fg-muted"
                >
                  <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-fg">
                    {PIN_LETTERS[i]}
                  </span>
                  <span className="min-w-0">
                    {loc.slug ? (
                      <Link
                        to="/properties/$slug"
                        params={{ slug: loc.slug }}
                        className="font-medium text-fg hover:text-primary hover:underline"
                      >
                        {loc.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-fg">{loc.label}</span>
                    )}
                    <span className="block truncate text-[11px] text-fg-subtle">
                      {loc.query}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href={openUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-medium text-fg transition-colors hover:bg-bg-subtle focus-ring"
            >
              Open in Google Maps
              <ExternalLink className="size-3" />
            </a>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-fg transition-colors hover:bg-primary-hover focus-ring"
            >
              <Navigation className="size-3" />
              Directions
            </a>
          </div>
        </div>
      </figcaption>
    </figure>
  );
}
