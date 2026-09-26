import { Link } from "@tanstack/react-router";
import { Shirt } from "lucide-react";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="CampusClean home">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Shirt className="size-5" strokeWidth={2.2} />
      </span>
      <span className={`font-display text-lg font-bold tracking-tight ${inverted ? "text-ink-foreground" : "text-foreground"}`}>
        Campus<span className="text-accent">Clean</span>
      </span>
    </Link>
  );
}
