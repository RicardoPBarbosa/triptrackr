import dayjs from "dayjs";
import Link from "next/link";
import type { Dayjs } from "dayjs";
import { gray } from "tailwindcss/colors";

import type { Expense } from "@/@types";
import { formatPrice } from "@/utils/helpers";
import {
  DATABASE_DATE_FORMAT,
  expenseCategories,
  paymentMethodsIcons,
} from "@/constants";

type Props = {
  day: string | Dayjs;
  expenses: Expense[];
};

export default function ExpensesDay({ day, expenses }: Props) {
  return (
    <div className="mb-2">
      <div className="flex justify-between rounded-lg bg-background-paper px-3 py-2">
        <h3 className="font-bold">
          {typeof day === "string" ? day : day.format("DD MMM")}
        </h3>
        <span className="font-semibold text-tertiary">
          {formatPrice(expenses.reduce((acc, exp) => acc + exp.amount, 0))} €
        </span>
      </div>
      <div className={expenses.length ? "h-2" : ""} />
      {expenses.map((expense) => (
        <Link
          key={expense.id}
          href={`expenses/${expense.id}`}
          className="mb-1 flex items-center justify-between rounded-lg px-3 py-1 hover:bg-background-paper/70"
        >
          <div className="flex-1">
            <div className="mb-1 flex items-center">
              <p className="mr-1 text-xs text-gray-400">
                {dayjs(expense.date, DATABASE_DATE_FORMAT).format(
                  "DD MMM YY HH:mm",
                )}{" "}
              </p>
              {paymentMethodsIcons[expense.payment_method]({
                color: gray[400],
                size: "16",
                variant: "Outline",
              })}
            </div>
            <div className="flex items-center">
              <span className="text-tertiary">
                {expenseCategories
                  .find((cat) => cat.id === expense.category_id)
                  ?.icon?.({
                    size: "20",
                  })}
              </span>
              <h4 className="ml-2 font-bold text-gray-100">{expense.name}</h4>
            </div>
          </div>
          <span className="font-semibold text-gray-100">
            {formatPrice(expense.amount)} EUR
          </span>
        </Link>
      ))}
    </div>
  );
}
