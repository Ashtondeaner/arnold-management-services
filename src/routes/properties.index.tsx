import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import {
  getPropertiesByRegion,
  regionLabels,
  site,
  type Region,
} from "@/data/properties";
import { buildPageMeta, siteKeywords } from "@/data/seo";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  region: z.enum(["all", "naples", "bahamas"]).optional(),
});

export const Route = createFileRoute("/properties/")({
  validateSearch: searchSchema,
  component: PropertiesIndexPage,
  head: () => ({
    meta: buildPageMeta({
      title: `Vacation Rental Properties | Naples FL & Treasure Cay | ${site.legalName}`,
      description: `Browse vacation rentals managed by ${site.legalName}: I102 Naples Bay Resort, 107 Tahiti Street, 119 Tahiti Street (Naples, Florida), and 2001 Bahama Beach Club (Treasure Cay, Abaco). Private docks, pools, beachfront, online booking.`,
      keywords: [
        ...siteKeywords,
        "vacation rental listings Naples",
        "Naples FL homes for rent vacation",
        "Treasure Cay rental properties",
      ],
      path: "/properties",
    }),
    links: [{ rel: "canonical", href: `https://${site.domain}/properties` }],
  }),
});

function PropertiesIndexPage() {
  const { region = "all" } = Route.useSearch();
  const list = getPropertiesByRegion(region as Region | "all");
  const filters = [
    { id: "all" as const, label: regionLabels.all },
    { id: "naples" as const, label: regionLabels.naples },
    { id: "bahamas" as const, label: regionLabels.bahamas },
  ];

  return (
    <div className="pb-16 md:pb-24">
      <section className="border-b border-border bg-bg-elevated">
        <div className="container-page py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            The collection
          </p>
          <h1 className="mt-2 max-w-2xl font-display text-4xl tracking-tight text-fg text-balance md:text-5xl">
            Residences we host
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted text-pretty">
            Waterfront cottages and resort living in Naples, and a beachfront
            house on Treasure Cay—each reserved directly with{" "}
            {site.legalName}.
          </p>
        </div>
      </section>

      <div className="container-page py-10">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = region === f.id || (f.id === "all" && !region);
            return (
              <Button
                key={f.id}
                asChild
                size="sm"
                variant={active ? "default" : "secondary"}
                className={cn(!active && "text-fg-muted")}
              >
                <Link
                  to="/properties"
                  search={f.id === "all" ? {} : { region: f.id }}
                >
                  {f.label}
                </Link>
              </Button>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-fg-muted">
          Showing {list.length} propert{list.length === 1 ? "y" : "ies"}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {list.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
