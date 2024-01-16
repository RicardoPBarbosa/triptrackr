import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata, Viewport } from "next";
import { MoneySend, StatusUp } from "iconsax-react";

import Button from "@/components/Button";
import { formatPrice } from "@/utils/helpers";
import BackButton from "@/components/BackButton";
import type { TripDetailsParamProps } from "@/@types";
import { createClient } from "@/utils/supabase/server";
const ExpensesList = dynamic(() => import("./components/ExpensesList"));

export const viewport: Viewport = {
  themeColor: "#1B1E21",
};

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
    title: `Triptrackr • ${data?.title || ""} • Expenses`,
  };
}

export default async function Expenses({
  params: { id },
}: TripDetailsParamProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("trips")
    .select(
      `
      title,
      start_date,
      end_date,
      expenses(*)
    `,
    )
    .eq("id", id)
    .single();

  if (!data) {
    return notFound();
  }
  const sumExpenses =
    data?.expenses.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  return (
    <div className="px-3 pb-48">
      <div className="top-padding flex items-center justify-between pb-3">
        <BackButton url="/" />
        <div className="text-right">
          <p className="font-display text-sm text-gray-400">{data.title}</p>
          <h1 className="text-3xl">Expenses</h1>
        </div>
      </div>
      <div className="flex items-stretch justify-between gap-3 py-3">
        <div className="flex flex-1 items-center justify-between rounded-lg border border-paper bg-background-paper px-4 py-2">
          <h2>Total spent</h2>
          <h3 className="flex-1 text-right font-body text-xl font-semibold text-tertiary">
            {formatPrice(sumExpenses)} €
          </h3>
        </div>
        <Link href="expenses/review">
          <Button
            color="tertiary"
            variant="outlined"
            className="grid h-12 w-12 place-content-center px-0"
          >
            <StatusUp size={40} className="[&>path:last-child]:hidden" />
          </Button>
        </Link>
      </div>
      <Suspense>
        <ExpensesList
          startDate={data.start_date}
          endDate={data.end_date}
          expenses={data.expenses}
        />
      </Suspense>
      <Link
        href="expenses/new"
        className="fixed bottom-[105px] left-1/2 z-50 -translate-x-1/2"
      >
        <Button
          color="tertiary"
          startIcon={<MoneySend variant="Bulk" size={28} />}
        >
          Add Expense
        </Button>
      </Link>
    </div>
  );
}
