import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Section, SectionHeading } from "@/components/site/Section";
import { TRACK_STAGES } from "@/lib/campusclean";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Your Laundry, CampusClean" },
      {
        name: "description",
        content:
          "Enter your CampusClean order ID to follow your laundry through pickup, washing, ironing, quality check and doorstep delivery.",
      },
      { property: "og:title", content: "Track Your Laundry, CampusClean" },
      {
        property: "og:description",
        content: "Twelve tracked stages, each with a timestamp, for every CampusClean order.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <Section>
      <SectionHeading
        eyebrow="Track Your Laundry"
        title="Where are my clothes?"
        body="Your order ID looks like CC-2026-000124. It is on your booking confirmation and on your order page."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <form
          className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <Label htmlFor="orderId">Order ID</Label>
          <Input
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="CC-2026-000124"
            className="mt-2"
          />
          <Button type="submit" className="mt-4 w-full rounded-full">
            Track order
          </Button>

          {submitted ? (
            <Alert className="mt-6">
              <AlertTitle>Order tracking isn't live yet</AlertTitle>
              <AlertDescription>
                CampusClean accounts and live orders are being set up. Once bookings open at your
                campus, this page will show the real status of your order, with timestamps for
                every stage.
              </AlertDescription>
            </Alert>
          ) : null}
        </form>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm font-semibold">What the timeline looks like</p>
          <ol className="mt-5 space-y-3">
            {TRACK_STAGES.map((stage, i) => (
              <li key={stage} className="flex items-center gap-3 text-sm">
                <span
                  className={`size-2.5 rounded-full ${
                    i < 4 ? "bg-primary" : "border border-border bg-muted"
                  }`}
                />
                <span className={i < 4 ? "font-medium" : "text-muted-foreground"}>{stage}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs text-muted-foreground">
            Sample timeline shown for illustration.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/auth">Create an account</Link>
        </Button>
      </div>
    </Section>
  );
}
