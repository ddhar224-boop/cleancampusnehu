import { Link } from "@tanstack/react-router";
import { Shirt } from "lucide-react";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="CampusClean home">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <Shirt className="size-5" strokeWidth={2.2} />
      </span>
      <span className={`font-display text-xl font-extrabold ${inverted ? "text-ink-foreground" : "text-foreground"}`}>
        Campus<span className="text-accent">Clean</span>
      </span>
    </Link>
  );
}
