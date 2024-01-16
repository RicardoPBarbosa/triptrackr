import { twMerge } from "tailwind-merge";
import type { ReactNode, ButtonHTMLAttributes } from "react";

import type { ThemeColorsKeys } from "@/@types";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  iconClassName?: string;
  color: ThemeColorsKeys;
  variant?: "contained" | "outlined";
};

const containedColors: { [key in ThemeColorsKeys]: string } = {
  primary: "bg-primary hover:bg-primary/80 text-background",
  secondary: "bg-secondary hover:bg-secondary/80 text-white",
  tertiary: "bg-tertiary hover:bg-tertiary/80 text-background",
  inherit: "bg-inherit hover:bg-inherit/80 text-white",
  danger: "bg-red-500 hover:bg-red-500/80 text-white",
};
const outlinedColors: { [key in ThemeColorsKeys]: string } = {
  primary: "bg-primary/10 border-primary hover:bg-primary/20 text-primary",
  secondary:
    "bg-secondary/10 border-secondary hover:bg-secondary/20 text-secondary",
  tertiary: "bg-tertiary/10 border-tertiary hover:bg-tertiary/20 text-tertiary",
  inherit:
    "bg-background-paper border-paper hover:bg-background-paper/70 text-white",
  danger: "bg-red-500/10 border-red-500 hover:bg-red-500/20 text-red-500",
};

function themeColors(
  color: ThemeColorsKeys,
  variant: "contained" | "outlined",
) {
  if (variant === "contained") {
    return containedColors[color];
  }
  return outlinedColors[color];
}

export default function Button({
  startIcon,
  endIcon,
  iconClassName,
  color,
  variant = "contained",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        `relative h-14 rounded-lg border border-white/30 px-5 font-semibold tracking-wide transition-all disabled:border-transparent disabled:bg-gray-600 disabled:text-gray-500`,
        props.className,
        themeColors(color, variant),
        startIcon && "pl-12",
        endIcon && "pr-14",
      )}
    >
      {!!startIcon && (
        <span
          className={twMerge(
            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
            iconClassName,
          )}
        >
          {startIcon}
        </span>
      )}
      {props.children}
      {!!endIcon && (
        <span
          className={twMerge(
            "absolute right-4 top-1/2 -translate-y-1/2 transition-colors",
            iconClassName,
          )}
        >
          {endIcon}
        </span>
      )}
    </button>
  );
}
