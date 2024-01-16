import { twMerge } from "tailwind-merge";
import type { ReactNode, InputHTMLAttributes } from "react";

import type { ThemeColorsKeys } from "@/@types";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  iconClassName?: string;
  color?: ThemeColorsKeys;
};

const inputColors: { [key in ThemeColorsKeys]: string } = {
  inherit: "ring-white",
  primary: "ring-primary",
  secondary: "ring-secondary",
  tertiary: "ring-tertiary",
  danger: "ring-red-500",
};

const iconColors: { [key in ThemeColorsKeys]: string } = {
  inherit: "peer-focus:text-white",
  primary: "peer-focus:text-primary",
  secondary: "peer-focus:text-secondary",
  tertiary: "peer-focus:text-tertiary",
  danger: "peer-focus:text-red-500",
};

export default function Input({
  startIcon,
  endIcon,
  iconClassName,
  color,
  ...props
}: InputProps) {
  return (
    <div className="relative flex w-full flex-col">
      <input
        {...props}
        className={twMerge(
          "peer h-14 rounded-lg border border-paper bg-background-paper px-4 font-body text-gray-300 outline-none ring-inset ring-gray-300 placeholder:font-light focus:ring-1",
          props.className,
          color && inputColors[color],
          startIcon && "pl-11",
          endIcon && "pr-14",
        )}
      />
      {!!startIcon && (
        <span
          className={twMerge(
            "absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors",
            color && iconColors[color],
            iconClassName,
          )}
        >
          {startIcon}
        </span>
      )}
      {!!endIcon && (
        <span
          className={twMerge(
            "absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 transition-colors",
            color && iconColors[color],
            iconClassName,
          )}
        >
          {endIcon}
        </span>
      )}
    </div>
  );
}
