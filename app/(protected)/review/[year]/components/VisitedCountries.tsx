import Image from "next/image";

import type { Country } from "@/@types";
import { getCountries } from "@/utils/countries";

const countries = getCountries();

function CountryRow({ country }: { country: Country & { visits: number } }) {
  return (
    <div className="flex items-center gap-4">
      <Image
        src={`/assets/countries/${country?.flagPath || "DEFAULT.png"}`}
        alt={country?.name || ""}
        width={35}
        height={23}
        loading="lazy"
        className="rounded-md"
      />
      <div className="flex flex-1 items-center justify-between">
        <h2 className="font-medium">{country.name}</h2>
        <span className="text-lg">{country.visits}</span>
      </div>
    </div>
  );
}

export default function VisitedCountries({
  countriesIds,
}: {
  countriesIds: string[];
}) {
  const countriesVisited = countries.filter((c) => countriesIds.includes(c.id));
  const visitedCountriesWithNumber = countriesVisited.map((c) => ({
    ...c,
    visits: countriesIds.filter((id) => id === c.id).length,
  }));

  return (
    <>
      <div className="flex items-center justify-between pb-3">
        <h2 className="pt-0.5 text-primary">Visited countries</h2>
        <span className="font-display text-sm text-gray-300">Nº visits</span>
      </div>
      <div className="relative">
        <div className="no-scrollbar relative flex max-h-60 flex-col gap-2.5 overflow-y-auto pb-1">
          {visitedCountriesWithNumber
            .sort((a, b) => b.visits - a.visits)
            .map((country) => (
              <CountryRow key={country.id} country={country} />
            ))}
        </div>
        <div className="absolute -bottom-2 h-5 w-full bg-gradient-to-t from-background from-5% to-transparent" />
      </div>
    </>
  );
}
