import Input from "@/components/Input";

export default function AmountInput({
  defaultValue = 0,
}: {
  defaultValue?: number;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1 rounded-lg bg-tertiary/10 p-2">
      <label
        htmlFor="expenseAmount"
        className="font-display text-sm font-bold text-tertiary"
      >
        Amount (€)
      </label>
      <Input
        type="number"
        step="0.01"
        name="amount"
        inputMode="decimal"
        id="expenseAmount"
        defaultValue={defaultValue}
        className="h-12 w-full border-none bg-transparent text-right text-xl font-medium focus:ring-transparent"
      />
    </div>
  );
}
