import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ClipboardTick, LocationTick, Wallet } from "iconsax-react";

import { fixOneToOne } from "@/@types";
import BackButton from "@/components/BackButton";
import { getCountries } from "@/utils/countries";
import { DATABASE_DATE_FORMAT } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import type { ChecklistItem, TripDetailsParamProps } from "@/@types";
import {
  formatDateRange,
  formatPrice,
  getTripLengthInDays,
  parseTripDateStatus,
} from "@/utils/helpers";

import Rating from "./components/Rating";
import AddNotes from "./components/AddNotes";
import UploadCover from "./components/UploadCover";
const EditTrip = dynamic(() => import("./components/EditTrip"));
const DeleteTripBtn = dynamic(() => import("./components/DeleteTripBtn"));

function Status({ status }: { status: string }) {
  if (status === "Finished") {
    return (
      <span className="flex items-center gap-1 text-emerald-400">
        <LocationTick size={20} /> <span className="mt-0.5">{status}</span>
      </span>
    );
  }

  return <span className="text-tertiary">{status}</span>;
}

export async function generateMetadata({
  params,
}: TripDetailsParamProps): Promise<Metadata> {
  const { id } = params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("trips")
    .select(
      `
      *,
      checklists(
        items
      ),
      expenses(
        amount
      )
    `,
    )
    .eq("id", id)
    .single();

  return {
    title: `Triptrackr • ${data?.title || ""}`,
  };
}

export default async function TripDetails({
  params: { id },
}: TripDetailsParamProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("trips")
    .select(
      `
      *,
      checklists(
        items
      ),
      expenses(
        amount
      )
    `,
    )
    .eq("id", id)
    .single();

  if (!data) {
    return notFound();
  }

  const country = getCountries().find(
    (country) => country.id === data.country_id,
  );
  const checklistItems = fixOneToOne(data?.checklists)?.items as
    | ChecklistItem[]
    | undefined;
  const sumExpenses =
    data?.expenses.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  return (
    <div className="pb-32">
      <div
        className="top-padding flex h-72 flex-col justify-between bg-background-paper px-4 pb-3 sm:px-8"
        style={{
          backgroundImage: `url(${data.cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex items-center justify-between">
          <BackButton />
          <Rating rating={data.rating} />
        </div>
        <div className="mb-5 text-center">
          <UploadCover />
        </div>
      </div>
      <div className="mx-3 -mt-6 flex flex-col overflow-hidden rounded-lg border border-background bg-background px-5 py-3">
        <h2 className="mb-1 text-sm font-bold text-primary">
          {country?.name || ""}
        </h2>
        <h1 className="mb-3 text-3xl tracking-wide">{data.title}</h1>
        <p className="mb-1 font-light tracking-wide text-gray-200">
          {formatDateRange(data.start_date, data.end_date)}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-light tracking-wide text-gray-400">{`${getTripLengthInDays(
              dayjs(data.start_date, DATABASE_DATE_FORMAT).toDate(),
              dayjs(data.end_date, DATABASE_DATE_FORMAT).toDate(),
            )} day trip`}</span>
            <span className="text-gray-400">|</span>
            <Status
              status={parseTripDateStatus(data.start_date, data.end_date)}
            />
          </div>
          <Suspense>
            <EditTrip trip={data} />
          </Suspense>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 px-3">
        <Link
          href={`/trip/${data.id}/checklist`}
          className="flex flex-1 flex-col items-center rounded-lg bg-background-paper p-3 transition-colors hover:bg-background-paper/50"
        >
          <ClipboardTick variant="Bulk" size={34} className="text-primary" />
          <span className="mt-2 font-display text-primary">Checklist</span>
          <span className="text-lg font-medium">{`${
            (checklistItems || []).filter((it) => it.checked).length
          } / ${checklistItems?.length || 0}`}</span>
        </Link>
        <Link
          href={`/trip/${data.id}/expenses`}
          className="flex flex-1 flex-col items-center rounded-lg bg-background-paper p-3 transition-colors hover:bg-background-paper/50"
        >
          <Wallet variant="Bulk" size={34} className="text-tertiary" />
          <span className="mt-2 font-display text-tertiary">Expenses</span>
          <span className="text-lg font-medium">
            {formatPrice(sumExpenses)} €
          </span>
        </Link>
      </div>
      <div className="mb-6 mt-4 px-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-secondary">Notes</h3>
          <AddNotes trip={data} />
        </div>
        <p className="font-light leading-7 tracking-wide">
          {data.notes || (
            <span className="flex items-center gap-6 text-sm sm:text-base">
              Start writing some notes about your trip!
              <Image
                src="/assets/curved-arrow.png"
                alt="->"
                className="rotate-45"
                width={32}
                height={32}
              />
            </span>
          )}
        </p>
      </div>
      <Suspense>
        <DeleteTripBtn tripId={id} />
      </Suspense>
    </div>
  );
}
