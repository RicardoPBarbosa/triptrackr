/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import type { ChecklistItem, CompositeTrip } from "@/@types";

function returnError(error: string) {
  redirect(`/settings?error=${encodeURIComponent(error)}`);
}

function checkJSONValidity(string: string) {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  } finally {
    return true;
  }
}

function validateTripData(string: string): CompositeTrip[] | undefined {
  const json = JSON.parse(string);
  // validate each field to make sure it matches the desired return type
  if (
    Array.isArray(json) &&
    json.every((trip) => {
      const isValid =
        // trip metadata
        "title" in trip &&
        typeof trip.title === "string" &&
        "start_date" in trip &&
        typeof trip.start_date === "string" &&
        "end_date" in trip &&
        typeof trip.end_date === "string" &&
        "country_id" in trip &&
        typeof trip.country_id === "string" &&
        // checklists
        (!trip.checklists ||
          (typeof trip.checklists === "object" &&
            "items" in trip.checklists &&
            Array.isArray(trip.checklists.items) &&
            trip.checklists.items.every((checklistItem: any) => {
              return (
                (!checklistItem.id || typeof checklistItem.id === "string") &&
                "name" in checklistItem &&
                typeof checklistItem.name === "string" &&
                (!checklistItem.checked ||
                  typeof checklistItem.checked === "boolean") &&
                (!checklistItem.fromTemplateId ||
                  typeof checklistItem.fromTemplateId === "string")
              );
            }))) &&
        // expenses
        Array.isArray(trip.expenses) &&
        trip.expenses.every((expense: any) => {
          return (
            "name" in expense &&
            typeof expense.name === "string" &&
            "amount" in expense &&
            typeof expense.amount === "number" &&
            "date" in expense &&
            typeof expense.date === "string" &&
            "payment_method" in expense &&
            typeof expense.payment_method === "string" &&
            "category_id" in expense &&
            typeof expense.category_id === "string"
          );
        });
      if (!isValid) {
        console.error("Invalid trip:", JSON.stringify(trip, null, 2));
      }
      return isValid;
    })
  ) {
    return json;
  }
}

async function storeTripMetadata(trip: CompositeTrip) {
  if (trip.cover?.length) {
    // check if the cover exists in the remote server
    const response = await fetch(trip.cover);
    if (response.status !== 200) {
      trip.cover = "";
    }
  }
  try {
    let tripId: undefined | number;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const tripRes = await supabase
        .from("trips")
        .insert({
          title: trip.title,
          start_date: trip.start_date,
          end_date: trip.end_date,
          country_id: trip.country_id,
          user_id: user.id,
          ...(!!trip.cover && { cover: trip.cover }),
          ...(!!trip.notes && { notes: trip.notes }),
          ...(!!trip.rating && { rating: trip.rating }),
          created_at: trip.created_at || new Date().toISOString(),
          updated_at: trip.updated_at || new Date().toISOString(),
        })
        .select("id")
        .single();
      tripId = tripRes.data?.id;
    }
    return tripId;
  } catch (error) {
    returnError(
      "There was an error restoring your trips data. Please try again.",
    );
  }
}

async function storeTripChecklist(
  tripId: number,
  checklist: CompositeTrip["checklists"],
) {
  if (!checklist) return;
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const checklistItems = (checklist.items as Partial<ChecklistItem>[]).map(
        (checklistItem) => ({
          id: checklistItem.id || uuidv4(),
          name: checklistItem.name || "",
          checked: Boolean(checklistItem.checked),
          fromTemplateId: checklistItem.fromTemplateId,
        }),
      );
      await supabase.from("checklists").insert({
        trip_id: tripId,
        items: checklistItems,
        created_at: checklist.created_at || new Date().toISOString(),
        updated_at: checklist.updated_at || new Date().toISOString(),
      });
    }
  } catch (error) {
    returnError(
      "There was an error restoring your trips checklist data. Please try again.",
    );
  }
}

async function storeTripExpenses(
  tripId: number,
  expenses: CompositeTrip["expenses"],
) {
  if (!expenses.length) return;
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("expenses").insert(
        expenses.map((expense) => ({
          trip_id: tripId,
          name: expense.name,
          amount: expense.amount,
          date: expense.date,
          payment_method: expense.payment_method,
          category_id: expense.category_id,
          created_at: expense.created_at || new Date().toISOString(),
          updated_at: expense.updated_at || new Date().toISOString(),
        })),
      );
    }
  } catch (error) {
    returnError(
      "There was an error restoring your trips expenses data. Please try again.",
    );
  }
}

export async function submitRestore(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) return;
  if (file.type !== "application/json") {
    returnError("Invalid file type");
  }

  const fileString = await file.text();
  const isValidJson = checkJSONValidity(fileString);
  if (!isValidJson) {
    returnError("Invalid JSON file");
  }

  const tripData = validateTripData(fileString);
  if (!tripData) {
    returnError("Invalid trip data");
    return;
  }

  const storedTrips = await Promise.all(
    tripData.slice(2, 4).map(async (trip) => {
      const tripId = await storeTripMetadata(trip);
      if (!tripId) return;
      await storeTripChecklist(tripId, trip.checklists);
      await storeTripExpenses(tripId, trip.expenses);
      return tripId;
    }),
  );
  const storedTripsCount = storedTrips.filter(Boolean).length;

  redirect(
    `/settings?success=${encodeURIComponent(
      `${storedTripsCount} trips restored successfully`,
    )}`,
  );
}
