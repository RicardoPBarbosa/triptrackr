import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { ArrowDown2 } from "iconsax-react";

import type { Country } from "@/@types";
import { SHOW_ALL_ID } from "@/constants";

type Props = {
  continents: {
    title: string;
    data: Country[];
  }[];
  onShowAll: (continentName: string) => void;
  countryId: string | null;
  setCountryId?: (countryId: string) => void;
};

export default function CountriesSectionList({
  continents,
  onShowAll,
  countryId,
  setCountryId,
}: Props) {
  function Item({
    country,
    children,
  }: {
    country: Country;
    children: ReactNode;
  }) {
    if (setCountryId) {
      return (
        <button onClick={() => setCountryId(country.id)}>{children}</button>
      );
    }

    return (
      <Link
        href={{
          query: { country: country.id },
        }}
        scroll={false}
      >
        {children}
      </Link>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {continents.map(({ title: continentName, data: countries }) => (
        <div key={continentName}>
          <div className="mb-2 flex h-10 items-center rounded-lg bg-primary px-4">
            <h3 className="font-body text-sm font-bold uppercase leading-none tracking-wider text-background">
              {continentName}
            </h3>
          </div>
          <ul className="flex flex-col gap-2">
            {countries.map((country) =>
              country.id === SHOW_ALL_ID ? (
                <li key={country.id}>
                  <button
                    type="button"
                    className="flex h-14 w-full items-center gap-4 rounded-lg border border-background bg-background-paper px-4 text-left transition-colors hover:bg-background-paper/70"
                    onClick={() => onShowAll(continentName)}
                  >
                    <span className="flex w-10 justify-center">
                      <ArrowDown2 className="text-primary" size={26} />
                    </span>
                    <span className="text-sm font-semibold tracking-wider">
                      {country.name}
                    </span>
                  </button>
                </li>
              ) : (
                <Item key={country.id} country={country}>
                  <li
                    className={twMerge(
                      "flex h-14 items-center gap-3 rounded-lg border border-background px-4 text-left transition-colors hover:bg-background-paper",
                      countryId === country.id &&
                        "bg-primary/5 ring-2 ring-inset ring-primary hover:bg-primary/5",
                    )}
                  >
                    <Image
                      src={`/assets/countries/${
                        country.flagPath || "DEFAULT.png"
                      }`}
                      alt={country.name}
                      width={40}
                      height={26}
                      className="rounded-md"
                    />
                    <span className="font-display">{country.name}</span>
                  </li>
                </Item>
              ),
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
