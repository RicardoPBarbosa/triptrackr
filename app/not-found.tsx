import Link from "next/link";
import { ArrowRight } from "iconsax-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <span className="mb-2 text-5xl">🧭</span>
      <h1 className="mb-4 text-3xl text-gray-300">Page not found</h1>
      <Link href="/" className="group flex items-center gap-2 text-lg">
        <span>Go Home</span>
        <ArrowRight
          size={24}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}
