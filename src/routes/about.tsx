import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { BRAND } from "@/lib/campusclean";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CampusClean, Campus Laundry from Northeast India" },
      {
        name: "description",
        content:
          "CampusClean is a student-built laundry service launching at NEHU Tura Campus, combining a real pickup-and-delivery operation with the platform that runs it.",
      },
      { property: "og:title", content: "About CampusClean" },
      {
        property: "og:description",
        content: "Why we are building a campus laundry business in Northeast India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="About Us"
          title="A laundry business, run like a product"
          body="CampusClean is two things at once: a real pickup-and-delivery laundry operation we run ourselves, and the software that manages orders, staff, payments and complaints behind it."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            {
              t: "Where we start",
              b: `${BRAND.launchCampus}. One campus, done properly, reliable slots, honest pricing, tracked orders.`,
            },
            {
              t: "Where we go",
              b: "NEHU Shillong next, then universities across Northeast India and, in time, across India. The platform is multi-university from day one.",
            },
            {
              t: "Who it is for",
              b: "Students and university staff. Registration uses your mobile number and Student or Staff ID, no university email or university database access required.",
            },
            {
              t: "How we handle trust",
              b: "Every order is QR-tracked, every status change is recorded with the staff member who made it, and every loss or damage claim is reviewed and closed with a documented outcome.",
            },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-base font-semibold">{x.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{x.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-secondary">
        <SectionHeading
          eyebrow="Contact"
          title="Talk to us"
          body="Campus requests, hostel tie-ups, feedback or questions, we read everything."
        />
        <p className="mt-6 font-display text-2xl font-bold text-primary">{BRAND.email}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link to="/book">Book laundry</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/faq">Read the FAQ</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
