import dayjs from "dayjs";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata, Viewport } from "next";

import { editExpense } from "@/actions";
import Button from "@/components/Button";
import BackButton from "@/components/BackButton";
import { createClient } from "@/utils/supabase/server";
import type { EditTripExpenseParamProps, PaymentMethodType } from "@/@types";

import NameInput from "../components/form/NameInput";
import DateInput from "../components/form/DateInput";
import AmountInput from "../components/form/AmountInput";
import CategorySelect from "../components/form/CategorySelect";
import PaymentMethodSelect from "../components/form/PaymentMethodSelect";
const DeleteExpenseBtn = dynamic(() => import("./DeleteExpenseBtn"));

export const viewport: Viewport = {
  themeColor: "#1B1E21",
};

export async function generateMetadata({
  params,
}: EditTripExpenseParamProps): Promise<Metadata> {
  const { id } = params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("trips")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: `Triptrackr • ${data?.title || ""} • Edit expense`,
  };
}

export default async function EditExpense({
  params: { id: tripId, expenseId },
}: EditTripExpenseParamProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: trip } = await supabase
    .from("trips")
    .select("title")
    .eq("id", tripId)
    .single();
  const { data } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", expenseId)
    .single();

  if (!data) {
    return notFound();
  }

  return (
    <div className="px-3 pb-32">
      <div className="top-padding flex items-center justify-between pb-3">
        <BackButton />
        <div className="text-right">
          <p className="font-display text-sm text-gray-400">{trip?.title}</p>
          <h1 className="text-3xl">Edit expense</h1>
        </div>
      </div>
      <form action={editExpense} className="flex flex-col gap-3">
        <input hidden name="tripId" readOnly value={tripId} />
        <input hidden name="expenseId" readOnly value={expenseId} />
        <NameInput defaultValue={data.name} />
        <div className="flex justify-between gap-3">
          <DateInput
            defaultValue={dayjs(data.date).format("YYYY-MM-DDTHH:mm")}
          />
          <AmountInput defaultValue={data.amount} />
        </div>
        <CategorySelect defaultValue={data.category_id} />
        <PaymentMethodSelect
          defaultValue={data.payment_method as PaymentMethodType}
        />
        <Button color="tertiary" className="my-5">
          Save changes
        </Button>
      </form>
      <Suspense>
        <DeleteExpenseBtn tripId={tripId} expenseId={expenseId} />
      </Suspense>
    </div>
  );
}
