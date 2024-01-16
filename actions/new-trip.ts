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

dayjs.extend(utc);

const newTripSchema = z.object({
  tripName: z.string().min(1, "Trip name must be at least 1 character"),
  countryId: z
    .string()
    .min(1, "Country must be at least 1 character")
    .refine(
      (cId) => getCountries().some((c) => c.id === cId),
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
    .transform((dateRange) => {
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
});

export async function submitNewTrip(formData: FormData) {
  const { tripName, countryId, date } = Object.fromEntries(formData.entries());
  let success = false;
  try {
    const parsedData = newTripSchema.parse({ tripName, countryId, date });
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("trips").insert({
        title: parsedData.tripName,
        start_date: parsedData.date.startDate,
        end_date: parsedData.date.endDate,
        country_id: parsedData.countryId,
        user_id: user.id,
      });
      success = true;
    }
  } catch (error) {
    const baseUrl = `?country=${countryId}&date=${date}&name=${tripName}`;
    handleError(error, baseUrl);
  } finally {
    if (success) {
      revalidatePath("/");
      redirect("/");
    }
  }
}
