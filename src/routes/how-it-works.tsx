import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { STEPS, TRACK_STAGES } from "@/lib/campusclean";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How CampusClean Works — Pickup, Cleaning, Delivery" },
      {
        name: "description",
        content:
          "Book a slot, we collect from your hostel, wash and press at our facility, and deliver folded laundry back to your door — tracked across 12 stages.",
      },
      { property: "og:title", content: "How CampusClean Works" },
      {
        property: "og:description",
        content: "From hostel pickup to doorstep delivery, with QR tracking at every stage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="How It Works"
          title="From hostel door to folded pile"
          body="The whole journey takes four actions from you and about 48 hours from us."
        />
        <ol className="mt-12 space-y-4">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <span className="font-display text-2xl font-bold text-primary">0{i + 1}</span>
              <div>
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="surface-gradient">
        <SectionHeading
          eyebrow="Order Stages"
          title="Twelve stages, all recorded"
          body="Every status change stores the stage, the timestamp, the staff member and an optional note, so your timeline is a real record — not an estimate."
        />
        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TRACK_STAGES.map((stage, i) => (
            <li
              key={stage}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm"
            >
              <span className="font-display text-xs font-bold text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              {stage}
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link to="/book">Book your laundry</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/pricing">See pricing</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
