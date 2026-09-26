import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { rupees } from "@/lib/auth";
import { STATUS_LABELS } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/orders/")({
  head: () => ({
    meta: [
      { title: "My orders | CampusClean" },
      { name: "description", content: "Every CampusClean order you have placed, with live status." },
      { property: "og:title", content: "My CampusClean orders" },
      { property: "og:description", content: "Every order you have placed, with live status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Orders,
});

function Orders() {
  const { user } = Route.useRouteContext();
  const q = useQuery({
    queryKey: ["orders-all", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, code, status, total, pickup_date, pickup_slot, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container-page py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My orders</h1>
        <Button asChild><Link to="/book">New order</Link></Button>
      </div>
      {q.isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading...</p>
      ) : q.data?.length ? (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="p-3">Order</th><th className="p-3">Pickup</th><th className="p-3">Status</th><th className="p-3 text-right">Total</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {q.data.map((o) => (
                <tr key={o.id}>
                  <td className="p-3"><Link to="/orders/$id" params={{ id: o.id }} className="font-medium text-primary hover:underline">{o.code}</Link></td>
                  <td className="p-3 text-muted-foreground">{o.pickup_date}, {o.pickup_slot}</td>
                  <td className="p-3"><Badge variant="secondary">{STATUS_LABELS[o.status]}</Badge></td>
                  <td className="p-3 text-right">{rupees(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">You have not placed any orders yet.</p>
      )}
    </div>
  );
}
