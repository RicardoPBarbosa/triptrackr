import { useMemo } from "react";
import type { TooltipProps } from "recharts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatPrice } from "@/utils/helpers";
import type { ExpensesByDay as ExpensesByDayType } from "@/@types";

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-paper bg-background-paper px-4 py-2 text-center shadow-md">
        <p className="font-display text-sm text-tertiary">
          {payload[0].payload.name}
        </p>
        <p className="text-xl font-medium tracking-wider text-white">
          {Number(payload[0].value?.toFixed(2))} €
        </p>
      </div>
    );
  }
  return null;
}

type ChartData = {
  name: string;
  value: number;
};

type Props = {
  expensesByDay: ExpensesByDayType;
  keyMap: (index: number) => string;
};

export default function ExpensesByDay({ expensesByDay, keyMap }: Props) {
  const data = useMemo(() => {
    const dataBuild: ChartData[] = [];
    Object.keys(expensesByDay).forEach((key, i) => {
      if (i === 0) return;
      const value = expensesByDay[Number(key)].reduce(
        (acc, curr) => acc + curr.amount,
        0,
      );
      dataBuild.push({ name: keyMap(Number(key)), value });
    });
    return dataBuild;
  }, [expensesByDay, keyMap]);

  if (!data.length) {
    return <div className="w-full py-5 text-center">No data to show</div>;
  }

  return (
    <ResponsiveContainer minWidth="100%" height={300} style={{ marginTop: 10 }}>
      <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="#404447" />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={7}
          tick={{
            fill: "#D5DAE0",
            fontFamily: "var(--font-display)",
            fontSize: 12,
          }}
          strokeWidth={0}
        />
        <YAxis
          tickLine={false}
          tickMargin={7}
          width={50}
          tick={{
            fill: "#D5DAE0",
            fontFamily: "var(--font-body)",
            fontSize: 12,
          }}
          tickFormatter={(value) => formatPrice(value)}
          strokeWidth={0}
        />
        <Tooltip cursor={{ fill: "#2C3238" }} content={CustomTooltip} />
        <Bar dataKey="value" min={0} radius={[5, 5, 0, 0]} fill="#E86B3B" />
      </BarChart>
    </ResponsiveContainer>
  );
}
