"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { handleError } from "@/utils/errors";
import { createClient } from "@/utils/supabase/server";

async function getTemplate(
  supabaseInstance: ReturnType<typeof createClient>,
  templateId: string,
) {
  const template = await supabaseInstance
    .from("checklist_templates")
    .select("*")
    .eq("id", templateId)
    .single();

  return template.data;
}

const templateSchema = z.object({
  templateName: z.string().min(1, "Template name must be at least 1 character"),
});

export async function newTemplate(formData: FormData) {
  const templateName = formData.get("templateName") as string;
  let id: string | null = null;
  try {
    const parsedData = templateSchema.parse({ templateName });
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const result = await supabase
      .from("checklist_templates")
      .insert({
        name: parsedData.templateName,
        items: [],
      })
      .select("id")
      .single();
    id = result.data?.id || null;
  } catch (error) {
    handleError(error);
  } finally {
    if (id) {
      redirect(`/template/${id}`);
    }
  }
}

export async function updateTemplate(formData: FormData) {
  const templateId = formData.get("templateId") as string;
  const templateName = formData.get("templateName") as string;
  let success = false;
  try {
    const parsedData = templateSchema.parse({ templateName });
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const template = await getTemplate(supabase, templateId);
    if (template) {
      await supabase
        .from("checklist_templates")
        .update({
          name: parsedData.templateName,
        })
        .eq("id", templateId);
      success = true;
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      revalidatePath(`/template/${templateId}`);
    }
  }
}

export async function removeTemplate(formData: FormData) {
  const templateId = formData.get("templateId") as string;
  let success = false;
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const template = await getTemplate(supabase, templateId);
    if (template) {
      await supabase
        .from("checklist_templates")
        .delete()
        .match({ id: templateId });
      success = true;
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      redirect("/");
    }
  }
}

const templateItemSchema = z.object({
  itemName: z.string().min(1, "Item name must be at least 1 character"),
});

export async function addTemplateItem(formData: FormData) {
  const itemName = formData.get("itemName") as string;
  const templateId = formData.get("templateId") as string;
  let success = false;
  try {
    const parsedData = templateItemSchema.parse({ itemName });
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const template = await getTemplate(supabase, templateId);
    if (template) {
      await supabase
        .from("checklist_templates")
        .update({
          items: [...template.items, parsedData.itemName],
        })
        .eq("id", templateId);
      success = true;
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      revalidatePath(`/template/${templateId}`);
    }
  }
}

export async function updateTemplateItem(formData: FormData) {
  const itemName = formData.get("itemName") as string;
  const itemIndex = formData.get("itemIndex") as string;
  const templateId = formData.get("templateId") as string;
  let success = false;
  try {
    const parsedData = templateItemSchema.parse({ itemName });
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const template = await getTemplate(supabase, templateId);
    if (template) {
      await supabase
        .from("checklist_templates")
        .update({
          items: template.items.map((item, index) =>
            index === Number(itemIndex) ? parsedData.itemName : item,
          ),
        })
        .eq("id", templateId);
      success = true;
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      revalidatePath(`/template/${templateId}`);
    }
  }
}

export async function removeTemplateItem(
  templateId: string,
  itemIndex: number,
) {
  let success = false;
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const template = await getTemplate(supabase, templateId);
    if (template) {
      await supabase
        .from("checklist_templates")
        .update({
          items: template.items.filter((_, index) => index !== itemIndex),
        })
        .eq("id", templateId);
      success = true;
    }
  } catch (error) {
    handleError(error);
  } finally {
    if (success) {
      revalidatePath(`/template/${templateId}`);
    }
  }
}
