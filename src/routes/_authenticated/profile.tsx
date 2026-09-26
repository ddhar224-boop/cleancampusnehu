import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile | CampusClean" },
      { name: "description", content: "Manage your CampusClean contact and campus details." },
      { property: "og:title", content: "CampusClean profile" },
      { property: "og:description", content: "Manage your contact and campus details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(100),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a 10 digit Indian mobile number"),
  member_type: z.enum(["student", "staff"]),
  institution_id: z.string().trim().min(3, "Enter your Student or Staff ID").max(40),
  campus: z.string().trim().min(2).max(80),
  hostel: z.string().trim().max(80),
  room: z.string().trim().max(20),
});
type Form = z.infer<typeof schema>;

function Profile() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const [form, setForm] = useState<Form | null>(null);
  const [busy, setBusy] = useState(false);

  const q = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (q.data && !form) {
      const d = q.data;
      setForm({
        full_name: d.full_name, mobile: d.mobile, member_type: d.member_type as Form["member_type"],
        institution_id: d.institution_id, campus: d.campus, hostel: d.hostel, room: d.room,
      });
    }
  }, [q.data, form]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Check the form"); return; }
    setBusy(true);
    const { error } = await supabase.from("profiles").upsert({ id: user.id, ...parsed.data });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile saved");
    qc.invalidateQueries({ queryKey: ["profile", user.id] });
  }

  if (!form) return <div className="container-page py-12 text-sm text-muted-foreground">Loading...</div>;
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <form onSubmit={save} className="container-page grid max-w-xl gap-5 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Badge variant="secondary" className="capitalize">ID {q.data?.verification_status}</Badge>
      </div>
      <F label="Full name" value={form.full_name} onChange={set("full_name")} />
      <F label="Mobile number" value={form.mobile} onChange={set("mobile")} inputMode="numeric" />
      <div className="grid gap-2">
        <Label htmlFor="member_type">I am</Label>
        <select id="member_type" value={form.member_type} onChange={set("member_type")} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="student">A student</option>
          <option value="staff">Staff or faculty</option>
        </select>
      </div>
      <F label="Student or Staff ID" value={form.institution_id} onChange={set("institution_id")} />
      <F label="Campus" value={form.campus} onChange={set("campus")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <F label="Hostel or residence" value={form.hostel} onChange={set("hostel")} />
        <F label="Room" value={form.room} onChange={set("room")} />
      </div>
      <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Save profile"}</Button>
    </form>
  );
}

function F({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = label.toLowerCase().replace(/\W+/g, "-");
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...rest} />
    </div>
  );
}
