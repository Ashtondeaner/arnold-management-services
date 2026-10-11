import { ExternalLink, MapPinned, Navigation } from "lucide-react";
import {
  googleMapsDirectionsUrl,
  googleMapsEmbedUrl,
  googleMapsSearchUrl,
  type MapLocation,
} from "@/lib/maps";
import { cn } from "@/lib/utils";

type Props = {
  location: MapLocation;
  className?: string;
  /** Visual height of the map frame */
  aspect?: "video" | "square" | "wide" | "tall";
  showActions?: boolean;
  /** Smaller chrome for sidebars */
  compact?: boolean;
};

const aspectClass = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  tall: "aspect-[4/5] sm:aspect-[5/4]",
} as const;

export function GoogleMap({
  location,
  className,
  aspect = "video",
  showActions = true,
  compact = false,
}: Props) {
  const embedSrc = googleMapsEmbedUrl(location);
  const openUrl = googleMapsSearchUrl(location.query);
  const directionsUrl = googleMapsDirectionsUrl(location.query);

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <div className={cn("relative w-full bg-bg-subtle", aspectClass[aspect])}>
        <iframe
          title={`Interactive Google Map: ${location.label}`}
          src={embedSrc}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      {showActions ? (
        <figcaption
          className={cn(
            "flex flex-col gap-3 border-t border-border bg-bg-elevated sm:flex-row sm:items-center sm:justify-between",
            compact ? "px-3 py-2.5" : "px-4 py-3 sm:px-5",
          )}
        >
          <div className="min-w-0">
            <p
              className={cn(
                "flex items-start gap-1.5 font-medium text-fg",
                compact ? "text-sm" : "text-sm sm:text-base",
              )}
            >
              <MapPinned className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="truncate">{location.label}</span>
            </p>
            <p className="mt-0.5 truncate pl-5 text-xs text-fg-muted">
              {location.query}
              <span className="text-fg-subtle">
                {" · "}
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </span>
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 pl-5 sm:pl-0">
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
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Compact map used when you only need the interactive frame */
export function GoogleMapFrame({
  location,
  className,
  aspect = "video",
}: Pick<Props, "location" | "className" | "aspect">) {
  return (
    <GoogleMap
      location={location}
      className={className}
      aspect={aspect}
      showActions={false}
    />
  );
}
