import Link from "next/link";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

import type { Trip } from "@/@types";
import { getCountries } from "@/utils/countries";
import { formatDateRange } from "@/utils/helpers";

export default function TripListItem({ trip }: { trip: Trip }) {
  const country = getCountries().find((c) => c.id === trip.country_id);

  return (
    <Link
      href={`/trip/${trip.id}`}
      className="group relative flex h-44 flex-col justify-between overflow-hidden rounded-lg bg-background-paper transition-all hover:bg-background-paper-light"
      style={{
        backgroundImage: trip.cover ? `url(${trip.cover})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Image
        src={`/assets/countries/${country?.flagPath || "DEFAULT.png"}`}
        alt={country?.name || ""}
        width={31}
        height={20}
        className="m-3 rounded-md"
      />
      <div
        className={twMerge(
          "absolute left-0 top-0 flex h-full w-full flex-col justify-end p-3 transition-colors",
          trip.cover &&
            "bg-gradient-to-b from-transparent to-black group-hover:bg-black/20",
        )}
      >
        <span className="mb-1 font-display text-xs text-gray-300">
          {formatDateRange(trip.start_date, trip.end_date)}
        </span>
        <p className="font-display font-bold leading-none">{trip.title}</p>
      </div>
    </Link>
  );
}
