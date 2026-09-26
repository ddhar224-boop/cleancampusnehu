import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeading } from "@/components/site/Section";
import { SERVICES } from "@/lib/campusclean";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Laundry Services, CampusClean" },
      {
        name: "description",
        content:
          "Wash, dry, iron, express, delicate care, bedding and shoe cleaning for university students and staff, priced per kg, per item or fixed.",
      },
      { property: "og:title", content: "Laundry Services, CampusClean" },
      {
        property: "og:description",
        content: "Every CampusClean service, what it includes, and indicative launch pricing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Our Services"
        title="Everything we clean"
        body="Each service is configured per campus by our team, weight based, item based or fixed price. Prices below are indicative for launch."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <Card key={s.slug} className="border-border/70 shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold">{s.name}</h3>
                <Badge variant="secondary" className="shrink-0 rounded-full">
                  {s.unit}
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              <div className="mt-5 flex items-end justify-between">
                <p className="font-display text-2xl font-bold text-primary">
                  {s.indicativePrice}
                </p>
                <p className="text-xs text-muted-foreground">{s.turnaround}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold">Item-based washing</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          For item pricing you count pieces instead of weight: shirt, t-shirt, trouser, jeans,
          bedsheet, blanket, jacket, saree and other. Staff confirm the received count at intake,
          and any discrepancy is recorded and reported to you.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/book">Book laundry</Link>
        </Button>
      </div>
    </Section>
  );
}
