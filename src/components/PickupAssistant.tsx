import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createAiPickupPlan } from "@/lib/pickup-ai.functions";

export type AppliedPlan = Awaited<ReturnType<typeof createAiPickupPlan>>;

/** Student describes laundry in their own words; AI fills in the booking form for them to review. */
export function PickupAssistant({ onApply }: { onApply: (p: AppliedPlan) => void }) {
  const run = useServerFn(createAiPickupPlan);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  async function go() {
    if (text.trim().length < 5) { setError("Tell us a little more about your laundry."); return; }
    setBusy(true); setError(null); setSummary(null);
    try {
      const plan = await run({ data: { description: text } });
      onApply(plan);
      setSummary(plan.items.length ? plan.summary || "Form filled in. Check it below." : "We could not match any items. Please add them below.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "The assistant is unavailable right now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border-2 border-primary/30 bg-secondary p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary" aria-hidden />
        <h2 className="font-semibold">Describe it, we fill the form</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Write what you have and when you are free. The AI assistant picks the items and times; you check everything before confirming.
      </p>
      <Label htmlFor="ai-desc" className="sr-only">Describe your laundry</Label>
      <Textarea
        id="ai-desc"
        className="mt-3 bg-background"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={1000}
        placeholder="For example: 5 t-shirts, 2 jeans and my blanket, about 3 kg. Pick up in the evening, need them back by Friday night. Coffee stain on one white shirt."
      />
      <Button className="mt-3" onClick={go} disabled={busy}>{busy ? "Working on it..." : "Create my pickup request"}</Button>
      {summary ? <p className="mt-3 text-sm" role="status">{summary}</p> : null}
      {error ? <p className="mt-3 text-sm text-destructive" role="alert">{error}</p> : null}
    </section>
  );
}
