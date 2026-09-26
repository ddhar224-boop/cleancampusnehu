import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS, servicesQuery, unitLabel } from "@/lib/catalog";
import { rupees } from "@/lib/auth";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services and prices | CampusClean" },
      { name: "description", content: "Wash and fold, ironing, dry cleaning, bedding, shoes and bags. Current CampusClean prices at NEHU Tura." },
      { property: "og:title", content: "CampusClean services and prices" },
      { property: "og:description", content: "Wash and fold, ironing, dry cleaning, bedding and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Services,
});

function Services() {
  const q = useQuery(servicesQuery);
  const grouped: Record<string, NonNullable<typeof q.data>> = {};
  for (const s of q.data ?? []) (grouped[s.category] ??= []).push(s);

  return (
    <div className="container-page py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Services and prices</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Pickup and standard delivery are free on campus. Express delivery adds ₹40. Weight is confirmed on our scale at pickup.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/plans">Plans</Link></Button>
          <Button asChild><Link to="/book">Book a pickup</Link></Button>
        </div>
      </div>
      {q.isLoading ? <p className="mt-8 text-sm text-muted-foreground">Loading...</p> : null}
      {Object.entries(grouped).map(([cat, list]) => (
        <section key={cat} className="mt-12">
          <h2 className="text-xl font-semibold">{CATEGORY_LABELS[cat] ?? cat}</h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {list.map((s) => (
                  <tr key={s.id}>
                    <td className="p-4"><p className="font-medium">{s.name}</p><p className="mt-0.5 text-muted-foreground">{s.description}</p></td>
                    <td className="whitespace-nowrap p-4 text-muted-foreground">{s.turnaround}</td>
                    <td className="whitespace-nowrap p-4 text-right font-medium">{rupees(s.price)} <span className="font-normal text-muted-foreground">{unitLabel(s.unit)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
