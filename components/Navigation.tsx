"use client";

import Link from "next/link";
import type { FC } from "react";
import { createElement } from "react";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";
import type { IconProps } from "iconsax-react";
import { Discover, LocationAdd, Setting2 } from "iconsax-react";

function NavItem({ icon, href }: { icon: FC; href: string }) {
  const pathname = usePathname();
  const isActive =
    href === "/"
      ? pathname === href ||
        pathname.includes("/trip") ||
        pathname.includes("/search")
      : pathname.includes(href);

  return (
    <Link href={href} className="flex flex-col items-center gap-1">
      {createElement<IconProps>(icon, {
        variant: isActive ? "Bold" : "Bulk",
        className: twMerge(
          "transition-colors",
          isActive
            ? "text-secondary overflow-visible [&>path]:drop-shadow-[0_0_5px_rgba(232,107,59,0.30)]"
            : "text-gray-300 hover:text-gray-200",
        ),
        size: isActive ? 30 : 44,
      })}
      {isActive && (
        <span className="h-1 w-1 rounded-full bg-secondary delay-75" />
      )}
    </Link>
  );
}

export default function Navigation() {
  return (
    <div className="fixed bottom-0 left-0 flex w-full justify-center">
      <div className="absolute bottom-0 h-36 w-full bg-gradient-to-t from-background from-5% to-transparent" />
      <div className="relative mb-8 flex h-16 w-fit items-center justify-between gap-11 rounded-2xl border border-paper bg-background-paper px-7">
        <NavItem href="/" icon={Discover} />
        <NavItem href="/new-trip" icon={LocationAdd} />
        <NavItem href="/settings" icon={Setting2} />
      </div>
    </div>
  );
}
