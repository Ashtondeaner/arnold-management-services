import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {properties, site, type Property, teamNamesList } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  defaultPropertySlug?: string;
  compact?: boolean;
};

export function InquiryForm({ defaultPropertySlug, compact }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [propertySlug, setPropertySlug] = useState(
    defaultPropertySlug ?? properties[0]?.slug ?? "",
  );

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-bg-elevated p-6 text-center sm:p-8">
        <CheckCircle2 className="mx-auto size-10 text-success" />
        <h3 className="mt-4 font-display text-2xl text-fg">Thank you</h3>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Your note has reached our partners. {teamNamesList()} will respond
          personally. For information, write{" "}
          <a href={`mailto:${site.email}`} className="text-primary hover:underline">{site.email}</a>.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required placeholder="Jane Smith" autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            autoComplete="email"
          />
        </div>
      </div>

      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(239) 555-0100"
            autoComplete="tel"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="property">Property</Label>
          <select
            id="property"
            name="property"
            value={propertySlug}
            onChange={(e) => setPropertySlug(e.target.value)}
            className="flex h-11 w-full rounded-md border border-border bg-bg-elevated px-3.5 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {properties.map((p: Property) => (
              <option key={p.id} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-2">
          <Label htmlFor="checkin">Check-in</Label>
          <Input id="checkin" name="checkin" type="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="checkout">Check-out</Label>
          <Input id="checkout" name="checkout" type="date" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="guests">Guests</Label>
        <Input
          id="guests"
          name="guests"
          type="number"
          min={1}
          max={16}
          defaultValue={2}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your trip, preferred amenities, or questions…"
          rows={compact ? 3 : 4}
        />
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Send your note
      </Button>
      <p className="text-xs text-fg-subtle">
        Messages reach {site.legalName} directly. Telephone{" "}
        <a href={`tel:${site.phoneTel}`} className="text-primary hover:underline">
          {site.phone}
        </a>{" "}
        or write{" "}
        <a href={`mailto:${site.email}`} className="text-primary hover:underline">
          {site.email}
        </a>
        .
      </p>
    </form>
  );
}
