import dayjs from "dayjs";

export default function DateInput({
  defaultValue = dayjs().format("YYYY-MM-DDTHH:mm"),
}: {
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1 rounded-lg p-2 ring-1 ring-tertiary">
      <label
        htmlFor="expenseDate"
        className="font-display text-sm font-bold text-tertiary"
      >
        Date
      </label>
      <input
        type="datetime-local"
        id="expenseDate"
        name="date"
        defaultValue={defaultValue}
      />
    </div>
  );
}
