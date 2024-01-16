"use client";

import { Edit2 } from "iconsax-react";
import { useEffect, useState } from "react";

import type { Trip } from "@/@types";
import { updateTrip } from "@/actions";
import FullscreenModal from "@/components/FullscreenModal";

export default function AddNotes({ trip }: { trip: Trip }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(trip.notes || "");

  useEffect(() => {
    if (!open) {
      // reset field when closing modal
      setNotes(trip.notes || "");
    }
  }, [open, trip.notes]);

  async function handleSubmit() {
    const formData = new FormData();
    formData.append("notes", notes);
    await updateTrip(`${trip.id}`, formData);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-3 text-gray-400 transition-colors hover:text-gray-300"
      >
        <Edit2 size={30} />
      </button>
      <FullscreenModal
        open={open}
        close={() => setOpen(false)}
        submit={handleSubmit}
        submitButtonColor="secondary"
      >
        <h1 className="mb-3 text-2xl">
          <span className="font-light text-gray-400">Trip notes •</span>{" "}
          <span className="font-bold">{trip.title}</span>
        </h1>
        <textarea
          autoFocus
          onChange={(e) => setNotes(e.target.value)}
          className="flex-1 resize-none rounded-lg bg-transparent p-2 outline-none ring-2 ring-background-paper-light focus:ring-secondary"
          placeholder="Say what's in your mind about this trip"
        >
          {notes}
        </textarea>
      </FullscreenModal>
    </>
  );
}
