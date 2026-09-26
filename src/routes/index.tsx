import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Clock,
  Gift,
  Leaf,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/site/Section";
import { SERVICES, STEPS, FAQS, COVERAGE, TRACK_STAGES, BRAND } from "@/lib/campusclean";
import heroImage from "@/assets/hero-campus-laundry.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusClean, Clean Clothes. Less Hassle." },
      {
        name: "description",
        content:
          "CampusClean brings reliable laundry pickup, professional cleaning and doorstep delivery to university life. Launching at NEHU Tura Campus.",
      },
      { property: "og:title", content: "CampusClean, Your Campus Laundry, Reimagined." },
      {
        property: "og:description",
        content:
          "Book laundry pickup from your hostel, track every stage, and get folded clothes delivered to your door.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-24">
          <div>
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
              Launching at {BRAND.launchCampus}
            </Badge>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-6xl">
              Clean Clothes.
              <br />
              <span className="text-gradient">Less Hassle.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              CampusClean brings reliable laundry pickup, professional cleaning and doorstep
              delivery directly to university life.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/book">
                  Book Your Laundry <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[
                { k: "48h", v: "Standard turnaround" },
                { k: "12", v: "Tracked order stages" },
                { k: "QR", v: "Scanned at every step" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl border border-border bg-card/70 p-4">
                  <dt className="font-display text-2xl font-bold text-foreground">{s.k}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-border shadow-lift">
              <img
                src={heroImage}
                alt="Student handing a bag of laundry to a CampusClean delivery member at a hostel door"
                width={1600}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-4 w-64 rounded-2xl border border-border bg-card p-4 shadow-lift sm:left-8">
              <p className="text-xs font-medium text-muted-foreground">Order CC-2026-000124</p>
              <p className="mt-1 text-sm font-semibold">Wash + Dry + Iron · 5.2 kg</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[55%] rounded-full bg-primary" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Sample order · Washing in progress
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why CampusClean */}
      <Section id="why" className="mt-8">
        <SectionHeading
          eyebrow="Why CampusClean"
          title="Laundry day shouldn't cost you a day"
          body="Buckets, shared machines, missing clothes and no idea when anything will be dry. We built the thing we wanted as students."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Clock,
              title: "Slots that fit classes",
              body: "Evening pickup and delivery windows, chosen by you.",
            },
            {
              icon: QrCode,
              title: "Nothing gets mixed up",
              body: "Every bag carries a QR that staff scan at each stage.",
            },
            {
              icon: ShieldCheck,
              title: "Transparent pricing",
              body: "Full breakdown before you confirm. No surprise charges.",
            },
            {
              icon: Sparkles,
              title: "Proper machines",
              body: "Sorted, washed and pressed by trained staff, not a bucket.",
            },
          ].map((f) => (
            <Card key={f.title} className="border-border/70 shadow-soft">
              <CardContent className="pt-6">
                <f.icon className="size-6 text-primary" />
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section className="surface-gradient rounded-none">
        <SectionHeading
          eyebrow="How It Works"
          title="Four steps, from hostel door to folded pile"
        />
        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-border bg-card p-6">
              <span className="font-display text-sm font-bold text-primary">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/how-it-works">
              See the full process <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Services */}
      <Section id="services">
        <SectionHeading
          eyebrow="Our Services"
          title="Pick exactly the service you need"
          body="Weight based, item based or fixed price, configured per campus before launch."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 6).map((s) => (
            <Card key={s.slug} className="border-border/70 shadow-soft">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold">{s.name}</h3>
                  <Badge variant="secondary" className="shrink-0 rounded-full">
                    {s.indicativePrice} {s.unit}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
                <p className="mt-4 text-xs font-medium text-muted-foreground">
                  Turnaround · {s.turnaround}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10">
          <Button asChild className="rounded-full">
            <Link to="/services">
              All services <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Pricing preview */}
      <Section className="surface-gradient">
        <SectionHeading
          eyebrow="Transparent Pricing"
          title="You see every rupee before you confirm"
          body="Laundry charges, pickup, delivery, express fee, discounts and total, itemised on the order summary."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <Card className="shadow-lift">
            <CardContent className="pt-6">
              <p className="text-sm font-semibold">Sample order summary</p>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ["Wash + Dry + Iron · 5 kg", "₹600"],
                  ["Hostel pickup", "₹0"],
                  ["Standard delivery", "₹0"],
                  ["First order discount", "−₹50"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
                <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                  <dt>Total</dt>
                  <dd>₹550</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-muted-foreground">
                Sample calculation using indicative launch pricing.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            {SERVICES.slice(0, 4).map((s) => (
              <div key={s.slug} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="mt-2 font-display text-2xl font-bold text-primary">
                  {s.indicativePrice}
                </p>
                <p className="text-xs text-muted-foreground">{s.unit}</p>
              </div>
            ))}
            <div className="sm:col-span-2">
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/pricing">
                  Full price list <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Tracking */}
      <Section className="ink-panel">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              inverted
              eyebrow="Track Your Laundry"
              title="Know exactly where your clothes are"
              body="Twelve recorded stages, each with a timestamp and the staff member who updated it. No more guessing."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-full">
                <Link to="/track">Track an order</Link>
              </Button>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-2">
            {TRACK_STAGES.map((stage, i) => (
              <li
                key={stage}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-ink-foreground/80"
              >
                <span
                  className={`size-2 rounded-full ${i < 5 ? "bg-primary" : "bg-white/25"}`}
                />
                {stage}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Pickup & delivery + coverage */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Pickup & Delivery"
              title="Hostel door, pickup point, or your room"
              body="Choose the collection method your hostel allows, then a slot. Fully booked slots are closed automatically so nobody is left waiting."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Truck, t: "Hostel pickup" },
                { icon: MapPin, t: "Pickup point" },
                { icon: BadgeCheck, t: "Room pickup" },
              ].map((x) => (
                <div key={x.t} className="rounded-2xl border border-border bg-card p-5">
                  <x.icon className="size-5 text-primary" />
                  <p className="mt-3 text-sm font-semibold">{x.t}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="Campus Coverage" title="Where we are headed" />
            <div className="mt-8 space-y-4">
              {COVERAGE.map((c) => (
                <div key={c.university} className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm font-semibold">{c.university}</p>
                  <ul className="mt-3 space-y-2">
                    {c.campuses.map((camp) => (
                      <li
                        key={camp.name}
                        className="flex items-center justify-between gap-3 text-sm text-muted-foreground"
                      >
                        <span>{camp.name}</span>
                        <Badge variant="secondary" className="rounded-full">
                          {camp.status}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                We have not announced any university partnerships. Campuses are listed by our own
                rollout plan.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Benefits */}
      <Section className="surface-gradient">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Student Benefits" title="Built around hostel life" />
            <ul className="mt-8 space-y-3">
              {[
                "Verified campus member status before your first pickup",
                "Reorder your usual load in two taps",
                "Reward points on every order and referral",
                "Notifications at every stage, not just at delivery",
                "Raise a complaint or claim directly from the order",
              ].map((b) => (
                <li key={b} className="flex gap-3 text-sm text-muted-foreground">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Staff Benefits" title="For university staff too" />
            <ul className="mt-8 space-y-3">
              {[
                "Staff ID verification, no university email needed",
                "Family-sized loads, bedding and blankets covered",
                "Delivery to campus quarters and departments",
                "Digital invoices for every completed order",
                "Priority express service when you need it fast",
              ].map((b) => (
                <li key={b} className="flex gap-3 text-sm text-muted-foreground">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Sustainability + rewards */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden border-border/70 shadow-soft">
            <CardContent className="pt-6">
              <Leaf className="size-6 text-primary" />
              <h3 className="mt-4 text-xl font-bold">Sustainability</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Pooled machine loads use far less water and electricity than dozens of separate
                bucket washes. We plan bulk pickups per hostel to cut trips, reuse laundry bags
                instead of plastic, and choose detergents that are gentler on Tura's water.
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-border/70 shadow-soft">
            <CardContent className="pt-6">
              <Gift className="size-6 text-primary" />
              <h3 className="mt-4 text-xl font-bold">CampusClean Rewards</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Earn points on orders, repeat bookings, referrals and reviews. Points, coupons and
                refund credits sit in your CampusClean wallet, with promotional credit always shown
                separately from real money.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                {["Referral code", "Coupons", "Wallet credits", "Points history"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 font-medium text-secondary-foreground"
                  >
                    <Wallet className="size-3.5" /> {t}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="surface-gradient">
        <SectionHeading
          eyebrow="Student Voices"
          title="Sample feedback"
          body="CampusClean has not launched yet, so these are illustrative examples written by our own team, not real customer reviews. Real, verified reviews will replace them after launch."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            "Between labs and assignments, laundry was the thing I always skipped. A fixed evening pickup would solve it.",
            "The part I care about most is tracking. If I can see it is being ironed, I stop worrying about it.",
            "Sharing one washing machine with a whole hostel floor is the real problem this fixes.",
          ].map((t, i) => (
            <Card key={i} className="border-border/70 shadow-soft">
              <CardContent className="pt-6">
                <Badge variant="outline" className="rounded-full text-[10px] uppercase">
                  Sample data
                </Badge>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">“{t}”</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <SectionHeading eyebrow="FAQ" title="Questions students actually ask" center />
        <div className="mx-auto mt-10 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.slice(0, 5).map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/faq">All questions</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Contact + final CTA */}
      <Section className="pb-0">
        <div className="ink-panel overflow-hidden rounded-[2rem] px-8 py-14 sm:px-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-ink-foreground sm:text-4xl">
                Your Campus Laundry, Reimagined.
              </h2>
              <p className="mt-4 max-w-md text-ink-foreground/70">
                Register now and you will be notified the moment CampusClean opens bookings at your
                campus.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full px-7">
                  <Link to="/book">Book Your Laundry</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/25 bg-transparent px-7 text-ink-foreground hover:bg-white/10"
                >
                  <Link to="/auth">Create an account</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-foreground">
                <Bell className="size-4 text-primary" /> Contact CampusClean
              </p>
              <p className="mt-4 text-sm text-ink-foreground/70">
                Questions, campus requests or partnership ideas, write to us.
              </p>
              <p className="mt-4 font-display text-lg font-semibold text-ink-foreground">
                {BRAND.email}
              </p>
              <p className="mt-2 text-xs text-ink-foreground/50">
                Based at {BRAND.launchCampus}, Meghalaya.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
