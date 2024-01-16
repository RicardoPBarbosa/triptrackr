"use client";

import { toast } from "sonner";
import { ClipboardText } from "iconsax-react";

import Button from "@/components/Button";

export default function CopyToClipboard({ items }: { items: string[] }) {
  function handleCopyToClipboard() {
    navigator.clipboard.writeText(items.join("\n"));
    toast.success("Copied to clipboard");
  }

  return (
    <Button
      onClick={handleCopyToClipboard}
      color="primary"
      startIcon={<ClipboardText variant="Bulk" size={25} />}
      variant="outlined"
      iconClassName="[position:unset] translate-y-0"
      className="mx-5 my-10 flex items-center justify-center gap-2 font-display tracking-normal"
    >
      Copy list to clipboard
    </Button>
  );
}
