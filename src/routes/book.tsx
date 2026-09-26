import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Section, SectionHeading } from "@/components/site/Section";

const BOOKING_STEPS = [
  "Select service",
  "Weight or item count",
  "Pickup location and slot",
  "Delivery speed",
  "Order summary",
  "Payment",
];

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book Laundry Pickup — CampusClean" },
      {
        name: "description",
        content:
          "Book a CampusClean laundry pickup in six steps: service, quantity, pickup slot, delivery speed, transparent summary and payment.",
      },
      { property: "og:title", content: "Book Laundry Pickup — CampusClean" },
      {
        property: "og:description",
        content: "Choose your service, hostel pickup slot and delivery speed in a few taps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          eyebrow="Book Laundry"
          title="Six steps to a clean pile"
          body="This is the booking flow being built next, on top of real accounts and campus verification."
        />
        <ol className="mt-10 space-y-3">
          {BOOKING_STEPS.map((s, i) => (
            <li
              key={s}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-soft"
            >
              <span className="font-display text-sm font-bold text-primary">0{i + 1}</span>
              <span className="text-sm font-medium">{s}</span>
            </li>
          ))}
        </ol>

        <Alert className="mt-8">
          <AlertTitle>Bookings aren't open yet</AlertTitle>
          <AlertDescription>
            We will not take an order we cannot fulfil. Accounts open first, then booking, then
            live order tracking at {"NEHU Tura Campus"}.
          </AlertDescription>
        </Alert>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link to="/pricing">See pricing</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/how-it-works">How it works</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
