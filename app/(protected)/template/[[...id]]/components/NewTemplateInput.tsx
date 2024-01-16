"use client";

import { ArrowForward, FolderAdd } from "iconsax-react";

import Input from "@/components/Input";
import { newTemplate } from "@/actions";

export default function NewTemplateInput() {
  return (
    <form action={newTemplate} className="flex flex-col gap-2">
      <label htmlFor="templateName" className="font-display">
        Select a name for the new template
      </label>
      <Input
        placeholder="e.g.: Spring list"
        startIcon={<FolderAdd variant="Bulk" size={25} />}
        id="templateName"
        name="templateName"
        color="primary"
        required
        autoFocus
        className="h-16"
        endIcon={
          <button
            type="submit"
            className="flex rounded-md p-2 ring-1 ring-background-light transition-colors hover:bg-background-light"
          >
            <ArrowForward className="rotate-180" size={22} />
          </button>
        }
      />
    </form>
  );
}
