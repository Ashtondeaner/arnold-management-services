import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AtmosphereSound } from "@/components/atmosphere-sound";
import { CreatedWithGrokBanner } from "@/components/created-with-grok-banner";
import { SeoJsonLd } from "@/components/seo-json-ld";
import {
  buildPageMeta,
  localServiceJsonLd,
  organizationJsonLd,
  siteKeywords,
  websiteJsonLd,
} from "@/data/seo";
import { site } from "@/data/properties";
import appCss from "@/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { name: "theme-color", content: "#0f1c24" },
      ...buildPageMeta({
        title: `Arnold Management Services | Vacation Rentals Naples FL & Treasure Cay Bahamas · ${site.domain}`,
        description: `${site.legalName} (${site.domain}) — local vacation rental management in Naples, Florida (${site.headquarters.zip}) and Treasure Cay, Abaco, Bahamas. Homes: I102 Naples Bay Resort, 107 Tahiti Street, 119 Tahiti Street, 2001 Bahama Beach Club. Call ${site.phone}.`,
        keywords: siteKeywords,
        path: "/",
        image: "/images/hero.jpg",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: `https://${site.domain}/` },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <CreatedWithGrokBanner />
      <SiteHeader />
      <main className="min-h-[70vh]">
        <Outlet />
      </main>
      <SiteFooter />
      <AtmosphereSound />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-US">
      <head>
        <HeadContent />
        <SeoJsonLd data={organizationJsonLd()} />
        <SeoJsonLd data={websiteJsonLd()} />
        <SeoJsonLd data={localServiceJsonLd()} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
