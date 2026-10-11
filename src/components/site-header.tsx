import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { site } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/destinations", label: "Destinations" },
  { to: "/events", label: "Events" },
  { to: "/book", label: "Reserve" },
  { to: "/reservations", label: "My stays" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link
          to="/"
          className="group flex min-w-0 items-center gap-3 focus-ring rounded-sm"
          onClick={() => setOpen(false)}
        >
          <BrandMark size="md" />
          <span className="min-w-0">
            <span className="block truncate font-display text-[0.95rem] font-medium leading-tight tracking-tight text-fg sm:text-lg">
              Arnold Management Services
            </span>
            <span className="block text-[0.65rem] font-medium uppercase tracking-[0.16em] text-fg-subtle sm:text-[0.7rem]">
              LLC · Naples, FL
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
          {nav.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-2 py-2 text-sm font-medium transition-colors focus-ring 2xl:px-3",
                  active
                    ? "bg-bg-subtle text-fg"
                    : "text-fg-muted hover:bg-bg-subtle hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${site.phoneTel}`}
            className="hidden text-sm font-medium text-fg-muted transition-colors hover:text-fg 2xl:inline"
          >
            {site.phone}
          </a>
          <Button asChild size="sm">
            <Link to="/book">Reserve a stay</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {open ? (
        <div className="border-t border-border bg-bg-elevated xl:hidden">
          <nav className="container-page flex flex-col gap-1 py-3" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-fg hover:bg-bg-subtle focus-ring"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${site.phoneTel}`}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-primary"
              onClick={() => setOpen(false)}
            >
              Call {site.phone}
            </a>
            <Button asChild className="mt-2">
              <Link to="/book" onClick={() => setOpen(false)}>
                Reserve a stay
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
