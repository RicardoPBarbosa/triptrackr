"use client";

import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { CalendarEdit } from "iconsax-react";
import type { DateRange } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";
import { Suspense, useEffect, useState } from "react";

import type { Trip } from "@/@types";
import { updateTrip } from "@/actions";
import { ROUTE_DATE_FORMAT } from "@/constants";
import FullscreenModal from "@/components/FullscreenModal";

const EditName = dynamic(() => import("./EditName"));
const EditCountry = dynamic(() => import("./EditCountry"));
const EditDate = dynamic(() => import("./EditDate"));

type EditTypes = "name" | "country" | "date";

export default function EditTrip({ trip }: { trip: Trip }) {
  const [open, setOpen] = useState<EditTypes | undefined>();
  const [tripName, setTripName] = useState(trip.title);
  const [countryId, setCountryId] = useState(trip.country_id);
  const [date, setDate] = useState<DateRange | undefined>({
    from: dayjs(trip.start_date).toDate(),
    to: dayjs(trip.end_date).toDate(),
  });

  useEffect(() => {
    if (!open) {
      setTripName(trip.title);
      setCountryId(trip.country_id);
      setDate({
        from: dayjs(trip.start_date).toDate(),
        to: dayjs(trip.end_date).toDate(),
      });
    }
  }, [open, trip]);

  async function handleSubmit() {
    let valid = false;
    const formData = new FormData();
    switch (open) {
      case "name":
        if (tripName.length) {
          valid = true;
          formData.append("tripName", tripName);
        }
        break;
      case "country":
        if (countryId.length) {
          valid = true;
          formData.append("countryId", countryId);
        }
        break;
      case "date":
        if (date?.from) {
          valid = true;
          let dateString = "";
          if (!date.to) {
            dateString = `${dayjs(date.from).format(ROUTE_DATE_FORMAT)}`;
          } else {
            dateString = `${dayjs(date.from).format(ROUTE_DATE_FORMAT)}-${dayjs(
              date.to,
            ).format(ROUTE_DATE_FORMAT)}`;
          }
          formData.append("date", dateString);
        }
        break;
      default:
        break;
    }
    if (valid) {
      await updateTrip(`${trip.id}`, formData);
    }
    setOpen(undefined);
  }

  return (
    <>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            className="flex items-center gap-2 font-display text-gray-400 outline-none transition-colors hover:text-gray-300"
            aria-label="Edit trip"
          >
            <CalendarEdit size={22} />
            <span className="mt-0.5">Edit</span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="mr-3 rounded-lg border border-paper bg-background-paper p-2 shadow-xl">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setOpen("name")}
                className="w-full rounded-md bg-background-paper-light px-6 py-1.5 font-display font-bold outline-none transition-colors hover:bg-background-paper-light/50"
              >
                Name
              </button>
              <button
                className="w-full rounded-md bg-background-paper-light px-6 py-1.5 font-display font-bold outline-none transition-colors hover:bg-background-paper-light/50"
                onClick={() => setOpen("country")}
              >
                Country
              </button>
              <button
                className="w-full rounded-md bg-background-paper-light px-6 py-1.5 font-display font-bold outline-none transition-colors hover:bg-background-paper-light/50"
                onClick={() => setOpen("date")}
              >
                Date
              </button>
            </div>
            <Popover.Arrow className="fill-background-paper" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <FullscreenModal
        open={!!open}
        close={() => setOpen(undefined)}
        submit={handleSubmit}
        submitButtonColor="primary"
      >
        <h1 className="mb-3 text-2xl">
          <span className="font-light text-gray-400">Edit trip •</span>{" "}
          <span className="font-bold">{trip.title}</span>
        </h1>
        {open === "name" && (
          <Suspense>
            <EditName name={tripName} setName={setTripName} />
          </Suspense>
        )}
        {open === "country" && (
          <Suspense>
            <EditCountry countryId={countryId} setCountryId={setCountryId} />
          </Suspense>
        )}
        {open === "date" && (
          <Suspense>
            <EditDate
              date={{
                from: dayjs(trip.start_date).toDate(),
                to: dayjs(trip.end_date).toDate(),
              }}
              setDate={setDate}
            />
          </Suspense>
        )}
      </FullscreenModal>
    </>
  );
}
