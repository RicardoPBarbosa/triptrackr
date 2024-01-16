"use server";

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { handleError } from "@/utils/errors";
import type { ChecklistItem } from "@/@types";
import type { Json } from "@/utils/supabase/types";
import { createClient } from "@/utils/supabase/server";

const itemSchema = z.object({
  itemName: z.string().min(1, "Item name must be at least 1 character"),
});

async function getChecklist(
  supabaseInstance: ReturnType<typeof createClient>,
  tripId: string,
) {
  const checklist = await supabaseInstance
    .from("checklists")
    .select("*")
    .eq("trip_id", tripId)
    .single();

  return checklist.data;
}

export async function addChecklistItem(formData: FormData) {
  const itemName = formData.get("itemName") as string;
  const tripId = formData.get("tripId") as string;
  let success = false;
  try {
    const parsedData = itemSchema.parse({ itemName });
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const checklist = await getChecklist(supabase, tripId);
    const newItem: ChecklistItem = {
      id: uuidv4(),
      name: parsedData.itemName,
      checked: false,
    };
    await supabase
      .from("checklists")
      .upsert(
        {
          items: [...(checklist?.items || []), newItem as unknown as Json],
          trip_id: parseInt(tripId),
        },
        { onConflict: "trip_id" },
      )
      .eq("trip_id", tripId);
    success = true;
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      revalidatePath(`/trips/${tripId}/checklist`);
    }
  }
}

export async function updateChecklistItem(formData: FormData) {
  const itemName = formData.get("itemName") as string;
  const itemId = formData.get("itemId") as string;
  const tripId = formData.get("tripId") as string;
  let success = false;
  try {
    const parsedData = itemSchema.parse({ itemName });
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const checklist = await getChecklist(supabase, tripId);
    if (checklist) {
      await supabase
        .from("checklists")
        .update({
          items: (checklist.items as unknown as ChecklistItem[]).map(
            (item): Json => {
              if (item?.id === itemId) {
                return {
                  ...item,
                  name: parsedData.itemName,
                };
              }
              return item as unknown as Json;
            },
          ),
        })
        .eq("trip_id", tripId);
      success = true;
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      revalidatePath(`/trips/${tripId}/checklist`);
    }
  }
}

export async function toggleItemChecked(
  tripId: string,
  itemId: string,
  checked: boolean,
) {
  let success = false;
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const checklist = await getChecklist(supabase, tripId);

    if (checklist) {
      await supabase
        .from("checklists")
        .update({
          items: (checklist.items as unknown as ChecklistItem[]).map(
            (item): Json => {
              if (item?.id === itemId) {
                return {
                  ...item,
                  checked,
                };
              }
              return item as unknown as Json;
            },
          ),
        })
        .eq("trip_id", tripId);
      success = true;
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      revalidatePath(`/trips/${tripId}/checklist`);
    }
  }
}

export async function removeChecklistItem(tripId: string, itemId: string) {
  let success = false;
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const checklist = await getChecklist(supabase, tripId);
    if (checklist) {
      await supabase
        .from("checklists")
        .update({
          items: (checklist.items as unknown as ChecklistItem[]).filter(
            (item) => item?.id !== itemId,
          ) as unknown as Json[],
        })
        .eq("trip_id", tripId);
      success = true;
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      revalidatePath(`/trips/${tripId}/checklist`);
    }
  }
}

export async function removeAllItems(tripId: string) {
  let success = false;
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase
      .from("checklists")
      .update({
        items: [],
      })
      .eq("trip_id", tripId);
    success = true;
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      revalidatePath(`/trips/${tripId}/checklist`);
    }
  }
}

export async function handleUseTemplate(tripId: string, templateId: string) {
  let success = false;
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const checklist = await getChecklist(supabase, tripId);
    const template = await supabase
      .from("checklist_templates")
      .select("*")
      .eq("id", templateId)
      .single();
    const newChecklistItems = (template.data?.items || []).map(
      (item) =>
        ({
          id: uuidv4(),
          name: item,
          checked: false,
          fromTemplateId: templateId,
        }) as ChecklistItem,
    );
    if (template) {
      await supabase
        .from("checklists")
        .upsert(
          {
            items: [
              ...(checklist?.items || []),
              ...(newChecklistItems as unknown as Json[]),
            ],
            trip_id: parseInt(tripId),
          },
          { onConflict: "trip_id" },
        )
        .eq("trip_id", tripId);
      success = true;
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      revalidatePath(`/trips/${tripId}/checklist`);
    }
  }
}
