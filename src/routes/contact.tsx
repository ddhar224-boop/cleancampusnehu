import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BRAND } from "@/lib/campusclean";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact us | CampusClean" },
      { name: "description", content: "Questions about an order, bulk hostel laundry or bringing CampusClean to your campus? Send us a message." },
      { property: "og:title", content: "Contact CampusClean" },
      { property: "og:description", content: "Order help, bulk laundry and campus requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  contact: z.string().trim().min(5, "Enter a phone number or email").max(255),
  topic: z.enum(["general", "order", "bulk", "campus", "complaint"]),
  message: z.string().trim().min(5, "Write a short message").max(2000),
});

function Contact() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("contact_messages").insert({ ...parsed.data, user_id: u.user?.id ?? null });
    setBusy(false);
    if (error) {
      toast.error("Could not send. Please email us instead.");
      return;
    }
    setDone(true);
  }

  return (
    <div className="container-page grid gap-4 py-10 lg:grid-cols-3">
      <div className="flex flex-col justify-between rounded-2xl bg-ink p-8 text-ink-foreground">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-accent">Contact</p>
          <h1 className="mt-3 text-4xl font-extrabold">Baat karni hai? Likh do.</h1>
          <p className="mt-3 text-ink-foreground/70">We read every message and reply within one working day.</p>
        </div>
        <ul className="mt-10 grid gap-4 text-sm">
          <li className="flex gap-3"><Mail className="size-5 text-accent" />{BRAND.email}</li>
          <li className="flex gap-3"><MapPin className="size-5 text-accent" />{BRAND.launchCampus}, Meghalaya</li>
          <li className="flex gap-3"><Clock className="size-5 text-accent" />Pickups 8 am to 8 pm, every day</li>
        </ul>
      </div>

      <div className="bento lg:col-span-2 sm:p-8">
        {done ? (
          <div className="py-10">
            <h2 className="text-2xl font-bold">Message received</h2>
            <p className="mt-2 text-muted-foreground">Thanks. We will get back to you on the phone number or email you gave.</p>
            <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>Send another</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2"><Label htmlFor="name">Your name</Label><Input id="name" name="name" autoComplete="name" /></div>
              <div className="grid gap-2"><Label htmlFor="contact">Phone or email</Label><Input id="contact" name="contact" /></div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="topic">Topic</Label>
              <select id="topic" name="topic" className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                <option value="general">General question</option>
                <option value="order">Help with an order</option>
                <option value="bulk">Bulk or hostel laundry</option>
                <option value="campus">Bring CampusClean to my campus</option>
                <option value="complaint">Complaint or damage report</option>
              </select>
            </div>
            <div className="grid gap-2"><Label htmlFor="message">Message</Label><Textarea id="message" name="message" rows={6} maxLength={2000} placeholder="Include your order ID if it is about an order" /></div>
            <Button type="submit" size="lg" disabled={busy} className="justify-self-start">{busy ? "Sending..." : "Send message"}</Button>
          </form>
        )}
      </div>
    </div>
  );
}
