import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { plansQuery } from "@/lib/catalog";
import { rupees, useSession } from "@/lib/auth";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title: "Laundry plans: weekly, monthly, semester | CampusClean" },
      { name: "description", content: "Prepaid CampusClean laundry plans with a fixed kg allowance and included pickups. Pay at your first pickup." },
      { property: "og:title", content: "CampusClean laundry plans" },
      { property: "og:description", content: "Weekly, monthly and semester plans with included pickups." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Plans,
});

function Plans() {
  const plans = useQuery(plansQuery);
  const { user } = useSession();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const mine = useQuery({
    queryKey: ["my-sub", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("subscriptions").select("id, status, plan_id").eq("user_id", user!.id).in("status", ["pending", "active"]).maybeSingle();
      return data;
    },
  });

  async function subscribe(planId: string) {
    if (!user) { navigate({ to: "/auth" }); return; }
    const { error } = await supabase.from("subscriptions").insert({ user_id: user.id, plan_id: planId, price: 0 });
    if (error) { toast.error(error.message); return; }
    toast.success("Plan requested. Pay at your next pickup and we will activate it.");
    qc.invalidateQueries({ queryKey: ["my-sub"] });
  }
  async function cancel(id: string) {
    const { error } = await supabase.rpc("cancel_my_subscription", { _id: id });
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["my-sub"] });
  }

  return (
    <div className="container-page py-16">
      <h1 className="text-4xl font-bold">Laundry plans</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Pay once, then book pickups without paying each time. Your plan starts the day we receive payment, in cash or UPI, at your first pickup.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.data?.map((p) => {
          const isMine = mine.data?.plan_id === p.id;
          return (
            <Card key={p.id} className={isMine ? "border-primary" : ""}>
              <CardContent className="flex h-full flex-col pt-6">
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                <p className="mt-5 font-display text-3xl font-bold">{rupees(p.price)}</p>
                <p className="text-xs text-muted-foreground">for {p.period_days} days · {rupees(Math.round(Number(p.price) / Number(p.kg_allowance)))} per kg</p>
                <ul className="mt-5 grid gap-2 text-sm">
                  {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{f}</li>)}
                </ul>
                <div className="mt-auto pt-6">
                  {isMine ? (
                    mine.data?.status === "pending" ? (
                      <Button variant="outline" className="w-full" onClick={() => cancel(mine.data!.id)}>Requested. Cancel request</Button>
                    ) : <Button disabled className="w-full">Your active plan</Button>
                  ) : (
                    <Button className="w-full" disabled={!!mine.data} onClick={() => subscribe(p.id)}>
                      {user ? "Choose plan" : "Log in to choose"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {plans.isLoading ? <p className="text-sm text-muted-foreground">Loading plans...</p> : null}
      <p className="mt-8 text-sm text-muted-foreground">
        Prefer to pay per order? See <Link to="/services" className="text-primary underline">all services and prices</Link>.
      </p>
    </div>
  );
}
