import { Link } from "@tanstack/react-router";
import logo from "@/assets/campusclean-logo.png";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img
        src={logo}
        alt="CampusClean"
        width={816}
        height={816}
        loading="lazy"
        className="h-9 w-9 rounded-xl object-contain"
      />
      <span
        className={`font-display text-lg font-bold tracking-tight ${
          inverted ? "text-ink-foreground" : "text-foreground"
        }`}
      >
        Campus<span className="text-primary">Clean</span>
      </span>
    </Link>
  );
}
