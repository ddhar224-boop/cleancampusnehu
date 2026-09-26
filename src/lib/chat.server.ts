import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { BRAND, FAQS } from "@/lib/campusclean";
import { EXPRESS_FEE, PICKUP_SLOTS, STATUS_LABELS } from "@/lib/catalog";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.server";

const MODEL = "openai/gpt-6-astra";

function db(token?: string) {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        if (token) h.set("Authorization", `Bearer ${token}`);
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const bodySchema = z.object({ messages: z.array(z.any()).min(1).max(60) });

export async function handleChat(request: Request): Promise<Response> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return Response.json({ error: "The assistant is not set up yet." }, { status: 500 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
  const messages = parsed.data.messages as UIMessage[];

  // Optional sign-in: verify the bearer token so order lookups run as that student (RLS applies).
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
  let userId: string | null = null;
  const client = db(token && token.split(".").length === 3 ? token : undefined);
  if (token && token.split(".").length === 3) {
    const { data } = await client.auth.getClaims(token);
    userId = data?.claims?.sub ?? null;
  }

  const { data: services } = await db().from("services").select("name, unit, price, category").eq("active", true).order("sort_order");
  const list = services ?? [];
  const names = new Map(list.map((s) => [s.name.toLowerCase(), s]));

  const system = `You are the CampusClean helper, a friendly assistant for a real student laundry pickup service at ${BRAND.launchCampus} (NEHU Shillong coming soon).
Slogan: "${BRAND.hinglish}". Reply in short, plain English (a little Hinglish is fine if the student uses it). Never use em dashes. Use markdown lists for prices.
Only state facts listed here or returned by tools. If you do not know, say so and give the contact: ${BRAND.email}, phone ${BRAND.phone}.

Price list (clothes per piece, only blankets per kg):
${list.map((s) => `- ${s.name}: Rs ${Number(s.price)} per ${s.unit === "kg" ? "kg" : "piece"}`).join("\n")}
Express delivery adds Rs ${EXPRESS_FEE}. Pickup and standard delivery (48 hours) are free. Payment is cash or UPI on delivery, no online payment yet.
Pickup time slots: ${PICKUP_SLOTS.join(", ")}, every day. Weekly, monthly and semester plans exist; see the Plans page.
FAQ:
${FAQS.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n")}

Tools:
- my_orders: use when the student asks about their orders or order status. ${userId ? "The student is signed in." : "The student is NOT signed in: tell them to log in to check orders, or use Track Order with their order ID."}
- prepare_booking: use when the student wants to book or describes clothes to send. Use exact service names from the price list. The student reviews and confirms on the booking form; you never place orders yourself.`;

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(MODEL),
    system,
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
    stopWhen: stepCountIs(4),
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
    tools: {
      my_orders: tool({
        description: "List the signed-in student's 5 most recent laundry orders with status and bill.",
        inputSchema: z.object({}),
        execute: async () => {
          if (!userId) return { signed_in: false, orders: [] };
          const { data, error } = await client
            .from("orders")
            .select("code, status, total, pickup_date, pickup_slot, delivery_date, delivery_slot, payment_status, order_items(service_name, quantity, unit)")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(5);
          if (error) return { signed_in: true, error: "Could not load orders", orders: [] };
          return {
            signed_in: true,
            orders: (data ?? []).map((o) => ({ ...o, status: STATUS_LABELS[o.status] ?? o.status, total: Number(o.total) })),
          };
        },
      }),
      prepare_booking: tool({
        description: "Prepare a pickup request for the student to review on the booking form.",
        inputSchema: z.object({
          items: z.array(z.object({ service: z.string(), quantity: z.number() })),
          pickup_slot: z.string().nullable(),
          delivery_slot: z.string().nullable(),
          delivery_speed: z.enum(["standard", "express"]),
          notes: z.string(),
        }),
        execute: async (input) => {
          const items = input.items
            .map((i) => {
              const s = names.get(i.service.toLowerCase());
              if (!s || !(i.quantity > 0)) return null;
              const q = s.unit === "kg" ? Math.min(100, Math.round(i.quantity * 10) / 10) : Math.min(100, Math.round(i.quantity));
              return q > 0 ? { service: s.name, quantity: q, unit: s.unit, price: Number(s.price) } : null;
            })
            .filter((x): x is NonNullable<typeof x> => x !== null);
          const slot = (v: string | null) => (v && PICKUP_SLOTS.includes(v) ? v : null);
          const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);
          return {
            items,
            pickup_slot: slot(input.pickup_slot),
            delivery_slot: slot(input.delivery_slot),
            delivery_speed: input.delivery_speed,
            notes: input.notes.replace(/\u2014/g, ",").slice(0, 300),
            estimated_total: subtotal + (input.delivery_speed === "express" ? EXPRESS_FEE : 0),
          };
        },
      }),
    },
  });

  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({
      originalMessages: messages,
      sendReasoning: true,
      onError: (e) => {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("chat error", msg);
        if (/402|credit/i.test(msg)) return "The assistant is paused right now. Please contact us instead.";
        if (/429|rate/i.test(msg)) return "The assistant is busy. Try again in a minute.";
        return "The assistant is unavailable right now.";
      },
    }),
    runIdFetch,
  );
}
