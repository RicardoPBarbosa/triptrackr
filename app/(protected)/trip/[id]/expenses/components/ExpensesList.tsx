"use client";

import dayjs from "dayjs";
import { useMemo } from "react";

import type { Expense } from "@/@types";
import { DATABASE_DATE_FORMAT } from "@/constants";
import { formatExpensesIntoDays, getDaysBetweenDates } from "@/utils/helpers";
import ExpensesDay from "./ExpensesDay";

type Props = {
  startDate: string;
  endDate: string;
  expenses: Expense[];
};

export default function ExpensesList({ startDate, endDate, expenses }: Props) {
  const days = useMemo(
    () =>
      startDate && endDate
        ? getDaysBetweenDates(
            dayjs(startDate, DATABASE_DATE_FORMAT),
            dayjs(endDate, DATABASE_DATE_FORMAT),
          )
        : [],
    [startDate, endDate],
  );
  const expensesByDay = useMemo(
    () => formatExpensesIntoDays(expenses || [], days),
    [expenses, days],
  );

  return (
    <div className="mt-3 flex flex-col gap-2">
      {["Before trip", ...days, "After trip"].map((day, idx) => (
        <ExpensesDay
          key={day.toString()}
          day={day}
          expenses={expensesByDay[idx] || []}
        />
      ))}
    </div>
  );
}
