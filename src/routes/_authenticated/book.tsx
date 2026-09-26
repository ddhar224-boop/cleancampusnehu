import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { rupees } from "@/lib/auth";
import { CATEGORY_LABELS, EXPRESS_FEE, PICKUP_SLOTS, servicesQuery, unitLabel } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/book")({
  head: () => ({
    meta: [
      { title: "Book a pickup | CampusClean" },
      { name: "description", content: "Choose services, a pickup slot and delivery speed. See the full price before you confirm." },
      { property: "og:title", content: "Book a CampusClean pickup" },
      { property: "og:description", content: "Choose services and a pickup slot. Full price shown before you confirm." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Book,
});

function todayPlus(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function Book() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const services = useQuery(servicesQuery);
  const profile = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()).data,
  });

  const [qty, setQty] = useState<Record<string, number>>({});
  const [location, setLocation] = useState<string | null>(null);
  const [date, setDate] = useState(todayPlus(1));
  const [slot, setSlot] = useState(PICKUP_SLOTS[3]!);
  const [speed, setSpeed] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState<"cash" | "upi_on_delivery">("upi_on_delivery");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const defaultLocation = profile.data ? [profile.data.hostel, profile.data.room && `Room ${profile.data.room}`].filter(Boolean).join(", ") : "";
  const loc = location ?? defaultLocation;

  const lines = useMemo(
    () => (services.data ?? []).filter((s) => (qty[s.id] ?? 0) > 0).map((s) => ({ ...s, q: qty[s.id] ?? 0, total: Math.round(Number(s.price) * (qty[s.id] ?? 0) * 100) / 100 })),
    [services.data, qty],
  );
  const subtotal = lines.reduce((a, l) => a + l.total, 0);
  const fee = speed === "express" ? EXPRESS_FEE : 0;

  const pieceItems = (services.data ?? []).filter((s) => s.unit !== "kg");
  const kgItems = (services.data ?? []).filter((s) => s.unit === "kg");

  const grouped = useMemo(() => {
    const g: Record<string, typeof pieceItems> = {};
    for (const s of pieceItems) (g[s.category] ??= []).push(s);
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services.data]);

  function changePieces(id: string, delta: number) {
    setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(100, Math.round((q[id] ?? 0) + delta))) }));
  }
  function setWeight(id: string, raw: string) {
    const n = Number(raw);
    setQty((q) => ({ ...q, [id]: Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n * 10) / 10)) : 0 }));
  }

  async function submit() {
    if (!lines.length) { toast.error("Add at least one item"); return; }
    for (const l of lines) {
      if (l.unit !== "kg" && !Number.isInteger(l.q)) { toast.error(`${l.name} is priced per piece`); return; }
      if (l.q <= 0) { toast.error(`Enter a positive amount for ${l.name}`); return; }
    }
    if (loc.trim().length < 2) { toast.error("Enter your pickup location"); return; }
    setBusy(true);
    const { data, error } = await supabase.rpc("place_order", {
      _items: lines.map((l) => ({ service_id: l.id, quantity: l.q })),
      _pickup_location: loc.trim(),
      _pickup_date: date,
      _pickup_slot: slot,
      _delivery_speed: speed,
      _notes: notes.trim(),
      _payment_method: payment,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) { toast.error("Could not place order"); return; }
    toast.success(`Order ${row.code} placed`);
    navigate({ to: "/orders/$id", params: { id: row.id } });
  }

  return (
    <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-8">
        <div>
          <h1 className="text-3xl font-bold">Book a pickup</h1>
          <p className="mt-2 text-sm text-muted-foreground">Clothes are charged per piece. Only blankets are charged by weight, confirmed on our scale at pickup.</p>
        </div>

        <section>
          <h2 className="font-semibold">1. Clothes and linen: price per piece</h2>
          {services.isLoading ? <p className="mt-3 text-sm text-muted-foreground">Loading items...</p> : null}
          {Object.entries(grouped).map(([cat, list]) => (
            <div key={cat} className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{CATEGORY_LABELS[cat] ?? cat}</p>
              <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
                {list.map((s) => {
                  const n = qty[s.id] ?? 0;
                  return (
                    <li key={s.id} className="flex items-center justify-between gap-4 p-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">{rupees(s.price)} × {n} = {rupees(Number(s.price) * n)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button type="button" size="icon" variant="outline" className="size-8" aria-label={`Less ${s.name}`} onClick={() => changePieces(s.id, -1)}><Minus className="size-4" /></Button>
                        <span className="w-8 text-center text-sm tabular-nums">{n}</span>
                        <Button type="button" size="icon" variant="outline" className="size-8" aria-label={`More ${s.name}`} onClick={() => changePieces(s.id, 1)}><Plus className="size-4" /></Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        {kgItems.length ? (
          <section>
            <h2 className="font-semibold">2. Blanket: price per kg</h2>
            <ul className="mt-3 divide-y divide-border rounded-lg border-2 border-primary/30">
              {kgItems.map((s) => {
                const w = qty[s.id] ?? 0;
                return (
                  <li key={s.id} className="flex flex-wrap items-center justify-between gap-4 p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">{rupees(s.price)}/kg × {w} kg = {rupees(Number(s.price) * w)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`w-${s.id}`} className="text-xs text-muted-foreground">Weight</Label>
                      <Input id={`w-${s.id}`} type="number" inputMode="decimal" min={0} max={100} step={0.5} value={w || ""} placeholder="0" onChange={(e) => setWeight(s.id, e.target.value)} className="h-8 w-20" />
                      <span className="text-sm">kg</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">Estimate the weight. We weigh it at pickup and update the bill before washing.</p>
          </section>
        ) : null}

        <section className="grid gap-4">
          <h2 className="font-semibold">2. Pickup</h2>
          <div className="grid gap-2">
            <Label htmlFor="loc">Pickup location</Label>
            <Input id="loc" value={loc} onChange={(e) => setLocation(e.target.value)} placeholder="Hostel name, room number" maxLength={200} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} min={todayPlus(0)} max={todayPlus(14)} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slot">Time slot</Label>
              <select id="slot" value={slot} onChange={(e) => setSlot(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                {PICKUP_SLOTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="font-semibold">3. Delivery and payment</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Choice checked={speed === "standard"} onClick={() => setSpeed("standard")} title="Standard" body="Back within the service turnaround. Free." />
            <Choice checked={speed === "express"} onClick={() => setSpeed("express")} title="Express" body={`Jumps the queue. ${rupees(EXPRESS_FEE)} extra.`} />
            <Choice checked={payment === "upi_on_delivery"} onClick={() => setPayment("upi_on_delivery")} title="UPI on delivery" body="Scan and pay when your clothes arrive." />
            <Choice checked={payment === "cash"} onClick={() => setPayment("cash")} title="Cash on delivery" body="Pay the delivery staff in cash." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Instructions (optional)</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} placeholder="No bleach, a torn sleeve on the blue shirt, and so on" />
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-semibold">Order summary</h2>
            {lines.length ? (
              <dl className="mt-4 space-y-2 text-sm">
                {lines.map((l) => (
                  <div key={l.id} className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">{l.name} × {l.q}{l.unit === "kg" ? " kg" : ""}</dt>
                    <dd>{rupees(l.total)}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Pickup and delivery</dt><dd>{rupees(0)}</dd></div>
                {fee ? <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Express</dt><dd>{rupees(fee)}</dd></div> : null}
                <div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><dt>Estimated total</dt><dd>{rupees(subtotal + fee)}</dd></div>
              </dl>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Nothing added yet.</p>
            )}
            <Button className="mt-6 w-full" disabled={busy || !lines.length} onClick={submit}>
              {busy ? "Placing order..." : "Confirm pickup"}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">You pay on delivery. Online payment is not available yet.</p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function Choice({ checked, onClick, title, body }: { checked: boolean; onClick: () => void; title: string; body: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={`rounded-lg border p-4 text-left transition-colors ${checked ? "border-primary bg-secondary" : "border-border hover:border-foreground/30"}`}
    >
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </button>
  );
}
