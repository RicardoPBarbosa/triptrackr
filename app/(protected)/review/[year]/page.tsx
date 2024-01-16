import dayjs from "dayjs";
import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { twMerge } from "tailwind-merge";
import {
  Airplane,
  ArrowLeft2,
  ArrowRight2,
  CalendarTick,
  Global,
  WalletMoney,
} from "iconsax-react";

import { formatPrice } from "@/utils/helpers";
import BackButton from "@/components/BackButton";
import type { AnnualReviewParamProps } from "@/@types";
import { createClient } from "@/utils/supabase/server";
import ReviewInfoCard from "@/components/ReviewInfoCard";
import VisitedCountries from "./components/VisitedCountries";
const SortedTripList = dynamic(() => import("./components/SortedTripList"));
const ExpensesByCategory = dynamic(
  () => import("@/components/chart/ExpensesByCategory"),
  { ssr: false },
);

export async function generateMetadata({
  params,
}: AnnualReviewParamProps): Promise<Metadata> {
  const { year } = params;

  return {
    title: `Triptrackr • Review of ${year}`,
  };
}

export default async function AnnualReview({
  params: { year },
}: AnnualReviewParamProps) {
  const [startDate, endDate] = [
    dayjs(`${year}-01-01`).startOf("day").toISOString(),
    dayjs(`${year}-12-31`).endOf("day").toISOString(),
  ];
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("trips")
    .select(
      `
      id,
      title,
      country_id,
      start_date,
      end_date,
      expenses(*)
    `,
    )
    .gte("start_date", startDate)
    .lt("end_date", endDate)
    .order("start_date", { ascending: true });
  const { sumExpenses, sumDaysTraveling, sumTrips, sumCountriesVisited } = {
    sumExpenses:
      data?.reduce(
        (acc, curr) => acc + curr.expenses.reduce((a, c) => a + c.amount, 0),
        0,
      ) || 0,
    sumDaysTraveling:
      data?.reduce(
        (acc, curr) =>
          acc + dayjs(curr.end_date).diff(dayjs(curr.start_date), "day") + 1,
        0,
      ) || 0,
    sumTrips: data?.length || 0,
    sumCountriesVisited: data?.reduce(
      (acc, curr) => acc.add(curr.country_id),
      new Set(),
    ).size,
  };

  const prevYear = Number(year) - 1;
  const nextYear = Number(year) + 1;

  return (
    <div className="top-padding annual-review-bg mb-24 flex flex-col bg-background-paper bg-[radial-gradient(122.92%_158.72%_at_167.05%_-75.17%,_#31C6DA_0%,_#2C3238_100%)] px-3">
      <div className="flex items-center justify-between py-3">
        <BackButton url="/" />
        <div className="text-right">
          <h1 className="text-3xl">Annual review</h1>
        </div>
      </div>
      <div className="flex flex-col items-center gap-6 pb-32">
        <div className="flex items-center gap-4">
          <Link
            href={prevYear.toString()}
            className="grid h-9 w-9 place-content-center rounded-full transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ArrowLeft2 size={20} />
          </Link>
          <span className="min-w-[100px] text-center font-display text-xl font-bold tracking-wide text-primary">
            {year}
          </span>
          <Link
            href={nextYear.toString()}
            className={twMerge(
              "grid h-9 w-9 place-content-center rounded-full transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent",
              Number(year) === new Date().getFullYear() &&
                "pointer-events-none opacity-30",
            )}
          >
            <ArrowRight2 size={20} />
          </Link>
        </div>
        <div className="flex w-full justify-around">
          <ReviewInfoCard
            icon={Airplane}
            label={
              <>
                Number
                <br />
                of trips
              </>
            }
            value={sumTrips}
          />
          <ReviewInfoCard
            icon={CalendarTick}
            label={
              <>
                Number of
                <br />
                days traveling
              </>
            }
            value={sumDaysTraveling}
          />
        </div>
        <div className="flex w-full justify-around">
          <ReviewInfoCard
            icon={Global}
            label={
              <>
                Countries
                <br />
                visited
              </>
            }
            value={sumCountriesVisited}
          />
          <ReviewInfoCard
            icon={WalletMoney}
            label={
              <>
                Total
                <br />
                spent
              </>
            }
            value={`${formatPrice(sumExpenses)} €`}
          />
        </div>
        <div className="w-full rounded-lg border border-background bg-background p-3">
          <Suspense>
            <SortedTripList trips={data || []} />
          </Suspense>
        </div>
        <div className="w-full rounded-lg border border-background bg-background p-3">
          <VisitedCountries
            countriesIds={data?.map((trip) => trip.country_id) || []}
          />
        </div>
        <div className="w-full rounded-lg border border-background bg-background p-3">
          <h2 className="text-primary">Expenses by category</h2>
          <Suspense>
            <ExpensesByCategory
              expenses={data?.flatMap(({ expenses }) => expenses) || []}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
