"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useParams } from "next/navigation";

import { ratings } from "@/constants";
import Modal from "@/components/Modal";
import { updateTrip } from "@/actions";
import Button from "@/components/Button";

function Form({ defaultRating }: { defaultRating: number | null }) {
  const [selectedRating, setSelectedRating] = useState<number>(
    defaultRating || 1,
  );
  const { pending } = useFormStatus();

  return (
    <>
      <span className="rounded-lg border border-white/20 bg-background-paper-light px-3 py-1 font-medium tracking-wide">
        {ratings[selectedRating - 1]}
      </span>
      <div className="relative h-fit w-full">
        <div className="flex w-full flex-col gap-1 sm:justify-center">
          <input
            type="range"
            className="w-full"
            name="rating"
            min="1"
            max="10"
            step="1"
            required
            disabled={pending}
            value={selectedRating}
            onChange={(e) => setSelectedRating(parseInt(e.target.value))}
          />
          <ul className="flex w-full justify-between px-[10px]">
            {ratings.map((_, i) => (
              <li
                key={i}
                className="relative flex h-11 justify-center pt-5 before:absolute before:left-1/2 before:top-2 before:h-2 before:w-0.5 before:-translate-x-1/2 before:bg-gray-600"
                onClick={() => setSelectedRating(i + 1)}
              >
                <span className="absolute text-sm font-medium">{i + 1}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Button
        disabled={pending}
        color="primary"
        type="submit"
        className="h-11 w-1/2"
      >
        Submit
      </Button>
    </>
  );
}

export default function Rating({ rating }: { rating: number | null }) {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="grid h-12 w-12 content-center rounded-lg border border-white/30 bg-white/20 font-body text-lg font-semibold backdrop-blur-sm transition-colors hover:bg-white/30"
        onClick={() => setOpen(true)}
      >
        {rating ? (
          <div className="flex items-end justify-center gap-0.5">
            <span>{rating}</span>
            <span className="text-xs font-normal">/ {ratings.length}</span>
          </div>
        ) : (
          "?"
        )}
      </button>
      <Modal
        title="Rate the trip"
        open={open}
        handleClose={() => setOpen(false)}
      >
        <form
          action={async (data) => {
            await updateTrip(id, data);
            setOpen(false);
          }}
          className="mb-2 flex flex-col items-center gap-5"
        >
          <Form defaultRating={rating} />
        </form>
      </Modal>
    </>
  );
}
