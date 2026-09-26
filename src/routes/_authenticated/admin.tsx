import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { rupees, useRoles } from "@/lib/auth";
import { useState } from "react";
import { CAMPUSES } from "@/lib/campus";
import { CATEGORY_LABELS, STATUS_FLOW, STATUS_LABELS } from "@/lib/catalog";
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
          {isAdmin ? <TabsTrigger value="hostels">Hostels</TabsTrigger> : null}
          {isAdmin ? <TabsTrigger value="waitlist">Waitlist</TabsTrigger> : null}
          {isAdmin ? <TabsTrigger value="hostel-pickup">Hostel Pickup</TabsTrigger> : null}
        </TabsList>
        <TabsContent value="orders"><OrdersPanel /></TabsContent>
        {isAdmin ? <TabsContent value="subs"><SubsPanel /></TabsContent> : null}
        {isAdmin ? <TabsContent value="members"><MembersPanel /></TabsContent> : null}
        {isAdmin ? <TabsContent value="prices"><PricesPanel /></TabsContent> : null}
        {isAdmin ? <TabsContent value="hostels"><HostelsPanel /></TabsContent> : null}
        {isAdmin ? <TabsContent value="waitlist"><WaitlistPanel /></TabsContent> : null}
        {isAdmin ? <TabsContent value="hostel-pickup"><HostelPickupPanel /></TabsContent> : null}
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
        .select("id, code, status, total, pickup_date, pickup_slot, pickup_location, delivery_date, delivery_slot, payment_status, user_id")
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
              <td className="p-3 text-muted-foreground">{o.pickup_date} {o.pickup_slot}<br />{o.pickup_location}{o.delivery_date ? <><br />Deliver {o.delivery_date} {o.delivery_slot}</> : null}</td>
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
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState<"piece" | "kg">("piece");
  const [category, setCategory] = useState("clothes");

  async function save(id: string, patch: { price?: number; active?: boolean; name?: string; unit?: string }) {
    if (patch.unit === "kg" && !confirm("Only blankets should be priced per kg. Charge this item by weight?")) return;
    const { error } = await supabase.from("services").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    qc.invalidateQueries();
  }
  async function remove(id: string, label: string) {
    if (!confirm(`Delete ${label}?`)) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) { toast.error("This item is on past orders, so it cannot be deleted. Hide it instead."); return; }
    toast.success("Deleted");
    qc.invalidateQueries();
  }
  async function add() {
    const p = Number(price);
    if (name.trim().length < 2 || !(p > 0)) { toast.error("Enter a name and a price above 0"); return; }
    if (unit === "kg" && !confirm("Only blankets should be priced per kg. Continue?")) return;
    const slug = `${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;
    const max = Math.max(0, ...(q.data ?? []).map((s) => s.sort_order));
    const { error } = await supabase.from("services").insert({ slug, name: name.trim(), price: p, unit, category, sort_order: max + 1 });
    if (error) { toast.error(error.message); return; }
    setName(""); setPrice(""); setUnit("piece");
    toast.success("Item added");
    qc.invalidateQueries();
  }

  const sel = "h-8 rounded-md border border-input bg-background px-2 text-sm";
  return (
    <div className="mt-4 grid gap-4">
      <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border p-3">
        <Input placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} className="h-8 w-44" maxLength={80} />
        <Input placeholder="Price" type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} className="h-8 w-24" />
        <select value={unit} onChange={(e) => setUnit(e.target.value as "piece" | "kg")} className={sel} aria-label="Pricing unit">
          <option value="piece">per piece</option><option value="kg">per kg</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={sel} aria-label="Category">
          {Object.entries(CATEGORY_LABELS).filter(([k]) => k !== "laundry").map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <Button size="sm" onClick={add}>Add item</Button>
      </div>
      <ul className="divide-y divide-border rounded-lg border border-border">
        {q.data?.map((s) => (
          <li key={s.id} className={`flex flex-wrap items-center justify-between gap-3 p-3 text-sm ${s.active ? "" : "opacity-60"}`}>
            <Input
              defaultValue={s.name} className="h-8 w-56" maxLength={80} aria-label="Item name"
              onBlur={(e) => { const v = e.target.value.trim(); if (v.length >= 2 && v !== s.name) save(s.id, { name: v }); }}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Input
                type="number" min={0} step="1" defaultValue={Number(s.price)} className="h-8 w-24" aria-label="Price"
                onBlur={(e) => { const v = Number(e.target.value); if (v >= 0 && v !== Number(s.price)) save(s.id, { price: v }); }}
              />
              <select value={s.unit === "kg" ? "kg" : "piece"} onChange={(e) => save(s.id, { unit: e.target.value })} className={sel} aria-label="Pricing unit">
                <option value="piece">per piece</option><option value="kg">per kg</option>
              </select>
              <Button size="sm" variant="outline" onClick={() => save(s.id, { active: !s.active })}>{s.active ? "Hide" : "Show"}</Button>
              <Button size="sm" variant="ghost" onClick={() => remove(s.id, s.name)}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HostelsPanel() {
  const qc = useQueryClient();
  const [campusId, setCampusId] = useState(CAMPUSES[0]!.id);
  const [name, setName] = useState("");
  const q = useQuery({
    queryKey: ["admin-hostels", campusId],
    queryFn: async () => {
      const { data, error } = await supabase.from("hostels").select("id, name, active").eq("campus_id", campusId).order("name");
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin-hostels"] }); qc.invalidateQueries({ queryKey: ["hostels"] }); };
  async function add() {
    if (name.trim().length < 2) { toast.error("Enter a hostel name"); return; }
    const { error } = await supabase.from("hostels").insert({ campus_id: campusId, name: name.trim() });
    if (error) { toast.error(error.message); return; }
    setName(""); refresh();
  }
  async function patch(id: string, p: { active?: boolean; name?: string }) {
    const { error } = await supabase.from("hostels").update(p).eq("id", id);
    if (error) toast.error(error.message); else refresh();
  }
  async function remove(id: string) {
    const { error } = await supabase.from("hostels").delete().eq("id", id);
    if (error) toast.error(error.message); else refresh();
  }
  return (
    <div className="mt-4 grid gap-4">
      <p className="text-sm text-muted-foreground">Hostels shown in the booking dropdown for each campus. Students can still type a hostel that is not listed.</p>
      <div className="flex flex-wrap gap-2">
        <select value={campusId} onChange={(e) => setCampusId(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          {CAMPUSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New hostel name" maxLength={80} className="w-64" />
        <Button onClick={add}>Add hostel</Button>
      </div>
      {q.data?.length === 0 ? <p className="text-sm text-muted-foreground">No hostels added for this campus yet.</p> : null}
      <ul className="divide-y divide-border rounded-lg border border-border">
        {q.data?.map((h) => (
          <li key={h.id} className="flex flex-wrap items-center gap-2 p-3">
            <Input defaultValue={h.name} className="w-64" onBlur={(e) => e.target.value.trim() !== h.name && patch(h.id, { name: e.target.value.trim() })} />
            {!h.active ? <Badge variant="secondary">Hidden</Badge> : null}
            <Button size="sm" variant="outline" onClick={() => patch(h.id, { active: !h.active })}>{h.active ? "Hide" : "Show"}</Button>
            <Button size="sm" variant="outline" onClick={() => remove(h.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WaitlistPanel() {
  const q = useQuery({
    queryKey: ["admin-waitlist"],
    queryFn: async () => {
      const { data, error } = await supabase.from("waitlist_interests").select("id, service, name, contact, university, campus, created_at").order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      return data;
    },
  });
  const counts: Record<string, number> = {};
  for (const r of q.data ?? []) { const k = `${r.campus ?? "Unknown campus"} | ${r.service}`; counts[k] = (counts[k] ?? 0) + 1; }
  return (
    <div className="mt-4 grid gap-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(counts).map(([k, n]) => <Badge key={k} variant="secondary">{k}: {n}</Badge>)}
      </div>
      {q.data?.length === 0 ? <p className="text-sm text-muted-foreground">No waitlist sign-ups yet.</p> : null}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr><th className="p-2">Date</th><th className="p-2">Service</th><th className="p-2">Name</th><th className="p-2">Contact</th><th className="p-2">University</th><th className="p-2">Campus</th></tr></thead>
          <tbody>
            {q.data?.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-2">{r.created_at.slice(0, 10)}</td><td className="p-2">{r.service}</td><td className="p-2">{r.name}</td><td className="p-2">{r.contact}</td><td className="p-2">{r.university ?? "-"}</td><td className="p-2">{r.campus ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
