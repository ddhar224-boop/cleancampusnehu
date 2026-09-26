import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { rupees, useRoles } from "@/lib/auth";
import { STATUS_FLOW, STATUS_LABELS, unitLabel } from "@/lib/catalog";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Operations | CampusClean" },
      { name: "description", content: "CampusClean staff operations: orders, plans, members and prices." },
      { property: "og:title", content: "CampusClean operations" },
      { property: "og:description", content: "Staff operations for CampusClean." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { user } = Route.useRouteContext();
  const roles = useRoles(user.id);
  if (roles.isLoading) return <div className="container-page py-12 text-sm text-muted-foreground">Loading...</div>;
  const isAdmin = roles.data?.includes("admin");
  const isStaff = isAdmin || roles.data?.includes("staff");
  if (!isStaff)
    return (
      <div className="container-page py-12">
        <h1 className="text-2xl font-bold">Staff only</h1>
        <p className="mt-2 text-sm text-muted-foreground">This area is for CampusClean staff.</p>
        <Link to="/dashboard" className="mt-4 inline-block text-primary underline">Back to my account</Link>
      </div>
    );

  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-bold">Operations</h1>
      <Tabs defaultValue="orders" className="mt-6">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          {isAdmin ? <TabsTrigger value="subs">Plans</TabsTrigger> : null}
          {isAdmin ? <TabsTrigger value="members">Members</TabsTrigger> : null}
          {isAdmin ? <TabsTrigger value="prices">Prices</TabsTrigger> : null}
        </TabsList>
        <TabsContent value="orders"><OrdersPanel /></TabsContent>
        {isAdmin ? <TabsContent value="subs"><SubsPanel /></TabsContent> : null}
        {isAdmin ? <TabsContent value="members"><MembersPanel /></TabsContent> : null}
        {isAdmin ? <TabsContent value="prices"><PricesPanel /></TabsContent> : null}
      </Tabs>
    </div>
  );
}

function OrdersPanel() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, code, status, total, pickup_date, pickup_slot, pickup_location, payment_status, user_id")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });

  async function update(id: string, patch: { status?: OrderStatus; payment_status?: string }) {
    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  }

  if (q.isLoading) return <p className="mt-4 text-sm text-muted-foreground">Loading...</p>;
  if (!q.data?.length) return <p className="mt-4 text-sm text-muted-foreground">No orders yet.</p>;
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr><th className="p-3">Order</th><th className="p-3">Pickup</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Payment</th></tr>
        </thead>
        <tbody className="divide-y divide-border">
          {q.data.map((o) => (
            <tr key={o.id}>
              <td className="p-3 font-medium">{o.code}</td>
              <td className="p-3 text-muted-foreground">{o.pickup_date} {o.pickup_slot}<br />{o.pickup_location}</td>
              <td className="p-3">{rupees(o.total)}</td>
              <td className="p-3">
                <select value={o.status} onChange={(e) => update(o.id, { status: e.target.value as OrderStatus })} className="h-8 rounded-md border border-input bg-background px-2 text-sm">
                  {[...STATUS_FLOW, "cancelled" as const].map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </td>
              <td className="p-3">
                <Button size="sm" variant={o.payment_status === "paid" ? "secondary" : "outline"} onClick={() => update(o.id, { payment_status: o.payment_status === "paid" ? "unpaid" : "paid" })}>
                  {o.payment_status === "paid" ? "Paid" : "Mark paid"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubsPanel() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin-subs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("id, status, price, payment_status, starts_on, ends_on, created_at, user_id, plans(name, period_days)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function activate(id: string, days: number) {
    const start = new Date();
    const end = new Date(start.getTime() + days * 86400000);
    const { error } = await supabase.from("subscriptions").update({
      status: "active", payment_status: "paid",
      starts_on: start.toISOString().slice(0, 10), ends_on: end.toISOString().slice(0, 10),
    }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin-subs"] });
  }
  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("subscriptions").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin-subs"] });
  }

  if (!q.data?.length) return <p className="mt-4 text-sm text-muted-foreground">{q.isLoading ? "Loading..." : "No plan requests yet."}</p>;
  return (
    <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
      {q.data.map((s) => (
        <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-3 text-sm">
          <div>
            <p className="font-medium">{s.plans?.name} · {rupees(s.price)}</p>
            <p className="text-xs text-muted-foreground">Requested {new Date(s.created_at).toLocaleDateString("en-IN")}{s.ends_on ? ` · ends ${s.ends_on}` : ""}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">{s.status}</Badge>
            {s.status === "pending" ? <Button size="sm" onClick={() => activate(s.id, s.plans?.period_days ?? 30)}>Payment received, activate</Button> : null}
            {s.status === "pending" || s.status === "active" ? <Button size="sm" variant="outline" onClick={() => setStatus(s.id, "cancelled")}>Cancel</Button> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function MembersPanel() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin-members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(300);
      if (error) throw error;
      return data;
    },
  });
  async function verify(id: string, v: string) {
    const { error } = await supabase.from("profiles").update({ verification_status: v }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin-members"] });
  }
  if (!q.data?.length) return <p className="mt-4 text-sm text-muted-foreground">{q.isLoading ? "Loading..." : "No members yet."}</p>;
  return (
    <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
      {q.data.map((p) => (
        <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-3 text-sm">
          <div>
            <p className="font-medium">{p.full_name || "No name"} <span className="text-muted-foreground">· {p.mobile || "no mobile"}</span></p>
            <p className="text-xs text-muted-foreground capitalize">{p.member_type} ID {p.institution_id || "missing"} · {p.campus}{p.hostel ? `, ${p.hostel}` : ""}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">{p.verification_status}</Badge>
            {p.verification_status !== "verified" ? <Button size="sm" onClick={() => verify(p.id, "verified")}>Verify</Button> : null}
            {p.verification_status !== "rejected" ? <Button size="sm" variant="outline" onClick={() => verify(p.id, "rejected")}>Reject</Button> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function PricesPanel() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
  async function save(id: string, patch: { price?: number; active?: boolean }) {
    const { error } = await supabase.from("services").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    qc.invalidateQueries();
  }
  return (
    <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
      {q.data?.map((s) => (
        <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-3 text-sm">
          <p className="font-medium">{s.name} <span className="text-xs text-muted-foreground">{unitLabel(s.unit)}</span></p>
          <div className="flex items-center gap-2">
            <Input
              type="number" min={0} step="1" defaultValue={Number(s.price)} className="h-8 w-24"
              onBlur={(e) => { const v = Number(e.target.value); if (v >= 0 && v !== Number(s.price)) save(s.id, { price: v }); }}
            />
            <Button size="sm" variant="outline" onClick={() => save(s.id, { active: !s.active })}>{s.active ? "Hide" : "Show"}</Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
