import { Suspense } from "react";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { Additem } from "iconsax-react";
import { twMerge } from "tailwind-merge";
import { notFound } from "next/navigation";
import type { Metadata, Viewport } from "next";

import useUser from "@/hooks/useUser";
import BackButton from "@/components/BackButton";
import { createClient } from "@/utils/supabase/server";
import NewItemInput from "@/components/checklist/NewItemInput";
import {
  fixOneToOne,
  type ChecklistItem as ChecklistItemType,
  type TripDetailsParamProps,
} from "@/@types";
import { sortAlphabetically } from "@/utils/helpers";
const ChecklistItem = dynamic(
  () => import("@/components/checklist/ChecklistItem"),
);

const Templates = dynamic(() => import("./components/Templates"));
const RemoveAll = dynamic(() => import("./components/RemoveAll"));
const CopyToClipboard = dynamic(() => import("./components/CopyToClipboard"));

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
    title: `Triptrackr • ${data?.title || ""} • Checklist`,
  };
}

export default async function Checklist({
  params: { id },
}: TripDetailsParamProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { user } = await useUser();
  const { data } = await supabase
    .from("trips")
    .select(
      `
      title,
      checklists(
        items
      )
    `,
    )
    .eq("id", id)
    .single();
  const { data: templates } = await supabase
    .from("checklist_templates")
    .select("*")
    .eq("user_id", user?.id || "");

  if (!data) {
    return notFound();
  }
  const checklistItems = (
    (fixOneToOne(data?.checklists)?.items as ChecklistItemType[] | undefined) ||
    []
  ).sort((a, b) => sortAlphabetically(a.name, b.name));

  return (
    <div className="px-3 pb-32">
      <div className="top-padding flex items-center justify-between pb-3">
        <BackButton />
        <div className="text-right">
          <p className="font-display text-sm text-gray-400">{data.title}</p>
          <h1 className="text-3xl">Checklist</h1>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1 font-display leading-tight">
          <p className="text-primary">Add items from a template</p>
          <p>or add new items below</p>
        </div>
        <Suspense>
          <Templates tripId={id} templates={templates} />
        </Suspense>
      </div>
      <NewItemInput tripId={id} />
      {!checklistItems.length && (
        <div className="flex flex-col items-center gap-3 py-10">
          <Additem size={45} variant="Bulk" className="text-primary" />
          <h2 className="text-lg text-gray-400">Start adding items</h2>
        </div>
      )}
      {!!checklistItems.length && (
        <div className="flex items-center justify-between px-2 py-3">
          <p className="tracking-wide">{`${
            checklistItems.filter((it) => it.checked).length
          } / ${checklistItems.length} items done`}</p>
          <RemoveAll tripId={id} />
        </div>
      )}
      <div
        className={twMerge(
          "flex flex-col border-background",
          !!checklistItems.length && "border-t",
        )}
      >
        {checklistItems.map((item) => (
          <Suspense key={item.id}>
            <ChecklistItem
              tripId={id}
              item={item}
              templateName={
                (!!templates && !!item.fromTemplateId
                  ? templates?.find((t) => t.id === item.fromTemplateId)
                  : undefined
                )?.name
              }
            />
          </Suspense>
        ))}
        {!!checklistItems.length && (
          <Suspense>
            <CopyToClipboard items={checklistItems.map((it) => it.name)} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
