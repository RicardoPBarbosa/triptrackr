import dayjs from "dayjs";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

import { getTripLengthInDays } from "@/utils/helpers";

export default function useDateSelect(defaultDateRange?: DateRange) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange,
  );
  const { selectedDateLabel, tripLength, defaultMonth } = useMemo(() => {
    if (!dateRange)
      return {
        selectedDateLabel: "Select a date",
        tripLength: 0,
        defaultMonth: new Date(),
      };
    if (!dateRange.to)
      return {
        selectedDateLabel: dayjs(dateRange.from).format("ddd, MMM DD"),
        tripLength: 1,
        defaultMonth: dateRange.from,
      };
    return {
      selectedDateLabel: `${dayjs(dateRange.from).format(
        "ddd, MMM DD",
      )} - ${dayjs(dateRange.to).format("ddd, MMM DD")}`,
      tripLength: getTripLengthInDays(
        dateRange.from || new Date(),
        dateRange.to,
      ),
      defaultMonth: dateRange.from,
    };
  }, [dateRange]);

  return {
    dateRange,
    setDateRange,
    selectedDateLabel,
    tripLength,
    defaultMonth,
  };
}
