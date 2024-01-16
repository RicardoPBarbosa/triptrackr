import { Suspense } from "react";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { twMerge } from "tailwind-merge";
import type { Metadata, Viewport } from "next";
import { Additem, ArrowForward } from "iconsax-react";

import Input from "@/components/Input";
import { updateTemplate } from "@/actions";
import BackButton from "@/components/BackButton";
import type { TemplateParamProps } from "@/@types";
import { createClient } from "@/utils/supabase/server";
import NewTemplateInput from "./components/NewTemplateInput";
import NewItemInput from "@/components/checklist/NewItemInput";
import ChecklistItem from "@/components/checklist/ChecklistItem";
import { sortAlphabetically } from "@/utils/helpers";
const DeleteTemplateBtn = dynamic(
  () => import("./components/DeleteTemplateBtn"),
);

export const viewport: Viewport = {
  themeColor: "#1B1E21",
};

export async function generateMetadata({
  params,
}: TemplateParamProps): Promise<Metadata> {
  const { id } = params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  if (id) {
    const { data } = await supabase
      .from("checklist_templates")
      .select("*")
      .eq("id", id)
      .single();

    return {
      title: `Triptrackr • Checklist template${
        data?.name ? ` • ${data.name}` : ""
      }`,
    };
  }

  return {
    title: `Triptrackr • New checklist template`,
  };
}

export default async function ChecklistTemplate({
  params: { id },
}: TemplateParamProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("checklist_templates")
    .select("*")
    .eq("id", id || "")
    .single();

  if (!id || !data) {
    return (
      <div className="px-3 pb-32">
        <div className="top-padding flex items-center justify-between pb-3">
          <BackButton />
          <h1 className="text-2xl font-bold">New template</h1>
        </div>
        <NewTemplateInput />
      </div>
    );
  }

  return (
    <div className="px-3 pb-32">
      <div className="top-padding flex items-center justify-between pb-3">
        <BackButton />
        <h1 className="text-2xl font-bold">Edit template</h1>
      </div>
      <form
        action={updateTemplate}
        className="mb-4 flex flex-col gap-1 border-b border-background pb-4"
      >
        <input type="hidden" name="templateId" value={id} />
        <label
          htmlFor="templateName"
          className="font-display text-sm text-primary"
        >
          Template name
        </label>
        <Input
          required
          color="primary"
          id="templateName"
          name="templateName"
          defaultValue={data.name}
          placeholder="e.g.: Underwear for 2 days"
          endIcon={
            <button
              type="submit"
              className="flex rounded-md p-2 ring-1 ring-background-light transition-colors hover:bg-background-light"
            >
              <ArrowForward className="rotate-180" size={22} />
            </button>
          }
        />
      </form>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="templateName"
          className="font-display text-sm text-primary"
        >
          Add items to the template
        </label>
        <NewItemInput templateId={id} />
        {!data.items.length && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Additem size={45} variant="Bulk" className="text-primary" />
            <h2 className="text-lg text-gray-400">Start adding items</h2>
          </div>
        )}
        {!!data.items.length && (
          <div className="px-2 py-2">
            <p className="tracking-wide">{`${data.items.length} items`}</p>
          </div>
        )}
        <div
          className={twMerge(
            "flex flex-col border-background",
            !!data.items.length && "border-t",
          )}
        >
          {data.items.sort(sortAlphabetically).map((itemName, i) => (
            <Suspense key={`${itemName}+${i}`}>
              <ChecklistItem
                templateId={id}
                itemIndex={i}
                itemName={itemName}
              />
            </Suspense>
          ))}
        </div>
      </div>
      <Suspense>
        <DeleteTemplateBtn templateId={id} />
      </Suspense>
    </div>
  );
}
