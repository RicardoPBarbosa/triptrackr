"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ArrowRight, SearchNormal1 } from "iconsax-react";

import type { Trip } from "@/@types";
import Input from "@/components/Input";
import useSearch from "@/hooks/useSearch";
import { getCountries } from "@/utils/countries";
import { formatDateRange } from "@/utils/helpers";

const countries = getCountries();

function TripResult({ trip }: { trip: Trip }) {
  const country = countries.find((c) => c.id === trip.country_id);

  return (
    <Link
      href={`/trip/${trip.id}`}
      className="flex h-20 items-center justify-between gap-4 rounded-lg bg-background-paper p-3 transition-colors hover:bg-background-light"
    >
      <Image
        src={`/assets/countries/${country?.flagPath || "DEFAULT.png"}`}
        alt={country?.name || ""}
        width={35}
        height={23}
        loading="lazy"
        className="rounded-md"
      />
      <div className="flex-1">
        <span className="text-sm font-normal text-gray-400">
          {formatDateRange(trip.start_date, trip.end_date)}
        </span>
        <h2 className="text-lg font-bold">{trip.title}</h2>
      </div>
      <ArrowRight size={26} className="text-gray-400" />
    </Link>
  );
}

export default function Search() {
  const [focused, setFocused] = useState(false);
  const { data, searchQuery, setSearchQuery, loading } = useSearch();

  return (
    <div className="top-padding flex flex-col gap-3 px-3 pb-32">
      <div className="flex items-center pr-4">
        <Input
          type="search"
          startIcon={<SearchNormal1 size={20} />}
          className="ring-none h-14 border-none bg-transparent focus:ring-0"
          placeholder="Search by trip name or country"
          autoFocus
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Link
          href="/"
          className="font-medium tracking-wider transition-colors hover:text-gray-400"
        >
          cancel
        </Link>
      </div>
      <hr
        className={twMerge(
          "mb-2 border-[1.5px] border-paper transition-colors",
          focused && "border-primary",
        )}
      />
      <div className="flex flex-col gap-4">
        {loading && (
          <>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 w-full animate-pulse rounded-lg bg-background-paper"
              />
            ))}
          </>
        )}
        {!loading &&
          data.map((trip) => <TripResult key={trip.id} trip={trip} />)}
      </div>
    </div>
  );
}
