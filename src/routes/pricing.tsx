import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Section, SectionHeading } from "@/components/site/Section";
import { SERVICES } from "@/lib/campusclean";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing, CampusClean Campus Laundry" },
      {
        name: "description",
        content:
          "Indicative CampusClean launch pricing: wash from ₹60/kg, wash-dry-iron from ₹120/kg, express, delicate care and bedding rates, with every fee itemised.",
      },
      { property: "og:title", content: "CampusClean Pricing" },
      {
        property: "og:description",
        content: "Transparent per-kg, per-item and fixed pricing for campus laundry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Transparent Pricing"
          title="Indicative launch pricing"
          body="Final rates are set per campus before we open bookings there. Whatever the rate, your order summary always shows laundry charges, fees, discounts and total separately."
        />

        <Card className="mt-12 overflow-hidden shadow-soft">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Basis</TableHead>
                  <TableHead>Turnaround</TableHead>
                  <TableHead className="text-right">From</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SERVICES.map((s) => (
                  <TableRow key={s.slug}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-muted-foreground">{s.unit}</TableCell>
                    <TableCell className="text-muted-foreground">{s.turnaround}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {s.indicativePrice}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Section>

      <Section className="surface-gradient pt-0 sm:pt-0">
        <div className="grid gap-6 pt-20 lg:grid-cols-3">
          {[
            {
              t: "Pickup & delivery",
              b: "Hostel pickup and standard delivery are included at launch. Express delivery carries a separate fee, shown before you confirm.",
            },
            {
              t: "Plans",
              b: "Weekly, monthly and hostel saver plans are on the roadmap. Nothing is billed on repeat until recurring billing is properly implemented.",
            },
            {
              t: "Payments",
              b: "UPI, cards and net banking are being set up. Until the gateway is live, orders are pay-on-delivery, we never show a fake successful payment.",
            },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-base font-semibold">{x.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{x.b}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Button asChild className="rounded-full">
            <Link to="/book">Book laundry</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
