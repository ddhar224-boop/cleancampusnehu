import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  ArrowRight, Backpack, BedDouble, Bell, Building2, CalendarDays, Check,
  Clock3, CreditCard, Gift, IdCard, MapPin, PackageCheck, Search, Shirt,
  Sparkles, UtensilsCrossed, Wallet, WandSparkles, Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WaitlistForm } from "@/components/WaitlistForm";
import { STEPS, FAQS, BRAND } from "@/lib/campusclean";
import { servicesQuery, plansQuery, CATEGORY_LABELS } from "@/lib/catalog";
import { rupees } from "@/lib/auth";
import { useCampus } from "@/lib/campus";
import heroImage from "@/assets/campus-laundry-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "CampusClean | Campus laundry pickup made simple" },
    { name: "description", content: "Book hostel laundry pickup, see current per-piece prices, track every order and get clean clothes delivered back to campus." },
    { property: "og:title", content: "CampusClean | Campus laundry pickup made simple" },
    { property: "og:description", content: "Real laundry pickup, cleaning and delivery for university students and staff." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

const CATEGORY_ICONS: Record<string, typeof Shirt> = { laundry: Shirt, ironing: Wind, dry_clean: Sparkles, home: BedDouble, specialty: Backpack };
const REVEAL = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.55 } };

function Home() {
  const services = useQuery(servicesQuery);
  const plans = useQuery(plansQuery);
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const { campus } = useCampus();
  const minPrice: Record<string, number> = {};
  for (const service of services.data ?? []) {
    const price = Number(service.price);
    const existing = minPrice[service.category];
    if (existing === undefined || price < existing) minPrice[service.category] = price;
  }
  const [weekly, monthly, semester] = plans.data ?? [];

  return (
    <div className="page-reveal pb-6">
      <section className="container-page pt-6 sm:pt-10">
        <div className="grid min-h-[620px] overflow-hidden rounded-3xl bg-ink lg:grid-cols-[1.02fr_.98fr]">
          <div className="flex flex-col justify-between p-7 text-ink-foreground sm:p-12 lg:p-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/15 bg-ink-foreground/5 px-3 py-2 text-sm font-semibold">
                <MapPin className="size-4 text-mint" /> Laundry pickup at {campus.name}
              </div>
              <h1 className="mt-8 max-w-2xl text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
                Laundry day, <span className="text-mint">completely</span> simplified.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-foreground/70">
                We collect from your hostel, clean every piece with care, and deliver it back. You focus on campus life.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/book">Schedule pickup <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline" className="border-ink-foreground/20 bg-ink-foreground/5 text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"><Link to="/services">View pricing</Link></Button>
            </div>
          </div>
          <div className="relative min-h-[390px] overflow-hidden lg:min-h-full">
            <img src={heroImage} width={1536} height={1024} alt="Students handing their laundry to a CampusClean pickup team member" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-5 bottom-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-card/50 bg-card/95 p-4 text-card-foreground shadow-lift backdrop-blur-md sm:inset-x-8 sm:bottom-8 sm:p-5">
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-bold">Pickup from your hostel</p>
                <p className="mt-1 text-sm text-muted-foreground">Choose your hostel, room, pickup and delivery time.</p>
              </div>
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-mint text-mint-foreground"><CalendarDays className="size-6" /></span>
            </div>
          </div>
        </div>

        <div className="relative z-10 -mt-3 grid gap-4 px-3 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
          {[
            { icon: PackageCheck, title: "Per-piece pricing", body: "Clear prices before you confirm", tone: "bg-primary text-primary-foreground" },
            { icon: Clock3, title: "48 hour return", body: "Express is available when needed", tone: "bg-card text-card-foreground" },
            { icon: CreditCard, title: "Pay on delivery", body: "Cash or UPI at your door", tone: "bg-mint text-mint-foreground" },
            { icon: WandSparkles, title: "AI pickup helper", body: "Describe the pile and get a ready request", tone: "bg-accent text-accent-foreground" },
          ].map((item) => (
            <motion.div key={item.title} whileHover={{ y: -6 }} className={`rounded-2xl border border-border/60 p-5 shadow-soft ${item.tone}`}>
              <item.icon className="size-6" />
              <h2 className="mt-6 text-lg font-bold">{item.title}</h2>
              <p className="mt-1 text-sm opacity-75">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section {...REVEAL} className="container-page mt-24">
        <div className="grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase text-accent">Real prices, no guesswork</p>
            <h2 className="mt-2 text-4xl font-extrabold sm:text-5xl">Every item gets the right care.</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">Regular clothes are priced per piece. Only blankets are charged by weight.</p>
          </div>
          <Button asChild variant="outline"><Link to="/services">See every price <ArrowRight /></Link></Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Object.keys(CATEGORY_LABELS).map((category, index) => {
            const Icon = CATEGORY_ICONS[category] ?? Shirt;
            const list = services.data?.filter((service) => service.category === category) ?? [];
            const price = minPrice[category];
            return (
              <Link key={category} to="/services" className={`bento bento-hover flex min-h-56 flex-col ${index === 0 ? "bg-primary text-primary-foreground sm:col-span-2" : ""}`}>
                <span className={`flex size-12 items-center justify-center rounded-xl ${index === 0 ? "bg-primary-foreground/15" : "bg-secondary text-primary"}`}><Icon className="size-6" /></span>
                <h3 className="mt-6 text-xl font-bold">{CATEGORY_LABELS[category]}</h3>
                <p className={`mt-2 text-sm ${index === 0 ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{list.map((service) => service.name).slice(0, 4).join(", ")}</p>
                <p className="mt-auto pt-5 font-bold">{price === undefined ? "See prices" : `From ${rupees(price)}`}</p>
              </Link>
            );
          })}
        </div>
      </motion.section>

      <motion.section {...REVEAL} className="container-page mt-24 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-3xl bg-card p-7 shadow-soft sm:p-10">
          <p className="text-sm font-bold uppercase text-accent">How it works</p>
          <h2 className="mt-2 text-4xl font-extrabold">From laundry bag to your door.</h2>
          <ol className="mt-10 grid gap-7 sm:grid-cols-2">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink font-display font-bold text-ink-foreground">{index + 1}</span>
                <div><h3 className="font-bold">{step.title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p></div>
              </li>
            ))}
          </ol>
          <Button asChild variant="link" className="mt-7 px-0"><Link to="/how-it-works">See the full process <ArrowRight /></Link></Button>
        </div>
        <div className="flex flex-col justify-between rounded-3xl bg-ink p-7 text-ink-foreground shadow-lift sm:p-10">
          <div>
            <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground"><Search /></span>
            <h2 className="mt-8 text-3xl font-extrabold">Track Your Order</h2>
            <p className="mt-3 text-ink-foreground/65">Enter the ID on your confirmation or bag tag.</p>
          </div>
          <form className="mt-10 grid gap-3" onSubmit={(event) => { event.preventDefault(); navigate({ to: "/track", search: { code: code.trim().toUpperCase() } }); }}>
            <Input value={code} onChange={(event) => setCode(event.target.value)} placeholder="CC-2026-000001" className="h-12 border-ink-foreground/20 bg-ink-foreground/10 text-ink-foreground placeholder:text-ink-foreground/40" />
            <Button type="submit" size="lg" className="bg-mint text-mint-foreground hover:bg-mint/90">Track order <ArrowRight /></Button>
          </form>
        </div>
      </motion.section>

      <motion.section {...REVEAL} className="container-page mt-24">
        <div className="rounded-3xl bg-primary p-7 text-primary-foreground sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase text-primary-foreground/70">Laundry plans</p>
              <h2 className="mt-2 text-4xl font-extrabold">A plan for every kind of campus week.</h2>
              <p className="mt-4 text-primary-foreground/75">Request a plan online and pay when we make the first pickup.</p>
              <Button asChild size="lg" className="mt-8 bg-ink text-ink-foreground hover:bg-ink/90"><Link to="/plans">Compare plans <ArrowRight /></Link></Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[weekly, monthly, semester].map((plan, index) => (
                <div key={plan?.id ?? index} className={`flex min-h-64 flex-col rounded-2xl p-5 ${index === 2 ? "bg-mint text-mint-foreground" : "bg-card text-card-foreground"}`}>
                  <p className="font-display text-xl font-bold">{plan?.name ?? "Plan"}</p>
                  <p className="mt-2 text-sm opacity-70">{plan?.description ?? "Loading plan details"}</p>
                  <div className="mt-auto"><p className="font-display text-3xl font-extrabold">{plan ? rupees(plan.price) : ""}</p><p className="mt-1 text-xs opacity-65">{plan ? `${plan.pickups_included} pickups · ${plan.period_days} days` : ""}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section {...REVEAL} className="container-page mt-24">
        <div><p className="text-sm font-bold uppercase text-accent">Coming soon</p><h2 className="mt-2 text-4xl font-extrabold">More for campus life.</h2><p className="mt-3 max-w-2xl text-muted-foreground">Register interest. These services are not live yet.</p></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: IdCard, t: "NEHU Points Card", b: "Pay with your student ID like a campus card.", waitlist: "nehu_points" },
            { icon: UtensilsCrossed, t: "Tiffin services", b: "Daily meals delivered to your hostel.", waitlist: "tiffin" },
            { icon: Building2, t: "PG and hostel rental", b: "Verified rooms near your campus.", waitlist: "pg_rental" },
            { icon: Backpack, t: "Backpackers", b: "Laundry and travel help for students on the move.", waitlist: "backpackers" },
            { icon: Wallet, t: "Student wallet", b: "Keep a balance ready for pickups." },
            { icon: Gift, t: "Rewards", b: "Earn points from real orders and referrals." },
            { icon: Bell, t: "Live notifications", b: "Know when every order stage changes." },
            { icon: CreditCard, t: "Online payment", b: "Pay by card or UPI inside the app." },
          ].map((item) => (
            <div key={item.t} className="bento bento-hover flex min-h-60 flex-col">
              <div className="flex items-center justify-between"><span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary"><item.icon /></span><span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-bold uppercase text-muted-foreground">Coming soon</span></div>
              <h3 className="mt-6 text-lg font-bold">{item.t}</h3><p className="mt-2 text-sm text-muted-foreground">{item.b}</p>
              {item.waitlist ? <div className="mt-auto pt-4"><WaitlistForm service={item.waitlist} serviceLabel={item.t} /></div> : null}
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section {...REVEAL} className="container-page mt-24 grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
        <div><p className="text-sm font-bold uppercase text-accent">Questions</p><h2 className="mt-2 text-4xl font-extrabold">Quick, clear answers.</h2><p className="mt-4 text-muted-foreground">Need more help? Open the CampusClean chatbot or <Link to="/contact" className="font-bold text-primary hover:underline">contact us</Link>.</p></div>
        <Accordion type="single" collapsible className="rounded-3xl bg-card px-6 shadow-soft">
          {FAQS.slice(0, 6).map((faq) => <AccordionItem key={faq.q} value={faq.q}><AccordionTrigger className="text-left font-bold">{faq.q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent></AccordionItem>)}
        </Accordion>
      </motion.section>

      <section className="container-page mt-24">
        <div className="grid gap-6 rounded-3xl bg-mint p-8 text-mint-foreground sm:p-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0"><h2 className="text-4xl font-extrabold">{BRAND.hinglish}</h2><p className="mt-3 max-w-xl opacity-75">Create your real account, choose your campus and book when the laundry bag is ready.</p></div>
          <Button asChild size="lg" className="shrink-0 bg-ink text-ink-foreground hover:bg-ink/90"><Link to="/auth">Create account <ArrowRight /></Link></Button>
        </div>
      </section>
    </div>
  );
}
