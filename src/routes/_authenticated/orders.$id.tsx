import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { rupees } from "@/lib/auth";
import { STATUS_FLOW, STATUS_LABELS, unitLabel } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/orders/$id")({
  head: () => ({
    meta: [
      { title: "Order details | CampusClean" },
      { name: "description", content: "Status, items and bill for your CampusClean order." },
      { property: "og:title", content: "CampusClean order details" },
      { property: "og:description", content: "Status, items and bill for your order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*), order_events(status, created_at)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  async function cancel() {
    if (!confirm("Cancel this order?")) return;
    const { error } = await supabase.rpc("cancel_my_order", { _id: id });
    if (error) { toast.error(error.message); return; }
    toast.success("Order cancelled");
    qc.invalidateQueries();
  }

  if (q.isLoading) return <div className="container-page py-12 text-sm text-muted-foreground">Loading...</div>;
  const o = q.data;
  if (!o) return <div className="container-page py-12"><p>Order not found.</p><Link to="/orders" className="text-primary underline">Back to orders</Link></div>;

  const reachedAt = new Map(o.order_events.map((e) => [e.status, e.created_at]));
  const currentIdx = STATUS_FLOW.indexOf(o.status as (typeof STATUS_FLOW)[number]);

  return (
    <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_340px]">
      <div>
        <Link to="/orders" className="text-sm text-muted-foreground hover:text-foreground">All orders</Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">{o.code}</h1>
          <Badge variant={o.status === "cancelled" ? "destructive" : "secondary"}>{STATUS_LABELS[o.status]}</Badge>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Pickup {o.pickup_date}, {o.pickup_slot} from {o.pickup_location}. {o.delivery_speed === "express" ? "Express" : "Standard"} delivery.
        </p>

        {o.status !== "cancelled" ? (
          <ol className="mt-8 grid gap-0">
            {STATUS_FLOW.map((s, i) => {
              const done = i <= currentIdx;
              return (
                <li key={s} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className={`flex size-6 items-center justify-center rounded-full border ${done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}>
                      {done ? <Check className="size-3.5" /> : null}
                    </span>
                    {i < STATUS_FLOW.length - 1 ? <span className={`w-px flex-1 ${i < currentIdx ? "bg-primary" : "bg-border"}`} /> : null}
                  </div>
                  <div className="pb-5">
                    <p className={`text-sm ${done ? "font-medium" : "text-muted-foreground"}`}>{STATUS_LABELS[s]}</p>
                    {reachedAt.get(s) ? <p className="text-xs text-muted-foreground">{new Date(reachedAt.get(s)!).toLocaleString("en-IN")}</p> : null}
                  </div>
                </li>
              );
            })}
          </ol>
        ) : null}
      </div>

      <aside className="grid gap-4 lg:self-start">
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-semibold">Bill</h2>
            <dl className="mt-4 space-y-2 text-sm">
              {o.order_items.map((it) => (
                <div key={it.id} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{it.service_name} × {Number(it.quantity)} <span className="text-xs">({rupees(it.unit_price)} {unitLabel(it.unit)})</span></dt>
                  <dd>{rupees(it.line_total)}</dd>
                </div>
              ))}
              {Number(o.express_fee) > 0 ? <div className="flex justify-between"><dt className="text-muted-foreground">Express</dt><dd>{rupees(o.express_fee)}</dd></div> : null}
              <div className="flex justify-between border-t border-border pt-3 font-semibold"><dt>Total</dt><dd>{rupees(o.total)}</dd></div>
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              {o.payment_method === "cash" ? "Cash" : "UPI"} on delivery · {o.payment_status === "paid" ? "Paid" : "Not paid yet"}
            </p>
            {o.notes ? <p className="mt-3 text-xs text-muted-foreground">Your notes: {o.notes}</p> : null}
          </CardContent>
        </Card>
        {o.status === "placed" || o.status === "pickup_scheduled" ? (
          <Button variant="outline" onClick={cancel}>Cancel order</Button>
        ) : null}
      </aside>
    </div>
  );
}
