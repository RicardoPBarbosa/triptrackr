import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata, Viewport } from "next";

import { newExpense } from "@/actions";
import Button from "@/components/Button";
import BackButton from "@/components/BackButton";
import type { TripDetailsParamProps } from "@/@types";
import { createClient } from "@/utils/supabase/server";

import NameInput from "../components/form/NameInput";
import DateInput from "../components/form/DateInput";
import AmountInput from "../components/form/AmountInput";
import CategorySelect from "../components/form/CategorySelect";
import PaymentMethodSelect from "../components/form/PaymentMethodSelect";

export const viewport: Viewport = {
  themeColor: "#1B1E21",
};

export async function generateMetadata({
  params,
}: TripDetailsParamProps): Promise<Metadata> {
  const { id } = params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("trips")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: `Triptrackr • ${data?.title || ""} • New expense`,
  };
}

export default async function NewExpense({
  params: { id },
}: TripDetailsParamProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("trips")
    .select("title")
    .eq("id", id)
    .single();

  if (!data) {
    return notFound();
  }

  return (
    <div className="px-3 pb-32">
      <div className="top-padding flex items-center justify-between pb-3">
        <BackButton />
        <div className="text-right">
          <p className="font-display text-sm text-gray-400">{data.title}</p>
          <h1 className="text-3xl">New expense</h1>
        </div>
      </div>
      <form action={newExpense} className="flex flex-col gap-3">
        <input hidden name="tripId" readOnly value={id} />
        <NameInput />
        <div className="flex justify-between gap-3">
          <DateInput />
          <AmountInput />
        </div>
        <CategorySelect />
        <PaymentMethodSelect />
        <Button color="tertiary" className="my-5">
          Add expense
        </Button>
      </form>
    </div>
  );
}
