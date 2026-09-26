import { useEffect, useState } from "react";

export type Campus = {
  id: string;
  university: string;
  name: string;
  live: boolean;
};

export const CAMPUSES: Campus[] = [
  { id: "nehu-tura", university: "North-Eastern Hill University", name: "NEHU Tura Campus", live: true },
  { id: "nehu-shillong", university: "North-Eastern Hill University", name: "NEHU Shillong Campus", live: false },
];

const STORAGE_KEY = "campusclean-campus";
const DEFAULT_CAMPUS = CAMPUSES[0]!;

export function getCampus(id: string | null | undefined): Campus {
  return CAMPUSES.find((c) => c.id === id) ?? DEFAULT_CAMPUS;
}

/** Remembers the student's chosen campus in localStorage. Defaults to NEHU Tura. */
export function useCampus() {
  const [campusId, setCampusId] = useState<string>(DEFAULT_CAMPUS.id);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setCampusId(stored);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) setCampusId(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function select(id: string) {
    setCampusId(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }

  return { campus: getCampus(campusId), select };
}
