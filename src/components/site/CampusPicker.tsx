import { useState } from "react";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CAMPUSES, useCampus } from "@/lib/campus";

export function CampusPicker() {
  const { campus, select } = useCampus();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/70"
        >
          <MapPin className="size-3.5 text-primary" />
          <span className="max-w-32 truncate sm:max-w-none">{campus.name}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-2">
        <p className="px-2 pb-2 pt-1 text-xs font-semibold text-muted-foreground">Choose your campus</p>
        <div className="flex flex-col gap-1">
          {CAMPUSES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                select(c.id);
                setOpen(false);
              }}
              className="flex items-start justify-between gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-secondary"
            >
              <span>
                <span className="block text-sm font-semibold text-foreground">{c.name}</span>
                <span className="block text-xs text-muted-foreground">{c.university}</span>
                {!c.live ? (
                  <span className="mt-1 inline-block rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                    Coming soon
                  </span>
                ) : null}
              </span>
              {c.id === campus.id ? <Check className="mt-1 size-4 shrink-0 text-primary" /> : null}
            </button>
          ))}
        </div>
        <p className="border-t border-border px-2 pb-1 pt-2 text-xs text-muted-foreground">
          Studying somewhere else? <span className="font-semibold text-foreground">Tell us your campus</span> on the Contact page and we will note the demand.
        </p>
      </PopoverContent>
    </Popover>
  );
}
