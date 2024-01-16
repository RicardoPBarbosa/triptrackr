import dayjs from "dayjs";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import BackButton from "@/components/BackButton";
import { DATABASE_DATE_FORMAT } from "@/constants";
import type { Expense, ExpensesByDay, TripDetailsParamProps } from "@/@types";
import { createClient } from "@/utils/supabase/server";
import { formatExpensesIntoDays, getDaysBetweenDates } from "@/utils/helpers";
import SummaryByDay from "./components/SummaryByDay";

export async function generateMetadata({
  params,
}: TripDetailsParamProps): Promise<Metadata> {
  const { id } = params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("trips")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: `Triptrackr • ${data?.title || ""} • Expenses review`,
  };
}

function addOverallExpensesKey(
  expensesByDay: ExpensesByDay,
  allExpenses: Expense[],
) {
  for (let i = Object.keys(expensesByDay).length - 1; i >= 0; i--) {
    expensesByDay[i + 1] = expensesByDay[i];
  }

  expensesByDay[0] = allExpenses;
}

export default async function ExpensesReview({
  params: { id },
}: TripDetailsParamProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: trip } = await supabase
    .from("trips")
    .select(
      `
      title,
      start_date,
      end_date
    `,
    )
    .eq("id", id)
    .single();

  if (!trip) {
    return notFound();
  }

  const { data: allExpenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("trip_id", id);

  if (!allExpenses) {
    return notFound();
  }

  const days =
    trip.start_date && trip.end_date
      ? getDaysBetweenDates(
          dayjs(trip.start_date, DATABASE_DATE_FORMAT),
          dayjs(trip.end_date, DATABASE_DATE_FORMAT),
        )
      : [];
  const expensesByDay = formatExpensesIntoDays(allExpenses, days);
  addOverallExpensesKey(expensesByDay, allExpenses);

  return (
    <div className="expenses-review-bg top-padding mb-24 flex flex-col bg-background-paper bg-[radial-gradient(122.92%_158.72%_at_167.05%_-75.17%,_#F99C4F_0%,_#2C3238_100%)] px-3">
      <div className="flex items-center justify-between py-3">
        <BackButton />
        <div className="text-right">
          <p className="font-display text-sm text-tertiary">{trip?.title}</p>
          <h1 className="text-3xl">Expenses review</h1>
        </div>
      </div>
      <SummaryByDay
        days={days.map((d) => d.toString())}
        expensesByDay={expensesByDay}
      />
    </div>
  );
}
