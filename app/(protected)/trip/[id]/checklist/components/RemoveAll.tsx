"use client";

import { Trash } from "iconsax-react";

import { removeAllItems } from "@/actions";

export default function RemoveAll({ tripId }: { tripId: string }) {
  return (
    <button
      onClick={() => {
        if (confirm("Are you sure?")) {
          removeAllItems(tripId);
        }
      }}
      className="flex items-center gap-1 font-display font-bold text-primary transition-colors hover:text-primary/80"
    >
      <Trash size={20} />
      <span className="pt-0.5">Remove all</span>
    </button>
  );
}
