import { useEffect, useState } from "react";

import type { Trip } from "@/@types";
import { getCountries } from "@/utils/countries";
import { createClient } from "@/utils/supabase/client";
import { useDebounce } from "./useDebounce";

const countries = getCountries();

export default function useSearch() {
  const supabase = createClient();
  const [data, setData] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    async function getResults(query: string) {
      setLoading(true);
      const matchCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(query.toLowerCase()),
      );
      const { data: results } = await supabase
        .from("trips")
        .select("*")
        .or(
          `title.ilike.%${query}%, country_id.in.(${
            matchCountries.length
              ? matchCountries.map((mc) => mc.id).join(",")
              : ""
          })`,
        )
        .limit(10);

      setData(results || []);
      setLoading(false);
    }
    if (!debouncedQuery.length) return setData([]);
    getResults(debouncedQuery);
  }, [debouncedQuery, supabase]);

  return { data, searchQuery, setSearchQuery, loading };
}
