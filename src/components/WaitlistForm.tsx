import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCampus } from "@/lib/campus";
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
});

export function WaitlistForm({ service, serviceLabel }: { service: string; serviceLabel: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const { campus } = useCampus();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("waitlist_interests").insert({
      service,
      ...parsed.data,
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
              <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Notify me"}</Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
