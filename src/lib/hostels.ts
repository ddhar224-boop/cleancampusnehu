import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const hostelsQuery = (campusId: string) =>
  queryOptions({
    queryKey: ["hostels", campusId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hostels")
        .select("id, name, campus_id, active")
        .eq("campus_id", campusId)
        .eq("active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });
