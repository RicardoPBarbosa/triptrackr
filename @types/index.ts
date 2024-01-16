import type { ReactElement } from "react";
import type { IconProps } from "iconsax-react";
import type { Database } from "@/utils/supabase/types";

export * from "./routes";

export function fixOneToOne<T>(objectOrNull?: T[]): T | null {
  return (objectOrNull as T) || null;
}

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export interface ExpenseCategory {
  id: string;
  name: string;
  icon?: (props: IconProps) => ReactElement;
  color: string;
}

export enum PaymentMethodType {
  CASH = "cash",
  CARD = "card",
  TRANSFER = "transfer",
}
export type PaymentMethodIcon = {
  [key in PaymentMethodType]: (props: IconProps) => ReactElement;
};

export interface Country {
  id: string;
  name: string;
  continent: string;
  flagPath: string;
}

export interface ChecklistItem {
  id?: string;
  name: string;
  checked: boolean;
  fromTemplateId?: string;
}

export enum FormSteps {
  country = "country",
  date = "date",
  name = "name",
}

export type ThemeColorsKeys =
  | "primary"
  | "secondary"
  | "tertiary"
  | "inherit"
  | "danger";

export type Trip = Database["public"]["Tables"]["trips"]["Row"];
export type Template =
  Database["public"]["Tables"]["checklist_templates"]["Row"];
export type Expense = Database["public"]["Tables"]["expenses"]["Row"];
export type Checklist = Database["public"]["Tables"]["checklists"]["Row"];

export type ExpensesByDay = { [key: number]: Expense[] };

export type CompositeTrip = Optional<
  Trip,
  "created_at" | "id" | "updated_at" | "user_id" | "cover" | "notes" | "rating"
> & {
  expenses: Optional<Expense, "created_at" | "updated_at" | "trip_id" | "id">[];
  checklists: Optional<
    Checklist,
    "created_at" | "updated_at" | "trip_id"
  > | null;
};
