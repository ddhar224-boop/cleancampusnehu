import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PICKUP_SLOTS } from "@/lib/catalog";

export const createAiPickupPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ description: z.string().trim().min(5).max(1000) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: services, error } = await context.supabase
      .from("services")
      .select("name, unit, price")
      .eq("active", true);
    if (error) throw new Error("Could not load the price list");
    const { planPickup } = await import("./pickup-ai.server");
    try {
      return await planPickup({
        description: data.description,
        services: (services ?? []).map((s) => ({ name: s.name, unit: s.unit, price: Number(s.price) })),
        slots: PICKUP_SLOTS,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (/402|credit/i.test(msg)) throw new Error("The assistant is paused right now. Please fill the form yourself.");
      if (/429|rate/i.test(msg)) throw new Error("The assistant is busy. Try again in a minute.");
      throw new Error(msg.startsWith("The assistant") ? msg : "The assistant is unavailable right now. Please fill the form yourself.");
    }
  });
