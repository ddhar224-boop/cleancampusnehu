import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/campusclean";

export function SiteFooter() {
  return (
    <footer className="ink-panel mt-24">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-xl font-bold">
            Campus<span className="text-primary">Clean</span>
          </p>
          <p className="mt-3 max-w-sm text-sm text-ink-foreground/70">{BRAND.marketingTagline}</p>
          <p className="mt-6 text-sm text-ink-foreground/60">
            Launching at {BRAND.launchCampus}. Built by students, for campus life in Northeast
            India.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-foreground/70">
            <li>
              <Link to="/services" className="hover:text-ink-foreground">
                Services
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-ink-foreground">
                Prices
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-ink-foreground">
                How it works
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-ink-foreground">
                Track an order
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Get in touch</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-foreground/70">
            <li>
              <Link to="/about" className="hover:text-ink-foreground">
                About us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-ink-foreground">
                FAQ
              </Link>
            </li>
            <li>{BRAND.email}</li>
            <li>
              <Link to="/privacy" className="hover:text-ink-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-ink-foreground">
                Terms and Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-foreground/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-ink-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CampusClean. All rights reserved.</p>
          <p>Operating at NEHU Tura Campus, Meghalaya.</p>
        </div>
      </div>
    </footer>
  );
}
