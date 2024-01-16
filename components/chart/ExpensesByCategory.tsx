"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

import type { Expense } from "@/@types";
import { formatPrice } from "@/utils/helpers";
import { expenseCategories } from "@/constants";
// import useMediaQuery from "@/hooks/useMediaQuery";

type ChartData = {
  name?: string;
  value: number;
  color?: string;
  percentage: number;
};

export default function ExpensesByCategory({
  expenses,
}: {
  expenses: Expense[];
}) {
  // const isMobile = useMediaQuery("(max-width: 400px)");
  const data = useMemo<ChartData[]>(() => {
    let totalAmount = 0;
    const dataBuild: { id: string; value: number }[] = [];
    expenses.forEach((expense) => {
      const categoryRow = dataBuild.find(
        (row) => row.id === expense.category_id,
      );
      if (categoryRow) {
        categoryRow.value += expense.amount;
      } else if (expense.category_id) {
        dataBuild.push({ id: expense.category_id, value: expense.amount });
      }
      totalAmount += expense.amount;
    });

    return dataBuild
      .sort((a, b) => (a.value < b.value ? 1 : -1))
      .map(({ id, value }) => {
        const category = expenseCategories.find((cat) => cat.id === id);
        return {
          name: category?.name,
          value: Number(value.toFixed(2)),
          color: category?.color,
          percentage:
            totalAmount > 0
              ? Number(((value / totalAmount) * 100).toFixed(2))
              : 0,
        };
      });
  }, [expenses]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-between gap-2 sm:flex-row">
      {!data.length && (
        <div className="w-full py-5 text-center">No data to show</div>
      )}
      {!!data.length && (
        <PieChart width={180} height={180} className="flex-none">
          <Pie
            data={data}
            innerRadius={45}
            outerRadius={80}
            labelLine={false}
            dataKey="value"
            animationDuration={200}
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
        </PieChart>
      )}
      <div className="flex w-full flex-1 flex-col gap-1 overflow-hidden">
        {data.map((categoryRow) => (
          <div
            key={categoryRow.name}
            className="flex items-center justify-between gap-2 sm:justify-normal"
          >
            <div className="w-14 text-sm text-gray-300">
              {categoryRow.percentage}%
            </div>
            <div
              className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-display text-base text-gray-400"
              style={{
                color: categoryRow.color,
              }}
            >
              {categoryRow.name}
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-right text-sm text-gray-400">
              {formatPrice(categoryRow.value)} €
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
