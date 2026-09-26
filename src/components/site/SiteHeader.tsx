import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useSession } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/services", label: "Services" },
  { to: "/plans", label: "Plans" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/track", label: "Track Order" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, ready } = useSession();
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/auth", replace: true });
  }

  const accountButtons = !ready ? null : user ? (
    <>
      <Button asChild variant="ghost" size="sm">
        <Link to="/dashboard" onClick={() => setOpen(false)}>My account</Link>
      </Button>
      <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
    </>
  ) : (
    <>
      <Button asChild variant="ghost" size="sm">
        <Link to="/auth" onClick={() => setOpen(false)}>Log in</Link>
      </Button>
      <Button asChild size="sm">
        <Link to="/book" onClick={() => setOpen(false)}>Book a pickup</Link>
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-foreground" }}
              className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">{accountButtons}</div>
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-foreground lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-wrap gap-2">{accountButtons}</div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
