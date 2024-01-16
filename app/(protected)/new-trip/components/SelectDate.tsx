"use client";

import dayjs from "dayjs";
import "react-day-picker/dist/style.css";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";

import { ROUTE_DATE_FORMAT } from "@/constants";
import useDateSelect from "@/hooks/useDateSelect";
import useNewEntryForm from "@/hooks/useNewEntryForm";

function parseSelectedDate(selectedDate: string | null): DateRange | undefined {
  if (!selectedDate) return;
  const [from, to] = decodeURI(selectedDate).split("-");
  if (!from) return;
  return {
    from: dayjs(from, ROUTE_DATE_FORMAT).toDate(),
    to: !!to ? dayjs(to, ROUTE_DATE_FORMAT).toDate() : undefined,
  };
}

export default function SelectDate() {
  const router = useRouter();
  const { country, date: selectedDate } = useNewEntryForm();
  const {
    dateRange,
    setDateRange,
    selectedDateLabel,
    defaultMonth,
    tripLength,
  } = useDateSelect();
  const url = useMemo(() => `new-trip?country=${country}&date=`, [country]);

  useEffect(() => {
    setDateRange(parseSelectedDate(selectedDate));
  }, [selectedDate, setDateRange]);

  useEffect(() => {
    if (!dateRange) return router.push(url, { scroll: false });
    if (dateRange?.from) {
      if (!dateRange.to) {
        router.push(
          `${url}${dayjs(dateRange.from).format(ROUTE_DATE_FORMAT)}`,
          {
            scroll: false,
          },
        );
      } else if (dateRange.to) {
        router.push(
          `${url}${dayjs(dateRange.from).format(ROUTE_DATE_FORMAT)}-${dayjs(
            dateRange.to,
          ).format(ROUTE_DATE_FORMAT)}`,
          { scroll: false },
        );
      }
    }
  }, [url, dateRange, router]);

  return (
    <div className="flex flex-col items-center">
      <div className="mx-auto mb-1 flex h-7 w-full max-w-sm items-center justify-between px-3">
        <h3 className="font-bold text-secondary">{selectedDateLabel}</h3>
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
          day_selected: "!bg-secondary",
        }}
      />
    </div>
  );
}
