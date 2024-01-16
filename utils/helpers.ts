import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import type { Expense, ExpensesByDay } from "@/@types";
import { DATABASE_DATE_FORMAT, ROUTE_DATE_FORMAT } from "@/constants";

export function sortAlphabetically(a: string, b: string) {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

export function getTripLengthInDays(startDate: Date, endDate?: Date) {
  return dayjs(endDate || startDate).diff(dayjs(startDate), "day") + 1;
}

export function parseURLDate(date: string | null) {
  if (!date) return;
  const [start, end] = decodeURI(date).split("-");
  if (!start) return;
  const [startDate, endDate] = [
    dayjs(start, ROUTE_DATE_FORMAT),
    !!end ? dayjs(end, ROUTE_DATE_FORMAT) : undefined,
  ];
  return {
    startDate,
    endDate,
    length: getTripLengthInDays(startDate.toDate(), endDate?.toDate()),
  };
}

function pluralize(count: number, noun: string, suffix = "s") {
  return `${count} ${noun}${count !== 1 ? suffix : ""}`;
}

export function parseTripDateStatus(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return "Invalid date";
  const countToStart = dayjs(startDate, DATABASE_DATE_FORMAT).diff(
    dayjs().startOf("day"),
    "days",
  );
  const countToEnd = dayjs(endDate, DATABASE_DATE_FORMAT).diff(
    dayjs().endOf("day"),
    "days",
  );

  if (countToEnd < 0) return "Finished";

  // ongoing
  if (countToStart < 0 && countToEnd > 0)
    return `${pluralize(countToEnd, "day", "s")} remaining`;

  // upcoming
  return `${pluralize(countToEnd, "day", "s")} left`;
}

export function formatDateRange(startDate: string, endDate: string) {
  return `${dayjs(startDate, DATABASE_DATE_FORMAT).format("MMM DD")} - ${dayjs(
    endDate,
    DATABASE_DATE_FORMAT,
  ).format("MMM DD, YYYY")}`;
}

export const formatPrice = (price: number) =>
  parseFloat(price.toFixed(2)).toLocaleString();

export const getDaysBetweenDates = (startDate: Dayjs, endDate: Dayjs) => {
  const dates: Dayjs[] = [];
  dates.push(startDate);
  for (let i = 1; i <= endDate.diff(startDate, "days"); i += 1) {
    dates.push(startDate.add(i, "days"));
  }

  return dates;
};

const sortByDate = (a: Expense, b: Expense) =>
  dayjs(a.date, DATABASE_DATE_FORMAT).isBefore(
    dayjs(b.date, DATABASE_DATE_FORMAT),
  )
    ? -1
    : 1;

export const formatExpensesIntoDays = (
  expenses: Expense[],
  dates: Dayjs[],
): ExpensesByDay => {
  const result: ExpensesByDay = {};
  Array.from(Array(dates.length + 2)).forEach((_, i) => {
    result[i] = [];
  });

  if (expenses?.length) {
    Object.keys(result).map((_, i, arr) => {
      if (i === 0) {
        // check for expenses where date is < dates[0]
        result[i] = expenses
          .filter((expense) =>
            dayjs(expense.date, DATABASE_DATE_FORMAT).isBefore(dates[i]),
          )
          .sort(sortByDate);
        return;
      }
      if (i === arr.length - 1) {
        // check for expenses where date is > dates[i-2] "2" to remove both the length additional number, and the last entry that is "After Trip"
        result[i] = expenses
          .filter((expense) =>
            dayjs(expense.date, DATABASE_DATE_FORMAT).isAfter(
              dates[i - 2]
                .set("hours", 23)
                .set("minutes", 59)
                .set("seconds", 59),
            ),
          )
          .sort(sortByDate);
        return;
      }
      result[i] = expenses
        .filter((expense) =>
          dayjs(expense.date, DATABASE_DATE_FORMAT).isSame(dates[i - 1], "day"),
        )
        .sort(sortByDate);
    });
  }

  return result;
};
