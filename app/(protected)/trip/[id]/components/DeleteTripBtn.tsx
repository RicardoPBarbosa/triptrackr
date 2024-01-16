"use client";

import { removeTrip } from "@/actions";
import Button from "@/components/Button";

export default function DeleteTripBtn({ tripId }: { tripId: string }) {
  return (
    <form
      action={async (formData) => {
        if (confirm("Are you sure?")) {
          removeTrip(formData);
        }
      }}
      className="border-t border-background py-6 text-center"
    >
      <input type="hidden" name="tripId" value={tripId} />
      <Button color="danger" variant="outlined" className="w-1/2">
        Delete trip
      </Button>
    </form>
  );
}
