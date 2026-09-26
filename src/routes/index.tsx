import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BedDouble,
  Bell,
  CalendarDays,
  Clock,
  CreditCard,
  Footprints,
  Gift,
  Search,
  Shirt,
  Sparkles,
  Wallet,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { STEPS, FAQS, BRAND } from "@/lib/campusclean";
import { servicesQuery, plansQuery, CATEGORY_LABELS } from "@/lib/catalog";
import { rupees } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusClean | Dhulai hum karenge, chill aap karo" },
      { name: "description", content: "Laundry pickup from your hostel at NEHU Tura. Washed, ironed and delivered back in 48 hours, from ₹60 per kg. Pay cash or UPI on delivery." },
      { property: "og:title", content: "CampusClean | Dhulai hum karenge, chill aap karo" },
      { property: "og:description", content: "Hostel pickup, washing, ironing and delivery for NEHU Tura students and staff." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

const CATEGORY_ICONS: Record<string, typeof Shirt> = {
  laundry: Shirt,
  ironing: Wind,
  dry_clean: Sparkles,
  home: BedDouble,
  specialty: Footprints,
};

function Home() {
  const services = useQuery(servicesQuery);
  const plans = useQuery(plansQuery);
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const minPrice: Record<string, number> = {};
  for (const s of services.data ?? []) {
    const p = Number(s.price);
    if (minPrice[s.category] === undefined || p < minPrice[s.category]!) minPrice[s.category] = p;
  }
  const [weekly, monthly, semester] = plans.data ?? [];

  return (
    <div className="container-page py-8 sm:py-10">
      {/* Bento hero */}
      <div className="grid grid-cols-1 gap-4 md:auto-rows-[160px] md:grid-cols-4">
        <div className="flex flex-col justify-between rounded-2xl bg-ink p-8 text-ink-foreground md:col-span-3 md:row-span-2 sm:p-10">
          <div>
            <p className="text-sm font-medium text-ink-foreground/60">Laundry pickup at {BRAND.launchCampus}</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.08] sm:text-6xl">
              <span className="text-primary-soft">Dhulai</span> hum karenge, <span className="text-accent">chill</span> aap karo.
            </h1>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="h-12 px-8">
              <Link to="/book">Book a pickup <ArrowRight className="size-4" /></Link>
            </Button>
            <span className="text-sm text-ink-foreground/60">Washed, ironed and back at your door in 48 hours.</span>
          </div>
        </div>

        <div className="bento flex flex-col justify-between md:row-span-2">
          <div>
            <span className="flex size-10 items-center justify-center rounded-full bg-secondary">
              <CalendarDays className="size-5 text-primary" />
            </span>
            <h3 className="mt-4 text-lg font-bold">Hostel pickup</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Free pickup and drop at your hostel room, any day between 8 am and 8 pm.</p>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-sm">
            <span>Slots</span>
            <span className="font-bold text-primary">4 daily</span>
          </div>
        </div>

        <div className="bento flex items-center gap-5 md:col-span-2">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary">
            <Clock className="size-7 text-accent" />
          </span>
          <div>
            <h3 className="font-bold">48 hour turnaround</h3>
            <p className="text-sm text-muted-foreground">Need it sooner? Express comes back the same day if booked before 10 am.</p>
          </div>
        </div>

        <Link to="/services" className="bento-hover flex flex-col justify-center rounded-2xl bg-primary p-6 text-primary-foreground transition-transform">
          <p className="text-sm text-primary-foreground/80">Starts from</p>
          <p className="font-display text-3xl font-bold">₹60<span className="text-sm font-semibold">/kg</span></p>
          <p className="mt-2 text-xs">{services.data?.length ?? 15} services, see all prices</p>
        </Link>

        <div className="bento flex flex-col justify-center">
          <h3 className="text-sm font-bold">Payment</h3>
          <div className="mt-3 flex gap-2">
            <span className="rounded-md bg-secondary px-3 py-1 text-xs font-bold">CASH</span>
            <span className="rounded-md bg-secondary px-3 py-1 text-xs font-bold">UPI</span>
          </div>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">On delivery</p>
        </div>

        {/* Plans */}
        {[weekly, monthly].map((p, i) =>
          p ? (
            <div key={p.id} className="bento flex flex-col justify-between md:row-span-2">
              <div>
                <h3 className="font-bold text-primary">{p.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{i === 0 ? "For light, regular laundry" : "What most students pick"}</p>
                <p className="mt-3 text-sm text-muted-foreground">{Number(p.kg_allowance)} kg, {p.pickups_included} pickup{p.pickups_included > 1 ? "s" : ""}, {p.period_days} days</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold">{rupees(p.price)}</p>
                <Button asChild variant="outline" size="sm" className="mt-4 w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Link to="/plans">Select plan</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div key={i} className="bento md:row-span-2" />
          ),
        )}

        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-primary-soft p-8 text-ink md:col-span-2 md:row-span-2">
          <div>
            <span className="inline-block rounded-full bg-ink/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Lowest per kg</span>
            <h3 className="mt-4 text-2xl font-bold">{semester?.name ?? "Semester Saver"}</h3>
            <p className="mt-2 text-sm text-ink/80">One payment for the whole term. {semester ? `${Number(semester.kg_allowance)} kg and ${semester.pickups_included} pickups.` : ""}</p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-display text-4xl font-extrabold">{semester ? rupees(semester.price) : ""}</p>
              <p className="mt-1 text-xs font-bold uppercase text-ink/70">Priority slot booking included</p>
            </div>
            <Button asChild size="lg" className="bg-ink text-ink-foreground hover:bg-ink/90">
              <Link to="/plans">See plan</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Services */}
      <section className="mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-accent">Services</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Har kapde ka sahi treatment</h2>
            <p className="mt-2 text-muted-foreground">Everyday wash and fold to blazers, sarees, blankets and sneakers.</p>
          </div>
          <Button asChild variant="outline"><Link to="/services">All services and prices</Link></Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Object.keys(CATEGORY_LABELS).map((cat) => {
            const Icon = CATEGORY_ICONS[cat] ?? Shirt;
            const list = services.data?.filter((s) => s.category === cat) ?? [];
            return (
              <Link key={cat} to="/services" className="bento bento-hover flex flex-col">
                <Icon className="size-6 text-primary" />
                <h3 className="mt-4 font-bold">{CATEGORY_LABELS[cat]}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{list.map((s) => s.name).slice(0, 3).join(", ")}</p>
                <p className="mt-auto pt-4 text-sm font-semibold">
                  {minPrice[cat] !== undefined ? `From ${rupees(minPrice[cat]!)}` : ""}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works + track */}
      <section className="mt-20 grid gap-4 lg:grid-cols-3">
        <div className="bento lg:col-span-2 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">How it works</p>
          <h2 className="mt-2 text-3xl font-bold">Bag do, fresh kapde lo</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink font-display text-sm font-bold text-ink-foreground">{i + 1}</span>
                <div>
                  <h3 className="font-bold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link to="/how-it-works" className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            The full process <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="flex flex-col justify-between rounded-2xl bg-ink p-8 text-ink-foreground">
          <div>
            <Search className="size-6 text-accent" />
            <h2 className="mt-4 text-2xl font-bold">Kapde kahan tak pahunche?</h2>
            <p className="mt-2 text-sm text-ink-foreground/70">Enter your order ID to see its current stage.</p>
          </div>
          <form
            className="mt-6 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/track", search: { code: code.trim().toUpperCase() } });
            }}
          >
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="CC-2026-000001" className="h-11 border-ink-foreground/20 bg-ink-foreground/10 text-ink-foreground placeholder:text-ink-foreground/40" />
            <Button type="submit" variant="secondary" className="h-11">Track order</Button>
          </form>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mt-20 grid gap-4 md:grid-cols-3">
        {[
          { t: "Hostel students", b: "No buckets, no fighting for the washing line, no missing socks. Book between classes and forget about it." },
          { t: "Staff and faculty", b: "Office wear ironed and ready. Pickup from staff quarters on the same slots." },
          { t: "Exam weeks", b: "A plan covers your pickups so you can study while we handle the pile." },
        ].map((c, i) => (
          <div key={c.t} className={`rounded-2xl p-8 ${i === 1 ? "bg-primary text-primary-foreground" : "bento"}`}>
            <h3 className="text-xl font-bold">{c.t}</h3>
            <p className={`mt-3 text-sm leading-relaxed ${i === 1 ? "text-primary-foreground/85" : "text-muted-foreground"}`}>{c.b}</p>
          </div>
        ))}
      </section>

      {/* Coming soon */}
      <section className="mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-accent">Coming soon</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Aur bhi aa raha hai</h2>
            <p className="mt-2 text-muted-foreground">
              We are building these next. Nothing here is live yet, so do not wait on any of it for
              your laundry.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Wallet, t: "Student wallet", b: "Add money once and pay for pickups from your balance, no cash counting at the door." },
            { icon: Gift, t: "Rewards and referrals", b: "Points on every order and a share code that gives you and your friend a discount." },
            { icon: Bell, t: "In-app notifications", b: "A message the moment your order moves, without opening the app to check." },
            { icon: CreditCard, t: "Online payment", b: "Pay by card or UPI inside the app instead of cash on delivery." },
          ].map((c) => (
            <div key={c.t} className="bento flex flex-col">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-full bg-secondary">
                  <c.icon className="size-5 text-primary" />
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Coming soon
                </span>
              </div>
              <h3 className="mt-4 font-bold">{c.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-accent">FAQ</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Sawaal? Jawab yahan hain.</h2>
          <p className="mt-3 text-muted-foreground">Still unsure? <Link to="/contact" className="font-semibold text-primary hover:underline">Message us</Link>.</p>
        </div>
        <Accordion type="single" collapsible className="bento py-2">
          {FAQS.slice(0, 6).map((f) => (
            <AccordionItem key={f.q} value={f.q} className="last:border-0">
              <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mt-20 flex flex-col items-start justify-between gap-6 rounded-2xl bg-ink p-8 text-ink-foreground sm:p-12 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold">{BRAND.hinglish}</h2>
          <p className="mt-2 text-ink-foreground/70">Create an account in a minute and book your first pickup.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/auth">Create account</Link></Button>
          <Button asChild size="lg" variant="outline" className="border-ink-foreground/30 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"><Link to="/plans">View plans</Link></Button>
        </div>
      </section>
    </div>
  );
}
