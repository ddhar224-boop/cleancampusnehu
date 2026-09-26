import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, QrCode, Receipt, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/site/Section";
import { STEPS, FAQS, BRAND } from "@/lib/campusclean";
import { servicesQuery, plansQuery, unitLabel } from "@/lib/catalog";
import { rupees } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusClean | Laundry pickup and delivery at NEHU Tura" },
      { name: "description", content: "Book a laundry pickup from your hostel at NEHU Tura. Washed, ironed and delivered back, from ₹60 per kg. Pay on delivery." },
      { property: "og:title", content: "CampusClean | Laundry pickup at NEHU Tura" },
      { property: "og:description", content: "Hostel pickup, washing, ironing and delivery for NEHU Tura students and staff." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

function Home() {
  const services = useQuery(servicesQuery);
  const plans = useQuery(plansQuery);

  return (
    <>
      <section className="border-b border-border">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-medium text-primary">Now taking orders at {BRAND.launchCampus}</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              We pick up your laundry from your hostel and bring it back washed and folded.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Book a two hour pickup slot, see the full price before you confirm, and pay in cash or UPI when your clothes come back. Wash and fold starts at ₹60 per kg.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/book">Book a pickup <ArrowRight className="size-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/services">See prices</Link></Button>
            </div>
          </div>
          <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {[
              { icon: Clock, k: "48 hour turnaround", v: "Same day with Express, if booked before 10 am." },
              { icon: Truck, k: "Free hostel pickup", v: "Four slots a day, 8 am to 8 pm." },
              { icon: QrCode, k: "Tagged bags", v: "Each order gets an ID you can track at every stage." },
              { icon: Receipt, k: "Pay on delivery", v: "Cash or UPI once you have your clothes." },
            ].map((f) => (
              <div key={f.k} className="bg-background p-5">
                <f.icon className="size-5 text-primary" />
                <dt className="mt-3 text-sm font-semibold">{f.k}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section>
        <SectionHeading eyebrow="How it works" title="Four steps from your door and back" />
        <ol className="mt-10 grid gap-6 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t-2 border-primary pt-4">
              <span className="text-sm font-semibold text-primary">Step {i + 1}</span>
              <h3 className="mt-2 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="bg-secondary">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Prices" title="What it costs" body="Pickup and standard delivery are free. These are the prices you are charged." />
          <Button asChild variant="outline"><Link to="/services">All {services.data?.length ?? ""} services</Link></Button>
        </div>
        <div className="mt-8 overflow-hidden rounded-lg border border-border bg-background">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-border">
              {services.data?.slice(0, 6).map((s) => (
                <tr key={s.id}>
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="hidden p-4 text-muted-foreground sm:table-cell">{s.turnaround}</td>
                  <td className="p-4 text-right">{rupees(s.price)} <span className="text-muted-foreground">{unitLabel(s.unit)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Plans" title="Doing laundry every week?" body="A plan costs less per kg and covers your pickups. Pay once at your first pickup." />
          <Button asChild variant="outline"><Link to="/plans">Compare plans</Link></Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {plans.data?.map((p) => (
            <Link key={p.id} to="/plans" className="rounded-lg border border-border p-5 transition-colors hover:border-primary">
              <p className="font-semibold">{p.name}</p>
              <p className="mt-2 font-display text-2xl font-bold">{rupees(p.price)}</p>
              <p className="text-sm text-muted-foreground">{Number(p.kg_allowance)} kg over {p.period_days} days, {p.pickups_included} pickups</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="bg-secondary">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <Accordion type="single" collapsible>
            {FAQS.slice(0, 6).map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col items-start justify-between gap-6 rounded-lg border border-border p-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Questions before your first order?</h2>
            <p className="mt-2 text-muted-foreground">Email us at {BRAND.email}. We reply the same day.</p>
          </div>
          <Button asChild size="lg"><Link to="/auth">Create an account</Link></Button>
        </div>
      </Section>
    </>
  );
}
