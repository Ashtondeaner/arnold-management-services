/** Google Maps helpers — embed iframes work without an API key via query + output=embed. */

export type MapLocation = {
  label: string;
  latitude: number;
  longitude: number;
  /** Human-readable search query for Google Maps */
  query: string;
  zoom?: number;
};

export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleMapsDirectionsUrl(query: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

export function googleMapsPlaceUrl(lat: number, lng: number, label?: string): string {
  const q = label
    ? encodeURIComponent(`${label}@${lat},${lng}`)
    : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/** Interactive embed URL (pan/zoom inside iframe) */
export function googleMapsEmbedUrl(loc: MapLocation): string {
  const zoom = loc.zoom ?? 15;
  const q = encodeURIComponent(`${loc.query}@${loc.latitude},${loc.longitude}`);
  return `https://www.google.com/maps?q=${q}&z=${zoom}&hl=en&output=embed`;
}

/** Embed centered on coordinates only */
export function googleMapsEmbedCoordsUrl(
  latitude: number,
  longitude: number,
  zoom = 13,
): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}&hl=en&output=embed`;
}

/** Open Google Maps with every location as a stop (A, B, C…) */
export function googleMapsMultiDirUrl(locations: MapLocation[]): string {
  if (locations.length === 0) return "https://www.google.com/maps";
  if (locations.length === 1) return googleMapsSearchUrl(locations[0].query);
  const parts = locations.map((loc) => encodeURIComponent(loc.query));
  return `https://www.google.com/maps/dir/${parts.join("/")}`;
}

/**
 * Embeddable Google Map that plots every location.
 * One pin uses a place embed; two or more use a multi-stop directions embed
 * so Google Maps labels them A, B, C on a single map.
 */
export function googleMapsMultiEmbedUrl(locations: MapLocation[]): string {
  if (locations.length === 0) {
    return googleMapsEmbedCoordsUrl(26.142, -81.7948, 11);
  }
  if (locations.length === 1) return googleMapsEmbedUrl(locations[0]);
  const origin = encodeURIComponent(locations[0].query);
  const rest = locations.slice(1).map((loc) => encodeURIComponent(loc.query));
  return `https://www.google.com/maps?saddr=${origin}&daddr=${rest.join("+to:")}&hl=en&output=embed`;
}
