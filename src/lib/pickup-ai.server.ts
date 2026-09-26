import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const MODEL = "openai/gpt-6-astra";
const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

function runIdFetch() {
  let runId: string | undefined;
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (runId && !headers.has(RUN_ID_HEADER)) headers.set(RUN_ID_HEADER, runId);
    const res = await fetch(input, { ...init, headers });
    runId ??= res.headers.get(RUN_ID_HEADER)?.trim() || undefined;
    return res;
  };
}

export type AiPlan = {
  items: { service: string; quantity: number }[];
  pickup_slot: string | null;
  delivery_slot: string | null;
  delivery_speed: "standard" | "express";
  notes: string;
  summary: string;
};

export async function planPickup(input: {
  description: string;
  services: { name: string; unit: string; price: number }[];
  slots: string[];
}): Promise<AiPlan> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI is not configured");
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch(),
  });

  const system = `You turn a student's plain description of their laundry into a pickup request for CampusClean.
Use ONLY these services (exact names). "piece" = whole numbers, "kg" = weight:
${input.services.map((s) => `- ${s.name} (${s.unit}, Rs ${s.price})`).join("\n")}
Allowed time slots: ${input.slots.join(", ")}.
Map rough times: morning 08:00-10:00, noon/afternoon 12:00-14:00, evening 16:00-18:00, night 18:00-20:00.
If they mention urgent/today/tomorrow morning need, set delivery_speed "express", else "standard".
Only include items they mention; if they give no count, use your best reasonable guess and say so in summary.
notes: care instructions they mentioned (stains, no bleach, delicate), max 300 chars, else "".
summary: 1-2 short plain English sentences explaining what you picked. No em dashes.
Reply with ONLY JSON: {"items":[{"service":string,"quantity":number}],"pickup_slot":string|null,"delivery_slot":string|null,"delivery_speed":"standard"|"express","notes":string,"summary":string}`;

  const result = streamText({
    model: provider.responses(MODEL),
    system,
    prompt: input.description,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  const text = await result.text;
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  let raw: Partial<AiPlan>;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new Error("The assistant could not read that. Try describing your clothes again.");
  }
  const names = new Map(input.services.map((s) => [s.name.toLowerCase(), s]));
  const items = (raw.items ?? [])
    .map((i) => {
      const s = names.get(String(i.service).toLowerCase());
      if (!s) return null;
      let q = Number(i.quantity);
      if (!Number.isFinite(q) || q <= 0) return null;
      q = s.unit === "kg" ? Math.min(100, Math.round(q * 10) / 10) : Math.min(100, Math.round(q));
      return q > 0 ? { service: s.name, quantity: q } : null;
    })
    .filter((x): x is { service: string; quantity: number } => x !== null);
  const slot = (v: unknown) => (typeof v === "string" && input.slots.includes(v) ? v : null);
  return {
    items,
    pickup_slot: slot(raw.pickup_slot),
    delivery_slot: slot(raw.delivery_slot),
    delivery_speed: raw.delivery_speed === "express" ? "express" : "standard",
    notes: String(raw.notes ?? "").slice(0, 300),
    summary: String(raw.summary ?? "").replace(/\u2014/g, ",").slice(0, 400),
  };
}
