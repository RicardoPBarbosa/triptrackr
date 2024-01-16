import dayjs from "dayjs";
import { useEffect } from "react";
import { DayPicker, type DateRange } from "react-day-picker";

import useDateSelect from "@/hooks/useDateSelect";

type Props = {
  date: DateRange;
  setDate: (date: DateRange | undefined) => void;
};

export default function EditDate({ date, setDate }: Props) {
  const {
    dateRange,
    setDateRange,
    selectedDateLabel,
    defaultMonth,
    tripLength,
  } = useDateSelect(date);

  useEffect(() => {
    setDate(dateRange);
  }, [dateRange, setDate]);

  return (
    <div className="mt-2 flex flex-col items-center overflow-y-auto">
      <div className="mx-auto mb-1 flex h-7 w-full max-w-sm items-center justify-between px-3">
        <h3 className="font-bold text-primary">{selectedDateLabel}</h3>
        {tripLength > 0 && (
          <span className="flex h-full items-center rounded-md bg-background-paper px-2 font-display text-sm">
            {tripLength} day trip
          </span>
        )}
      </div>
      <DayPicker
        id="test"
        mode="range"
        defaultMonth={defaultMonth}
        selected={dateRange}
        onSelect={setDateRange}
        className="!m-0 w-fit text-center"
        showOutsideDays
        fixedWeeks
        formatters={{
          formatWeekdayName: (weekday) => dayjs(weekday).format("ddd"),
        }}
        classNames={{
          months: "overflow-x-auto",
          month: "overflow-x-auto",
          caption_label: "font-display font-bold tracking-wide text-sm",
          head_cell:
            "tracking-wide font-body font-normal text-sm text-gray-500",
          button: "hover:bg-background-paper !cursor-pointer",
          cell: "text-base border border-paper",
          day: "w-12 h-12",
          day_outside: "!text-gray-500",
          day_range_start: "rounded-none",
          day_selected: "!bg-primary !text-background",
        }}
      />
    </div>
  );
}
