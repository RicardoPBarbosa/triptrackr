"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useParams } from "next/navigation";

import { handleCoverUploaded } from "@/actions";
import { twMerge } from "tailwind-merge";

export default function UploadCover() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  return (
    <label
      htmlFor="upload-cover"
      className={twMerge(
        "cursor-pointer rounded-md bg-background/30 p-2 font-display text-xs font-bold leading-none backdrop-blur-md transition-colors hover:bg-background/80",
        loading && "bg-orange-500/30 text-orange-500",
      )}
    >
      <input
        type="file"
        className="hidden"
        id="upload-cover"
        accept="image/*"
        onChange={async (e) => {
          if (e.target.files?.[0]) {
            setLoading(true);
            const formData = new FormData();
            formData.append("cover", e.target.files?.[0]);
            await handleCoverUploaded(id, formData);
            setLoading(false);
            toast.success("Cover uploaded");
          }
        }}
      />
      <span>{loading ? "uploading..." : "upload cover"}</span>
    </label>
  );
}
