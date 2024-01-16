"use client";

import { useRef } from "react";
import { Additem, ArrowForward } from "iconsax-react";

import Input from "@/components/Input";
import { addChecklistItem, addTemplateItem } from "@/actions";

type Props = { tripId: string } | { templateId: string };

export default function NewItemInput(props: Props) {
  const ref = useRef<HTMLFormElement>(null);
  const isTrip = "tripId" in props;

  return (
    <form
      ref={ref}
      action={async (formData) => {
        if (isTrip) {
          await addChecklistItem(formData);
        } else {
          await addTemplateItem(formData);
        }
        ref.current?.reset();
      }}
    >
      {isTrip ? (
        <input type="hidden" name="tripId" value={props.tripId} />
      ) : (
        <input type="hidden" name="templateId" value={props.templateId} />
      )}
      <Input
        placeholder="e.g.: Underwear for 2 days"
        startIcon={<Additem variant="Bulk" size={25} />}
        name="itemName"
        color="primary"
        className="h-16"
        required
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
  );
}
