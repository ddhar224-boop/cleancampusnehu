import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Backpack,
  Droplets,
  Layers,
  Lightbulb,
  Shirt,
  Sparkles,
  Tag,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { BRAND } from "@/lib/campusclean";

export const Route = createFileRoute("/care-guide")({
  head: () => ({
    meta: [
      { title: "Laundry Care Guide | CampusClean" },
      {
        name: "description",
        content:
          "Practical laundry care guidance for hostel life: how to bag your clothes, treat stains, read wash care symbols and pick between wash and dry cleaning.",
      },
      { property: "og:title", content: "Laundry Care Guide | CampusClean" },
      {
        property: "og:description",
        content:
          "How to bag clothes, treat stains and read care symbols before your pickup at NEHU Tura.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareGuidePage,
});

const BEFORE_BAG = [
  {
    t: "Empty every pocket",
    b: "Chargers, ID cards, earphones and cash get damaged in the wash. Check all pockets before handing the bag over.",
  },
  {
    t: "Close zips and drawstrings",
    b: "Zip up jackets and bags, and tie drawstrings so they do not tangle around other clothes or snag fabric.",
  },
  {
    t: "Separate by colour",
    b: "Keep whites, light colours and dark colours in different bags. Fresh dark jeans and new printed tees bleed colour the first few washes.",
  },
  {
    t: "Set delicate items aside",
    b: "Put innerwear, lycra gym wear and knits in a mesh bag or an old pillowcase with a knot. We wash delicates gently either way, but a bag protects them from hooks and zips.",
  },
  {
    t: "Point out stains when booking",
    b: "Add a note in the booking, like coffee on the white shirt. Stains are easiest to remove the same day, and telling us helps us treat them before the main wash.",
  },
  {
    t: "Send dry items only",
    b: "If something came back wet from the rain, dry it first. Sealed wet clothes in a bag can develop smell and mildew before we even collect them.",
  },
];

const STAINS = [
  {
    t: "Tea, coffee and food",
    b: "Rinse the back of the fabric with cold water as soon as possible. Do not scrub with hot water, heat cooks the stain in. Dab gently and let it air dry.",
  },
  {
    t: "Ink and pen",
    b: "Do not rub, it spreads. Place tissue under the fabric and blot with a little spirit or hand sanitiser from the top. Tell us at pickup and we will pre-treat it properly.",
  },
  {
    t: "Oil and grease",
    b: "Blot the excess with tissue, then dust with talcum powder or cornflour and leave it for a few hours to absorb the oil. Brush off before the pickup.",
  },
  {
    t: "Blood",
    b: "Only cold water, never hot. Soak the spot and rub gently. Hot water sets blood permanently.",
  },
  {
    t: "Sweat and deodorant marks",
    b: "Do not iron over them. Heat makes yellow underarm marks permanent. Bring them in and we treat them before washing.",
  },
  {
    t: "Unknown stains",
    b: "Do not experiment with bleach. Note what you spilled, when, and mention it in the booking note. Wrong treatment can make a stain permanent.",
  },
];

const SYMBOLS = [
  { t: "Wash tub", b: "A tub with a number is the maximum water temperature in degrees Celsius. 30 for delicates and dark colours, 40 for everyday cotton. A hand in the tub means hand wash only. A crossed tub means do not wash at home." },
  { t: "Triangle", b: "A triangle means bleaching is allowed, a crossed triangle means never bleach that garment. When in doubt, skip the bleach." },
  { t: "Square with circle", b: "A square with a circle inside is tumble drying. Dots show heat level, a crossed circle means line dry only." },
  { t: "Iron with dots", b: "Dots on the iron are heat levels: one dot is low for synthetics and silk, two dots medium for wool and polyester, three dots high for cotton and linen. A crossed iron means do not iron." },
];

const FABRICS = [
  { t: "Cotton", b: "Tough and forgiving. Shrinkage is small but real, so hot water and high heat are fine only for whites and bedsheets." },
  { t: "Synthetics and gym wear", b: "Polyester and lycra hate heat. Wash cool and never iron directly, the fabric can melt or shine." },
  { t: "Denim", b: "Wash inside out in cold water to keep the colour. Wash only when needed, not after every wear." },
  { t: "Wool and knits", b: "Cold water only, never wring or hang wet. Dry flat so the shape holds. If the label says hand wash only, tell us and we handle it that way." },
  { t: "Silk and sarees", b: "Home washing ruins the finish and colour. Send silk sarees, mekhela sadors and delicate ethnic wear as dry cleaning, not regular laundry." },
  { t: "Bedsheets and curtains", b: "Big loads, big machine. Curtains collect dust, so wash them at the start of the semester, not in exam week." },
];

const DRY_CLEAN = [
  "Blazers, suit jackets and formal coats",
  "Silk sarees and mekhela sador",
  "Heavy embroidered ethnic wear",
  "Leather-trimmed items and ties",
  "Anything whose label says dry clean only",
];

function CareGuidePage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Care Guide"
          title="Kapdon ka khayal, sahi tareeke se"
          body="A short, practical guide for hostel laundry: what to do before the pickup, how to handle stains, and how to read the symbols on your label. Nothing here is a rule we invented, it is standard laundry practice written for campus life."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <Backpack className="size-6 text-primary" />
            <h3 className="mt-4 text-lg font-bold">Bag se pehle</h3>
            <p className="mt-1 text-sm text-muted-foreground">Five minutes of prep makes every wash come out better.</p>
            <ul className="mt-4 space-y-3">
              {BEFORE_BAG.map((x) => (
                <li key={x.t} className="text-sm">
                  <span className="font-semibold">{x.t}.</span>{" "}
                  <span className="text-muted-foreground">{x.b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <Droplets className="size-6 text-accent" />
            <h3 className="mt-4 text-lg font-bold">Stain first aid</h3>
            <p className="mt-1 text-sm text-muted-foreground">The first ten minutes after a spill decide everything.</p>
            <ul className="mt-4 space-y-3">
              {STAINS.map((x) => (
                <li key={x.t} className="text-sm">
                  <span className="font-semibold">{x.t}.</span>{" "}
                  <span className="text-muted-foreground">{x.b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="bg-secondary">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading
              eyebrow="Symbols"
              title="Label ke symbols ka matlab"
              body="Every tag has four basic symbols. Once you know these, you can care for any garment correctly."
            />
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-soft">
              <Tag className="mt-0.5 size-4 shrink-0 text-primary" />
              <p>
                No symbol at all? Treat it as gentle: cold water, no bleach, low heat. That
                combination almost never damages a garment.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {SYMBOLS.map((x) => (
              <div key={x.t} className="bento">
                <h3 className="font-bold">{x.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{x.b}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Fabrics"
          title="Har fabric ka apna rule hai"
          body="The same wash that is safe for a cotton t-shirt can ruin a saree. Here is the short version."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FABRICS.map((x) => (
            <div key={x.t} className="bento">
              <Layers className="size-5 text-primary" />
              <h3 className="mt-3 font-bold">{x.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{x.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-secondary">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl bg-ink p-8 text-ink-foreground">
            <Sparkles className="size-6 text-accent" />
            <h3 className="mt-4 text-xl font-bold">Send these as dry cleaning</h3>
            <p className="mt-2 text-sm text-ink-foreground/70">
              Some items should never go in a regular wash. Pick the dry cleaning service for
              them when you book.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {DRY_CLEAN.map((x) => (
                <li key={x} className="flex gap-3">
                  <Shirt className="mt-0.5 size-4 shrink-0 text-accent" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            <TriangleAlert className="size-6 text-accent" />
            <h3 className="mt-4 text-xl font-bold">Common mistakes we see</h3>
            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
              <li>
                <span className="font-semibold text-foreground">Ironing over stains.</span> Heat
                sets a stain permanently. Treat the stain first, iron last.
              </li>
              <li>
                <span className="font-semibold text-foreground">Bleach on everything.</span> Bleach
                eats colour and weakens fabric. Most stains do not need it.
              </li>
              <li>
                <span className="font-semibold text-foreground">Leaving wet clothes sealed.</span>{" "}
                A damp bag overnight smells for days. Always send things dry.
              </li>
              <li>
                <span className="font-semibold text-foreground">Mixing gym socks with shirts.</span>{" "}
                Heavily soiled items should go in their own bag so the rest stays fresh.
              </li>
            </ul>
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-secondary p-4 text-sm text-muted-foreground">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
              <p>
                Unsure about an item? Write the question in your booking note or{" "}
                <Link to="/contact" className="font-semibold text-primary hover:underline">
                  message us
                </Link>{" "}
                before the pickup.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-ink p-8 text-ink-foreground sm:p-12 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold">{BRAND.hinglish}</h2>
            <p className="mt-2 text-ink-foreground/70">
              Bag packed the right way? Book your pickup and let us handle the rest.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/book">Book a pickup</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-ink-foreground/30 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
            >
              <Link to="/services">See services</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
