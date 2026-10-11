import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
};

const sizes = {
  sm: "h-9 w-9 text-[0.65rem]",
  md: "h-10 w-10 text-xs",
  lg: "h-12 w-12 text-sm",
} as const;

/** Premium AMS monogram used in header, footer, and brand moments. */
export function BrandMark({
  className,
  size = "md",
  inverted = false,
}: BrandMarkProps) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-md font-semibold tracking-[0.12em]",
        sizes[size],
        inverted
          ? "bg-fg-on-ink/10 text-fg-on-ink ring-1 ring-fg-on-ink/15"
          : "bg-bg-ink text-fg-on-ink shadow-[var(--shadow-soft)]",
        className,
      )}
      aria-hidden
    >
      AMS
      <span
        className={cn(
          "absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full",
          inverted ? "bg-accent/80" : "bg-accent",
        )}
      />
    </span>
  );
}
