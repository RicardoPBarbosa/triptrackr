import type { ExpenseCategory } from "@/@types";
import { expenseCategories } from "@/constants";

export default function CategorySelect({
  defaultValue,
}: {
  defaultValue?: ExpenseCategory["id"];
}) {
  return (
    <div className="flex flex-col gap-3">
      <label className="font-display font-bold">Category</label>
      <div className="flex flex-wrap gap-x-2 gap-y-3">
        {expenseCategories.map((category, i) => (
          <div key={category.id} className="radio">
            <input
              hidden
              type="radio"
              name="categoryId"
              id={category.id}
              value={category.id}
              readOnly
              defaultChecked={
                !!defaultValue ? defaultValue === category.id : i === 0
              }
              className="peer"
            />
            <label
              htmlFor={category.id}
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-background-paper px-3 py-2 tracking-wide text-gray-200 transition-colors hover:bg-background-light peer-checked:bg-tertiary peer-checked:text-background"
            >
              {category.icon?.({ size: "20" })}
              <span>{category.name}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
