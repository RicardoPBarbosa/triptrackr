"use client";

import Button from "@/components/Button";
import { removeExpense } from "@/actions";

export default function DeleteExpenseBtn({
  tripId,
  expenseId,
}: {
  tripId: string;
  expenseId: string;
}) {
  return (
    <form
      action={async (formData) => {
        if (confirm("Are you sure?")) {
          removeExpense(formData);
        }
      }}
      className="border-t border-background py-8 text-center"
    >
      <input type="hidden" name="tripId" readOnly value={tripId} />
      <input type="hidden" name="expenseId" readOnly value={expenseId} />
      <Button color="danger" variant="outlined" className="w-1/2">
        Delete expense
      </Button>
    </form>
  );
}
