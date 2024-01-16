import { twMerge } from "tailwind-merge";
import { ArrowRight2 } from "iconsax-react";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type SettingContentProps = {
  icon: ReactNode;
  children: ReactNode;
};

function SettingContent({ icon, children }: SettingContentProps) {
  return (
    <>
      <div className="grid h-14 w-14 place-content-center rounded-lg bg-background-paper text-gray-300 transition-all group-hover:bg-background-paper-light group-hover:text-gray-100">
        {icon}
      </div>
      <span className="flex-1 text-left">{children}</span>
      <ArrowRight2
        size={22}
        className="transition-all group-hover:translate-x-1"
      />
    </>
  );
}

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

function SettingsAnchor({ children, ...anchorProps }: AnchorProps) {
  return (
    <a
      {...anchorProps}
      className={twMerge(
        `group flex h-14 items-center gap-2 rounded-lg tracking-wide transition-all disabled:bg-background-paper disabled:text-gray-400`,
        anchorProps.className,
      )}
    >
      {children}
    </a>
  );
}

export { SettingsAnchor, SettingContent };
