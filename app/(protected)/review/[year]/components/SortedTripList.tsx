"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrangeVertical, ArrowRight } from "iconsax-react";

import type { Expense, Trip } from "@/@types";
import { getCountries } from "@/utils/countries";
import { formatDateRange, formatPrice } from "@/utils/helpers";

type ReviewTrip = Pick<
  Trip,
  "id" | "country_id" | "title" | "start_date" | "end_date"
> & {
  expenses: Pick<Expense, "amount">[];
};

type SortBy = "date" | "expenses";

const countries = getCountries();

function TripRow({ trip, sortedBy }: { trip: ReviewTrip; sortedBy: SortBy }) {
  const country = countries.find((c) => c.id === trip.country_id);
  const sumExpenses = trip.expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <Link
      href={`/trip/${trip.id}`}
      className="flex h-16 items-center justify-between gap-4 rounded-lg bg-background-paper p-3 transition-colors hover:bg-background-light"
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
        <h2 className="font-medium">{trip.title}</h2>
        <span className="text-sm font-normal text-gray-400">
          {sortedBy === "date"
            ? formatDateRange(trip.start_date, trip.end_date)
            : `${formatPrice(sumExpenses)} €`}
        </span>
      </div>
      <ArrowRight size={26} className="text-gray-400" />
    </Link>
  );
}

export default function SortedTripList({ trips }: { trips: ReviewTrip[] }) {
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const sortedTrips = useMemo(() => {
    if (sortBy === "expenses") {
      return trips.sort((a, b) => {
        const aExpenses = a.expenses.reduce(
          (acc, curr) => acc + curr.amount,
          0,
        );
        const bExpenses = b.expenses.reduce(
          (acc, curr) => acc + curr.amount,
          0,
        );
        return bExpenses - aExpenses;
      });
    }

    return trips.sort((a, b) => {
      const aStartDate = new Date(a.start_date).getTime();
      const bStartDate = new Date(b.start_date).getTime();
      return aStartDate - bStartDate;
    });
  }, [trips, sortBy]);

  return (
    <>
      <div className="flex items-center justify-between overflow-hidden pb-3">
        <h2 className="pt-0.5 text-primary">Trips</h2>
        <button
          onClick={() =>
            setSortBy((prev) => (prev === "date" ? "expenses" : "date"))
          }
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={sortBy}
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.05 }}
              className="flex items-center gap-1 font-display capitalize"
            >
              <ArrangeVertical size={19} className="text-gray-400" />
              <span className="pt-0.5">{sortBy}</span>
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <div className="relative">
        <div className="no-scrollbar relative flex max-h-60 flex-col gap-3 overflow-y-auto pb-3">
          {sortedTrips.map((trip) => (
            <TripRow key={trip.id} trip={trip} sortedBy={sortBy} />
          ))}
        </div>
        <div className="absolute -bottom-2 h-5 w-full bg-gradient-to-t from-background from-5% to-transparent" />
      </div>
    </>
  );
}
