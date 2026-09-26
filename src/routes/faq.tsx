import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/site/Section";
import { FAQS } from "@/lib/campusclean";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — CampusClean Laundry for Students" },
      {
        name: "description",
        content:
          "Answers on campus coverage, ID verification, pricing, payments, lost or damaged items and special washing instructions at CampusClean.",
      },
      { property: "og:title", content: "CampusClean FAQ" },
      {
        property: "og:description",
        content: "Everything students and staff ask before their first laundry pickup.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <Section>
      <SectionHeading eyebrow="FAQ" title="Frequently asked questions" center />
      <div className="mx-auto mt-10 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-10 text-center">
          <Button asChild className="rounded-full">
            <Link to="/book">Book your laundry</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
