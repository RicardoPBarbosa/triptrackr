"use client";

import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { Suspense, useCallback, useState } from "react";
import { ArrowLeft2, ArrowRight2, Award, WalletCheck } from "iconsax-react";

import { formatPrice } from "@/utils/helpers";
import { expenseCategories } from "@/constants";
import ReviewInfoCard from "@/components/ReviewInfoCard";
import type { Expense, ExpensesByDay as ExpensesByDayType } from "@/@types";
const ExpensesByCategory = dynamic(
  () => import("@/components/chart/ExpensesByCategory"),
  { ssr: false },
);
const ExpensesByDay = dynamic(() => import("./ExpensesByDay"), {
  ssr: false,
});

type Props = {
  days: string[];
  expensesByDay: ExpensesByDayType;
};

export default function SummaryByDay({ days, expensesByDay }: Props) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const daysLength = (Object.keys(expensesByDay).length || 1) - 1;
  const keyMap = useCallback(
    (index: number) => {
      if (index === 0) {
        return "Overall";
      }
      if (index === 1) {
        return "Before trip";
      }
      if (index === daysLength) {
        return "After trip";
      }
      return dayjs(days[index - 2]).format("DD MMM");
    },
    [days, daysLength],
  );

  function goToPrev() {
    setActiveDayIndex((idx) => (idx !== 0 ? idx - 1 : idx));
  }

  function goToNext() {
    setActiveDayIndex((idx) => (idx < daysLength ? idx + 1 : idx));
  }

  const totalSpent = expensesByDay[activeDayIndex].reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );
  const biggestExpense = expensesByDay[activeDayIndex].reduce<Expense | null>(
    (acc, curr) => ((acc?.amount || 0) > curr.amount ? acc : curr),
    null,
  );
  const biggestExpenseCategory = expenseCategories.find(
    (category) => category.id === biggestExpense?.category_id,
  );

  return (
    <div className="flex flex-col items-center gap-4 pb-32 pt-4">
      <div className="flex items-center gap-4">
        <button
          onClick={goToPrev}
          className="grid h-9 w-9 place-content-center rounded-full transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
          disabled={activeDayIndex === 0}
        >
          <ArrowLeft2 size={20} />
        </button>
        <span className="min-w-[100px] text-center font-display font-bold tracking-wide text-tertiary">
          {keyMap(activeDayIndex)}
        </span>
        <button
          onClick={goToNext}
          className="grid h-9 w-9 place-content-center rounded-full transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
          disabled={activeDayIndex === daysLength}
        >
          <ArrowRight2 size={20} />
        </button>
      </div>
      <div className="flex w-full justify-around">
        <ReviewInfoCard
          color="tertiary"
          icon={WalletCheck}
          label={
            <>
              Total
              <br />
              spent
            </>
          }
          value={`${formatPrice(totalSpent)} €`}
        />
        <ReviewInfoCard
          color="tertiary"
          icon={Award}
          label={
            <>
              Biggest
              <br />
              expense
            </>
          }
          valueComponent={
            <div className="flex flex-1 flex-col pt-2">
              <div className="flex min-h-[18px] items-end gap-1 pb-1 font-display text-xs text-gray-400">
                {biggestExpenseCategory?.icon?.({ size: 14 })}
                <span className="leading-none">
                  {biggestExpenseCategory?.name}
                </span>
              </div>
              <span className="min-h-[24px] font-display text-tertiary">
                {biggestExpense?.name}
              </span>
            </div>
          }
        />
      </div>
      <div className="w-full rounded-lg border border-background bg-background p-3">
        <h2 className="text-tertiary">Expenses by category</h2>
        <Suspense>
          <ExpensesByCategory expenses={expensesByDay[activeDayIndex]} />
        </Suspense>
      </div>
      <div className="w-full rounded-lg border border-background bg-background p-3">
        <h2 className="text-tertiary">Expenses by day</h2>
        <Suspense>
          <ExpensesByDay expensesByDay={expensesByDay} keyMap={keyMap} />
        </Suspense>
      </div>
    </div>
  );
}
