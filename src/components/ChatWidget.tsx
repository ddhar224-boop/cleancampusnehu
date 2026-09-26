import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useNavigate } from "@tanstack/react-router";
import { MessageCircle, Shirt, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputBody, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/tool";
import { rupees } from "@/lib/auth";

export const CHAT_PLAN_KEY = "campusclean-chat-plan";

type BookingPlan = {
  items: { service: string; quantity: number; unit: string; price: number }[];
  pickup_slot: string | null;
  delivery_slot: string | null;
  delivery_speed: "standard" | "express";
  notes: string;
  estimated_total: number;
};

const SUGGESTIONS = ["What does a shirt cost?", "Where is my order?", "Book 3 t-shirts and 1 jeans for tomorrow morning"];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && <ChatPanel onClose={() => setOpen(false)} />}
      {!open && (
        <Button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-50 h-12 rounded-full px-5 shadow-lg" aria-label="Open CampusClean chat">
          <MessageCircle className="mr-2 h-5 w-5" /> Ask CampusClean
        </Button>
      )}
    </>
  );
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        headers: async (): Promise<Record<string, string>> => {
          const { data } = await supabase.auth.getSession();
          const t = data.session?.access_token;
          return t ? { Authorization: `Bearer ${t}` } : {};
        },
      }),
    [],
  );
  const { messages, sendMessage, status, stop } = useChat({
    transport,
    onError: (e) => toast.error(e.message || "Could not reach the assistant. Check your connection."),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => { if (!busy) inputRef.current?.focus(); }, [busy]);

  function send(t: string) {
    const v = t.trim();
    if (!v || busy) return;
    sendMessage({ text: v });
    setText("");
  }

  function openBooking(plan: BookingPlan) {
    sessionStorage.setItem(CHAT_PLAN_KEY, JSON.stringify(plan));
    onClose();
    navigate({ to: "/book" });
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 flex h-[min(620px,100dvh)] w-full flex-col border border-border bg-background shadow-2xl sm:bottom-5 sm:right-5 sm:w-[400px] sm:rounded-2xl">
      <div className="flex items-center gap-3 border-b border-border bg-ink px-4 py-3 text-ink-foreground sm:rounded-t-2xl">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Shirt className="h-5 w-5" /></span>
        <div className="flex-1">
          <p className="font-display text-sm font-semibold">CampusClean helper</p>
          <p className="text-xs opacity-70">Prices, orders and bookings. Chat is not saved.</p>
        </div>
        <button onClick={onClose} aria-label="Close chat" className="rounded p-1 hover:bg-white/10"><X className="h-5 w-5" /></button>
      </div>

      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState title="Kya help chahiye?" description="Ask about prices, check your orders, or tell me what to pick up.">
              <div className="mt-4 grid gap-2">
                <p className="font-display font-semibold">Kya help chahiye?</p>
                <p className="text-sm text-muted-foreground">Ask about prices, check your orders, or tell me what to pick up.</p>
                {SUGGESTIONS.map((s) => (
                  <Button key={s} variant="outline" size="sm" className="h-auto whitespace-normal text-left" onClick={() => send(s)}>{s}</Button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((m) => <ChatMessage key={m.id} m={m} onBook={openBooking} />)
          )}
          {status === "submitted" && <p className="animate-pulse text-sm text-muted-foreground">Thinking...</p>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border p-3">
        <PromptInput onSubmit={(msg) => send(msg.text ?? "")}>
          <PromptInputBody>
            <PromptInputTextarea ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your question..." maxLength={1000} />
          </PromptInputBody>
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={stop} disabled={!busy && !text.trim()} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

function ChatMessage({ m, onBook }: { m: UIMessage; onBook: (p: BookingPlan) => void }) {
  return (
    <Message from={m.role}>
      <MessageContent className={m.role === "user" ? "bg-primary text-primary-foreground" : ""}>
        {m.parts.map((p, i) => {
          if (p.type === "text") return m.role === "user" ? <p key={i}>{p.text}</p> : <MessageResponse key={i}>{p.text}</MessageResponse>;
          if (p.type === "tool-prepare_booking" && p.state === "output-available") {
            const plan = p.output as BookingPlan;
            return (
              <div key={i} className="my-2 rounded-xl border border-border bg-card p-3 text-sm">
                <p className="font-semibold">Pickup request ready</p>
                {plan.items.length ? (
                  <ul className="my-2 space-y-1">
                    {plan.items.map((it) => (
                      <li key={it.service} className="flex justify-between gap-2">
                        <span>{it.service} {it.quantity} {it.unit === "kg" ? "kg" : "pcs"}</span><span>{rupees(it.price * it.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="my-2 text-muted-foreground">No items matched the price list yet.</p>}
                <p className="text-xs text-muted-foreground">Estimated {rupees(plan.estimated_total)}{plan.pickup_slot ? `, pickup ${plan.pickup_slot}` : ""}{plan.delivery_speed === "express" ? ", express" : ""}. You check everything before confirming.</p>
                <Button size="sm" className="mt-2 w-full" onClick={() => onBook(plan)} disabled={!plan.items.length}>Open booking form</Button>
              </div>
            );
          }
          if (p.type.startsWith("tool-") && "state" in p) {
            const tp = p as Extract<UIMessage["parts"][number], { type: `tool-${string}` }>;
            return (
              <Tool key={i} defaultOpen={false}>
                <ToolHeader type={tp.type} state={tp.state} title={tp.type === "tool-my_orders" ? "Checked your orders" : "Preparing booking"} />
                <ToolContent>
                  <ToolInput input={tp.input} />
                  <ToolOutput output={"output" in tp ? tp.output : undefined} errorText={"errorText" in tp ? tp.errorText : undefined} />
                </ToolContent>
              </Tool>
            );
          }
          return null;
        })}
      </MessageContent>
    </Message>
  );
}
