"use server";

import { z } from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { handleError } from "@/utils/errors";
import { ROUTE_DATE_FORMAT } from "@/constants";
import { getCountries } from "@/utils/countries";
import { createClient } from "@/utils/supabase/server";
import { deleteCover } from "./upload-cover";

dayjs.extend(utc);

const updateTripSchema = z.object({
  tripName: z
    .string()
    .min(1, "Trip name must be at least 1 character")
    .optional(),
  countryId: z
    .string()
    .min(1, "Country must be at least 1 character")
    .optional()
    .refine(
      (cId) => !cId || getCountries().some((c) => c.id === cId),
      "Country must be a valid country",
    ),
  date: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in the format MM/DD/YYYY")
    .or(
      z
        .string()
        .regex(
          /^\d{2}\/\d{2}\/\d{4}-\d{2}\/\d{2}\/\d{4}$/,
          "Date must be in the format MM/DD/YYYY-MM/DD/YYYY",
        ),
    )
    .optional()
    .transform((dateRange) => {
      if (!dateRange) return;
      const [startDate, endDate] = dateRange.split("-");
      return {
        startDate: dayjs(startDate, ROUTE_DATE_FORMAT)
          .startOf("day")
          .utc(true)
          .toISOString(),
        endDate: !!endDate
          ? dayjs(endDate, ROUTE_DATE_FORMAT)
              .endOf("day")
              .utc(true)
              .toISOString()
          : dayjs(startDate, ROUTE_DATE_FORMAT)
              .endOf("day")
              .utc(true)
              .toISOString(),
      };
    }),
  rating: z.number().int().min(1).max(10).optional(),
  notes: z.string().optional().nullable(),
});

export async function updateTrip(tripId: string, formData: FormData) {
  const { tripName, countryId, date, rating, notes } = Object.fromEntries(
    formData.entries(),
  );
  let payload: z.infer<typeof updateTripSchema> = {};

  if (rating) {
    payload = { rating: parseInt(rating as string) as number };
  }
  if (notes !== undefined) {
    payload = {
      notes: (notes as string).length ? (notes as string) : null,
    };
  }
  if (tripName) {
    payload = { tripName: tripName as string };
  }
  if (countryId) {
    payload = { countryId: countryId as string };
  }
  if (date) {
    payload = { date: date as never };
  }

  let success = false;
  try {
    const parsedData = updateTripSchema.parse(payload);
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("trips")
        .update({
          title: parsedData.tripName,
          country_id: parsedData.countryId,
          start_date: parsedData.date?.startDate,
          end_date: parsedData.date?.endDate,
          rating: parsedData.rating,
          notes: parsedData.notes,
        })
        .eq("id", tripId);
      success = true;
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      revalidatePath(`/trip/${tripId}`);
    }
  }
}

export async function removeTrip(formData: FormData) {
  const tripId = formData.get("tripId") as string;
  let success = false;
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const trip = await supabase
        .from("trips")
        .select("cover")
        .eq("id", tripId)
        .single();
      if (trip.data) {
        await deleteCover(trip.data.cover);
        await supabase.from("trips").delete().match({ id: tripId });
        success = true;
      }
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      revalidatePath("/");
      redirect("/");
    }
  }
}
