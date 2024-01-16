import Input from "@/components/Input";

export default function NameInput({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="expenseName" className="font-display font-bold">
        Give a name to the expense
      </label>
      <Input
        placeholder="e.g.: Souvenir"
        id="expenseName"
        name="name"
        color="tertiary"
        defaultValue={defaultValue}
        required
        autoFocus
      />
    </div>
  );
}
