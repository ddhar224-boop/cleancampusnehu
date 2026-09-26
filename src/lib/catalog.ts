import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("services")
      .select("id, slug, name, description, category, unit, price, turnaround")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const plansQuery = queryOptions({
  queryKey: ["plans"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("plans")
      .select("id, slug, name, description, price, period_days, kg_allowance, pickups_included, features")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const CATEGORY_LABELS: Record<string, string> = {
  clothes: "Clothes, price per piece",
  home: "Household and linen, price per piece",
  weight: "Blanket, price per kg",
  laundry: "Wash and fold",
  ironing: "Ironing",
  dry_clean: "Dry cleaning",
  specialty: "Special care",
};

export const unitLabel = (u: string) => (u === "kg" ? "per kg" : u === "fixed" ? "flat" : "per piece");

/** "2 pcs" / "1 pc" / "2.5 kg" */
export const qtyLabel = (q: number | string, unit: string) => {
  const n = Number(q);
  if (unit === "kg") return `${n} kg`;
  return `${n} ${n === 1 ? "pc" : "pcs"}`;
};

/** "Shirt: 2 pcs × ₹25 = ₹50" style line, shared by booking, order detail and admin. */
export const lineText = (qty: number | string, unit: string, price: number | string, fmt: (n: number | string) => string) =>
  `${qtyLabel(qty, unit)} × ${fmt(price)}${unit === "kg" ? "/kg" : ""}`;

export const STATUS_LABELS: Record<string, string> = {
  placed: "Order placed",
  pickup_scheduled: "Pickup scheduled",
  picked_up: "Picked up",
  received: "Received at facility",
  washing: "Washing",
  drying: "Drying",
  ironing: "Ironing",
  quality_check: "Quality check",
  packed: "Packed",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_FLOW = [
  "placed",
  "pickup_scheduled",
  "picked_up",
  "received",
  "washing",
  "drying",
  "ironing",
  "quality_check",
  "packed",
  "out_for_delivery",
  "delivered",
] as const;

export const PICKUP_SLOTS = ["08:00-10:00", "12:00-14:00", "16:00-18:00", "18:00-20:00"];
export const EXPRESS_FEE = 40;
