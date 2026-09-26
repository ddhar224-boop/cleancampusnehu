import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCampus } from "@/lib/campus";
import { PICKUP_SLOTS } from "@/lib/catalog";
import { HostelSelect, OTHER } from "@/components/HostelSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  contact: z.string().trim().min(5, "Enter a phone number or email").max(255),
  hostel: z.string().trim().min(2, "Select or type your hostel").max(120),
  pickup_time: z.string().refine((v) => PICKUP_SLOTS.includes(v), "Choose a pickup time"),
  delivery_date: z.string().trim().refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Enter a valid date"),
});

export function WaitlistForm({ service, serviceLabel }: { service: string; serviceLabel: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [hostelChoice, setHostelChoice] = useState("");
  const [hostelCustom, setHostelCustom] = useState("");
  const { campus } = useCampus();
  const hostel = hostelChoice && hostelChoice !== OTHER ? hostelChoice : hostelCustom.trim();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse({
      name: raw["name"] ?? "",
      contact: raw["contact"] ?? "",
      hostel,
      pickup_time: raw["pickup_time"] ?? "",
      delivery_date: raw["delivery_date"] ?? "",
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("waitlist_interests").insert({
      service,
      ...parsed.data,
      delivery_date: parsed.data.delivery_date || null,
      university: campus.university,
      campus: campus.name,
      user_id: u.user?.id ?? null,
    });
    setBusy(false);
    if (error) {
      toast.error("Could not save. Please try again.");
      return;
    }
    setDone(true);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-4 w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          Notify me
        </Button>
      </DialogTrigger>
      <DialogContent>
        {done ? (
          <div className="py-4">
            <DialogHeader>
              <DialogTitle>You are on the list</DialogTitle>
              <DialogDescription>
                We will message you on the phone number or email you gave when {serviceLabel} launches.
              </DialogDescription>
            </DialogHeader>
            <Button className="mt-6" onClick={() => setOpen(false)}>Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Get notified: {serviceLabel}</DialogTitle>
              <DialogDescription>
                Leave your details and we will tell you the moment {serviceLabel} goes live. No spam, one message. Campus: {campus.name}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="mt-2 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={`wl-name-${service}`}>Your name</Label>
                <Input id={`wl-name-${service}`} name="name" autoComplete="name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`wl-contact-${service}`}>Phone or email</Label>
                <Input id={`wl-contact-${service}`} name="contact" />
              </div>
              <HostelSelect
                campusId={campus.id}
                choice={hostelChoice}
                custom={hostelCustom}
                onChoice={(v) => setHostelChoice(v)}
                onCustom={(v) => setHostelCustom(v)}
              />
              <div className="grid gap-2">
                <Label htmlFor={`wl-pickup-${service}`}>Preferred pickup time</Label>
                <select
                  id={`wl-pickup-${service}`}
                  name="pickup_time"
                  defaultValue={PICKUP_SLOTS[0]}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {PICKUP_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`wl-date-${service}`}>Preferred delivery date (optional)</Label>
                <Input id={`wl-date-${service}`} name="delivery_date" type="date" />
              </div>
              <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Notify me"}</Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
