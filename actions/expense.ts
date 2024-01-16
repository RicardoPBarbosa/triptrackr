"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { handleError } from "@/utils/errors";
import { PaymentMethodType } from "@/@types";
import { expenseCategories } from "@/constants";
import { createClient } from "@/utils/supabase/server";

const newExpenseSchema = z.object({
  tripId: z.string().regex(/^\d+$/).transform(Number),
  name: z.string().min(1, "Expense name must be at least 1 character"),
  date: z.string().min(1, "Expense name must be at least 1 character"),
  amount: z
    .string()
    .regex(/[+-]?\d+(\.\d+)?/g)
    .transform(Number),
  categoryId: z
    .string()
    .min(1, "Category must be at least 1 character")
    .refine(
      (cId) => expenseCategories.some((c) => c.id === cId),
      "Selected category is not valid",
    ),
  paymentMethod: z.nativeEnum(PaymentMethodType),
});

export async function newExpense(formData: FormData) {
  const { tripId, name, date, amount, categoryId, paymentMethod } =
    Object.fromEntries(formData.entries());
  let success = false;

  try {
    const parsedData = newExpenseSchema.parse({
      tripId,
      name,
      date,
      amount,
      categoryId,
      paymentMethod,
    });
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("expenses").insert({
        name: parsedData.name,
        date: parsedData.date,
        amount: parsedData.amount,
        category_id: parsedData.categoryId,
        payment_method: parsedData.paymentMethod,
        trip_id: parsedData.tripId,
      });
      success = true;
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      const url = `/trip/${tripId}/expenses`;
      revalidatePath(url);
      redirect(url);
    }
  }
}

const expenseIdSchema = z.object({
  expenseId: z.string().regex(/^\d+$/).transform(Number),
});

export async function editExpense(formData: FormData) {
  const { tripId, expenseId, name, date, amount, categoryId, paymentMethod } =
    Object.fromEntries(formData.entries());
  let success = false;

  try {
    const parsedExpenseId = expenseIdSchema.parse({ expenseId });
    const parsedData = newExpenseSchema.parse({
      tripId,
      name,
      date,
      amount,
      categoryId,
      paymentMethod,
    });
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("expenses")
        .update({
          name: parsedData.name,
          date: parsedData.date,
          amount: parsedData.amount,
          category_id: parsedData.categoryId,
          payment_method: parsedData.paymentMethod,
        })
        .match({ id: parsedExpenseId.expenseId, trip_id: parsedData.tripId });
      success = true;
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      const url = `/trip/${tripId}/expenses`;
      revalidatePath(url);
      redirect(url);
    }
  }
}

export async function removeExpense(formData: FormData) {
  const tripId = formData.get("tripId") as string;
  const expenseId = formData.get("expenseId") as string;
  let success = false;
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const expense = await supabase
        .from("expenses")
        .select("id")
        .eq("id", expenseId)
        .single();
      if (expense.data) {
        await supabase.from("expenses").delete().match({ id: expenseId });
        success = true;
      }
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      const url = `/trip/${tripId}/expenses`;
      revalidatePath(url);
      redirect(url);
    }
  }
}
