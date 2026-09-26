import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { STATUS_FLOW, STATUS_LABELS } from "@/lib/catalog";

export const Route = createFileRoute("/track")({
  validateSearch: (s: Record<string, unknown>): { code?: string } => (typeof s.code === "string" && s.code ? { code: s.code.slice(0, 20) } : {}),
  head: () => ({
    meta: [
      { title: "Track an order | CampusClean" },
      { name: "description", content: "Enter your CampusClean order ID to see where your laundry is right now." },
      { property: "og:title", content: "Track a CampusClean order" },
      { property: "og:description", content: "See where your laundry is with your order ID." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Track,
});

type Result = { code: string; status: string; pickup_date: string; updated_at: string };

function Track() {
  const search = Route.useSearch();
  const [code, setCode] = useState(search.code ?? "");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null | "none">(null);

  useEffect(() => {
    if (search.code) void lookup(search.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.code]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await lookup(code);
  }

  async function lookup(raw: string) {
    const c = raw.trim().toUpperCase();
    if (!/^CC-\d{4}-\d{6}$/.test(c)) return setResult("none");
    setBusy(true);
    const { data } = await supabase.rpc("track_order", { _code: c });
    setBusy(false);
    setResult(data?.[0] ?? "none");
  }

  const idx = result && result !== "none" ? STATUS_FLOW.indexOf(result.status as (typeof STATUS_FLOW)[number]) : -1;

  return (
    <div className="container-page max-w-xl py-16">
      <h1 className="text-4xl font-bold">Track an order</h1>
      <p className="mt-3 text-muted-foreground">Your order ID is on your confirmation and your bag tag, for example CC-2026-000001.</p>
      <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="code">Order ID</Label>
          <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="CC-2026-000001" />
        </div>
        <Button type="submit" disabled={busy}>{busy ? "Checking..." : "Track"}</Button>
      </form>

      {result === "none" ? (
        <p className="mt-6 text-sm text-destructive">We could not find that order ID. Check it and try again.</p>
      ) : result ? (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{result.code}</p>
            <p className="mt-1 text-2xl font-semibold">{STATUS_LABELS[result.status]}</p>
            <p className="mt-1 text-xs text-muted-foreground">Updated {new Date(result.updated_at).toLocaleString("en-IN")}</p>
            {idx >= 0 ? (
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-primary" style={{ width: `${((idx + 1) / STATUS_FLOW.length) * 100}%` }} />
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
