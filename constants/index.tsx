import {
  Airplane,
  Building4,
  Car,
  Card,
  Coffee,
  Cup,
  EmojiHappy,
  Gift,
  Money2,
  Send,
  ShoppingCart,
  Ticket,
} from "iconsax-react";

import type { ExpenseCategory, PaymentMethodIcon } from "@/@types";

export const PER_PAGE = 4;

export const ROUTE_DATE_FORMAT = "MM/DD/YYYY";
export const DATABASE_DATE_FORMAT = "YYYY-MM-DD";

export const MAX_INITIAL_COUNTRIES = 5;
export const SHOW_ALL_ID = "all";

export const DEFAULT_FLAG_PATH = "DEFAULT.png";

const iconVariant = "Bold";
export const expenseCategories: ExpenseCategory[] = [
  {
    id: "oGt6BfARXR",
    name: "General",
    color: "#9CA3AF",
  },
  {
    id: "WKD0umXwGE",
    name: "Food & Drinks",
    icon: ({ color, size }) => (
      <Coffee color={color} size={size} variant={iconVariant} />
    ),
    color: "#E86B3B",
  },
  {
    id: "j0CETLh6CE",
    name: "Flight",
    icon: ({ color, size }) => (
      <Airplane color={color} size={size} variant={iconVariant} />
    ),
    color: "#F99C4F",
  },
  {
    id: "dQQervnOS1",
    name: "Accommodation",
    icon: ({ color, size }) => (
      <Building4 color={color} size={size} variant={iconVariant} />
    ),
    color: "#31C6DA",
  },
  {
    id: "3pfRrs6MEt",
    name: "Transportation",
    icon: ({ color, size }) => (
      <Car color={color} size={size} variant={iconVariant} />
    ),
    color: "#D5DAE0",
  },
  {
    id: "xh90R9Qigp",
    name: "Ticket",
    icon: ({ color, size }) => (
      <Ticket color={color} size={size} variant={iconVariant} />
    ),
    color: "#F87171",
  },
  {
    id: "X5yv4SOxCU",
    name: "Gift",
    icon: ({ color, size }) => (
      <Gift color={color} size={size} variant={iconVariant} />
    ),
    color: "#6366F1",
  },
  {
    id: "2yON97rERg",
    name: "Shopping",
    icon: ({ color, size }) => (
      <ShoppingCart color={color} size={size} variant={iconVariant} />
    ),
    color: "#CA8A04",
  },
  {
    id: "xmnOVJd8mC",
    name: "Entertainment",
    icon: ({ color, size }) => (
      <EmojiHappy color={color} size={size} variant={iconVariant} />
    ),
    color: "#16A34A",
  },
  {
    id: "RPR1jVtpYs",
    name: "Activity",
    icon: ({ color, size }) => (
      <Cup color={color} size={size} variant={iconVariant} />
    ),
    color: "#0284C7",
  },
];

export const ratings = [
  "Terrible",
  "Bad",
  "Disappointment",
  "Meh",
  "OK",
  "Good",
  "Very Good",
  "Wow",
  "Amazing",
  "Unbelievable",
];

export const paymentMethodsIcons: PaymentMethodIcon = {
  card: ({ color, size, variant = iconVariant }) => (
    <Card color={color} size={size} variant={variant} />
  ),
  cash: ({ color, size, variant = iconVariant }) => (
    <Money2 color={color} size={size} variant={variant} />
  ),
  transfer: ({ color, size, variant = iconVariant }) => (
    <Send color={color} size={size} variant={variant} />
  ),
};
