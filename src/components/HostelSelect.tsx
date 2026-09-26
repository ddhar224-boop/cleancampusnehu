import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hostelsQuery } from "@/lib/hostels";

export const OTHER = "__other__";

/** Hostel dropdown for a campus, with an "Other" option that lets the student type a name. */
export function HostelSelect({
  campusId,
  choice,
  custom,
  onChoice,
  onCustom,
}: {
  campusId: string;
  choice: string;
  custom: string;
  onChoice: (v: string) => void;
  onCustom: (v: string) => void;
}) {
  const hostels = useQuery(hostelsQuery(campusId));
  const list = hostels.data ?? [];
  const known = list.some((h) => h.name === choice);
  const value = choice === "" ? "" : known ? choice : OTHER;

  return (
    <div className="grid gap-2">
      <Label htmlFor="hostel">Hostel</Label>
      <select
        id="hostel"
        value={value}
        onChange={(e) => onChoice(e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="" disabled>{hostels.isLoading ? "Loading hostels..." : "Select your hostel"}</option>
        {list.map((h) => <option key={h.id} value={h.name}>{h.name}</option>)}
        <option value={OTHER}>My hostel is not listed (type it)</option>
      </select>
      {value === OTHER ? (
        <Input
          aria-label="Hostel name"
          value={custom}
          onChange={(e) => onCustom(e.target.value)}
          placeholder="Type your hostel or residence name"
          maxLength={80}
        />
      ) : null}
    </div>
  );
}
