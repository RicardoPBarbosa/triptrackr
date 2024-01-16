import { useMemo, useState } from "react";

import { countriesByContinent } from "@/utils/countries";

export default function useCountrySelect() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({});
  const continents = useMemo(
    () => countriesByContinent(showAll, searchQuery),
    [searchQuery, showAll],
  );

  function onShowAll(continent: string) {
    setShowAll((prev) => ({ ...prev, [continent]: true }));
  }

  return {
    continents,
    onShowAll,
    searchQuery,
    setSearchQuery,
  };
}
