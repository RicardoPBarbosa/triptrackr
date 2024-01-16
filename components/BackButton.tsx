"use client";

import { ArrowLeft } from "iconsax-react";
import { useRouter } from "next/navigation";

export default function BackButton({ url }: { url?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => (url ? router.replace(url) : router.back())}
      className="group rounded-lg bg-background/20 p-2 backdrop-blur-sm"
    >
      <ArrowLeft
        size={30}
        className="drop-shadow-sm transition-transform group-hover:-translate-x-1"
      />
    </button>
  );
}
