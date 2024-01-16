import type { FC, ReactNode } from "react";
import { createElement } from "react";
import type { IconProps } from "iconsax-react";
import type { ThemeColorsKeys } from "@/@types";
import { twMerge } from "tailwind-merge";

const textColors: { [key in ThemeColorsKeys]: string } = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  inherit: "text-white",
  danger: "text-red-500",
};

type Props = {
  icon: FC;
  label: ReactNode;
  value?: ReactNode;
  color?: ThemeColorsKeys;
  valueComponent?: ReactNode;
};

export default function ReviewInfoCard({
  icon,
  label,
  value,
  color = "primary",
  valueComponent,
}: Props) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex items-center gap-2 border-b border-gray-500 pb-2">
        <span className="rounded-md bg-background-light p-2 text-gray-400">
          {createElement<IconProps>(icon, { size: 26 })}
        </span>
        <span className="font-display font-light leading-5">{label}</span>
      </div>
      {valueComponent || (
        <p
          className={twMerge(
            "flex-1 pt-1 text-center text-2xl tracking-wide",
            textColors[color],
          )}
        >
          {value}
        </p>
      )}
    </div>
  );
}
