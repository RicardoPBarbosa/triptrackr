import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { ClipboardTick, Timer, Wallet } from "iconsax-react";

import { fixOneToOne } from "@/@types";
import type { ChecklistItem } from "@/@types";
import { getCountries } from "@/utils/countries";
import { DATABASE_DATE_FORMAT } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import {
  formatPrice,
  getTripLengthInDays,
  parseTripDateStatus,
} from "@/utils/helpers";
const NoComingNextTrip = dynamic(() => import("./NoComingNextTrip"));

export default async function ComingNext() {
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
    .gte("end_date", new Date().toISOString())
    .order("end_date", { ascending: true })
    .limit(1)
    .single();

  if (!data) {
    return (
      <Suspense>
        <NoComingNextTrip />
      </Suspense>
    );
  }

  const country = data?.country_id
    ? getCountries().find((c) => c.id === data.country_id)
    : undefined;
  const checklistItems = fixOneToOne(data?.checklists)?.items as
    | ChecklistItem[]
    | undefined;
  const sumExpenses =
    data?.expenses.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  return (
    <div className="relative flex w-full flex-col tracking-wider">
      <h2 className="font-body text-sm font-medium text-primary">
        COMING NEXT
      </h2>
      <div className="mb-3 mt-2 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-4xl">
          <Link
            className="underline decoration-gray-500 underline-offset-4 transition-colors hover:text-secondary hover:decoration-secondary/50"
            href={`/trip/${data.id}`}
          >
            {data.title || ""}
          </Link>
        </h1>
        <span>
          <Image
            src={`/assets/countries/${country?.flagPath || "DEFAULT.png"}`}
            alt={country?.name || ""}
            width={35}
            height={23}
            className="rounded-md"
          />
        </span>
      </div>
      <div className="mb-8 flex items-center justify-between">
        <p className="flex items-center gap-1 text-tertiary">
          <Timer size={16} />
          <span className="leading-none">
            {parseTripDateStatus(data.start_date, data.end_date)}
          </span>
        </p>
        <p className="text-gray-400">
          {getTripLengthInDays(
            dayjs(data.start_date, DATABASE_DATE_FORMAT).toDate(),
            dayjs(data.end_date, DATABASE_DATE_FORMAT).toDate(),
          )}{" "}
          day trip
        </p>
      </div>
      <div className="absolute -bottom-24 left-1/2 mt-2 flex h-[119px] w-full -translate-x-1/2 items-center justify-evenly rounded-lg border border-background bg-background">
        <Link
          prefetch={true}
          href={`/trip/${data.id}/checklist`}
          className="flex h-full flex-1 flex-col items-center justify-between p-[10px] transition-colors hover:bg-background-paper/50"
        >
          <ClipboardTick variant="Bulk" size={34} className="text-primary" />
          <span className="font-body text-lg font-medium">
            {`${(checklistItems || []).filter((it) => it.checked).length} / ${
              checklistItems?.length || 0
            }`}
          </span>
          <span className="font-display font-bold text-primary">Checklist</span>
        </Link>
        <div className="h-[calc(100%-10px)] w-[1px] bg-background-paper-light" />
        <Link
          href={`/trip/${data.id}/expenses/new`}
          className="flex h-full flex-1 flex-col items-center justify-between p-[10px] transition-colors hover:bg-background-paper/50"
        >
          <Wallet variant="Bulk" size={34} className="text-tertiary" />
          <span className="font-body text-lg font-medium">
            {formatPrice(sumExpenses)} €
          </span>
          <span className="font-display font-bold text-tertiary">
            Add expense
          </span>
        </Link>
      </div>
    </div>
  );
}
