"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Edit, More, TickSquare, Trash } from "iconsax-react";

import Input from "@/components/Input";
import type { ChecklistItem as ChecklistItemType } from "@/@types";
import {
  removeChecklistItem,
  toggleItemChecked,
  updateChecklistItem,
  updateTemplateItem,
  removeTemplateItem,
} from "@/actions";
import { twMerge } from "tailwind-merge";

type Props =
  | {
      tripId: string;
      item: ChecklistItemType;
      templateName?: string;
    }
  | {
      templateId: string;
      itemIndex: number;
      itemName: string;
    };

export default function ChecklistItem(props: Props) {
  const isTrip = "tripId" in props;
  const [checked, setChecked] = useState(isTrip ? props.item.checked : false);
  const [isEditing, setIsEditing] = useState(false);

  if (isTrip && !props.item.id) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-2 border-b border-background px-1 py-3">
      {!isEditing && (
        <button
          className="grid h-[30px] w-[30px] place-content-center"
          disabled={!isTrip}
          onClick={() => {
            if (isTrip) {
              setChecked(!props.item.checked);
              toggleItemChecked(
                props.tripId,
                props.item.id!,
                !props.item.checked,
              );
            }
          }}
        >
          {checked ? (
            <TickSquare variant="Bold" size={30} className="text-primary" />
          ) : (
            <div
              className={twMerge(
                "h-6 w-6 rounded-md bg-background-paper transition-colors",
                isTrip && "hover:bg-background-light",
              )}
            />
          )}
        </button>
      )}
      {isEditing ? (
        <form
          action={async (formData) => {
            if (isTrip) {
              await updateChecklistItem(formData);
            } else {
              await updateTemplateItem(formData);
            }
            setIsEditing(false);
          }}
          className="w-full"
        >
          <div className="flex-1">
            {isTrip ? (
              <>
                <input type="hidden" name="itemId" value={props.item.id} />
                <input type="hidden" name="tripId" value={props.tripId} />
              </>
            ) : (
              <>
                <input
                  type="hidden"
                  name="templateId"
                  value={props.templateId}
                />
                <input type="hidden" name="itemIndex" value={props.itemIndex} />
              </>
            )}
            <Input
              defaultValue={isTrip ? props.item.name : props.itemName}
              placeholder="e.g.: Underwear for 2 days"
              color="primary"
              autoFocus
              name="itemName"
              required
              endIcon={
                <button
                  type="submit"
                  className="flex transition-opacity hover:opacity-70"
                >
                  <TickSquare variant="Bulk" size={36} />
                </button>
              }
            />
          </div>
        </form>
      ) : (
        <>
          <div className="flex-1">
            <p className="font-display font-semibold">
              {isTrip ? props.item.name : props.itemName}
            </p>
            {isTrip && !!props.templateName && (
              <span className="rounded-md border border-background p-1 text-xs font-light tracking-wide">
                {props.templateName}
              </span>
            )}
          </div>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="rounded-md p-2 transition-colors hover:bg-background-paper">
                <More size={20} />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="mr-3 rounded-lg border border-paper bg-background-paper p-2 shadow-xl">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex w-full items-center gap-2 rounded-md bg-background-paper px-6 py-1.5 text-left font-display outline-none transition-colors hover:bg-background-paper-light/50"
                  >
                    <Edit size={18} />
                    <span className="pt-0.5">Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure?")) {
                        if (isTrip) {
                          removeChecklistItem(props.tripId, props.item.id!);
                        } else {
                          removeTemplateItem(props.templateId, props.itemIndex);
                        }
                      }
                    }}
                    className="flex w-full items-center gap-2 rounded-md bg-red-500/20 px-6 py-1.5 text-left font-display text-red-400 outline-none transition-colors hover:bg-red-500/40"
                  >
                    <Trash size={20} />
                    <span className="pt-0.5">Delete</span>
                  </button>
                </div>
                <Popover.Arrow className="fill-background-paper" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </>
      )}
    </div>
  );
}
