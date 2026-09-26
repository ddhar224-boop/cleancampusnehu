import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { rupees, useRoles } from "@/lib/auth";
import { STATUS_LABELS } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My account | CampusClean" },
      { name: "description", content: "Your CampusClean orders, plan and profile." },
      { property: "og:title", content: "My CampusClean account" },
      { property: "og:description", content: "Your orders, plan and profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();
  const roles = useRoles(user.id);
  const isStaff = roles.data?.some((r) => r === "admin" || r === "staff");

  const profile = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const orders = useQuery({
    queryKey: ["my-orders", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, code, status, total, pickup_date, pickup_slot")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });
  const sub = useQuery({
    queryKey: ["my-sub", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("id, status, payment_status, starts_on, ends_on, price, plans(name)")
        .eq("user_id", user.id)
        .in("status", ["pending", "active"])
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const p = profile.data;
  const incomplete = p && (!p.mobile || !p.institution_id);

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Hello{p?.full_name ? `, ${p.full_name.split(" ")[0]}` : ""}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2">
          {isStaff ? (
            <Button asChild variant="outline"><Link to="/admin">Operations</Link></Button>
          ) : null}
          <Button asChild><Link to="/book">Book a pickup</Link></Button>
        </div>
      </div>

      {incomplete ? (
        <Alert className="mt-6">
          <AlertDescription>
            Add your mobile number and Student or Staff ID so we can verify you before your first pickup.{" "}
            <Link to="/profile" className="font-medium underline">Complete profile</Link>
          </AlertDescription>
        </Alert>
      ) : p?.verification_status === "pending" ? (
        <Alert className="mt-6">
          <AlertDescription>Your ID is waiting for verification by our team. You can still place orders.</AlertDescription>
        </Alert>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Recent orders</h2>
              <Link to="/orders" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            {orders.isLoading ? (
              <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
            ) : orders.data?.length ? (
              <ul className="mt-4 divide-y divide-border">
                {orders.data.map((o) => (
                  <li key={o.id}>
                    <Link to="/orders/$id" params={{ id: o.id }} className="flex items-center justify-between gap-4 py-3 hover:text-primary">
                      <div>
                        <p className="font-medium">{o.code}</p>
                        <p className="text-xs text-muted-foreground">Pickup {o.pickup_date}, {o.pickup_slot}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{STATUS_LABELS[o.status]}</Badge>
                        <p className="mt-1 text-sm">{rupees(o.total)}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No orders yet. Book your first pickup to get started.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-semibold">Laundry plan</h2>
              {sub.data ? (
                <div className="mt-3 text-sm">
                  <p className="font-medium">{sub.data.plans?.name}</p>
                  <p className="mt-1 text-muted-foreground">
                    {sub.data.status === "pending"
                      ? `Requested. Pay ${rupees(sub.data.price)} at your next pickup to activate.`
                      : `Active until ${sub.data.ends_on}`}
                  </p>
                </div>
              ) : (
                <>
                  <p className="mt-3 text-sm text-muted-foreground">Save on regular laundry with a weekly, monthly or semester plan.</p>
                  <Button asChild variant="outline" size="sm" className="mt-4"><Link to="/plans">See plans</Link></Button>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-semibold">Profile</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {p ? `${p.member_type === "staff" ? "Staff" : "Student"} at ${p.campus}${p.hostel ? `, ${p.hostel}` : ""}` : "..."}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4"><Link to="/profile">Edit profile</Link></Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
