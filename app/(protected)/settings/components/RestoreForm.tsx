"use client";

import { DocumentUpload } from "iconsax-react";

import { submitRestore } from "@/actions";
import { SettingContent } from "./SettingsGroup";

export default function RestoreForm() {
  function handleRestoreRequest() {
    if (
      confirm(
        "Make sure you are not importing repeated trips. They will be duplicated.",
      )
    ) {
      document.getElementById("restoreFile")?.click();
    }
  }

  function handleFormSubmit() {
    const formElement = document.getElementById("restoreForm") as
      | HTMLFormElement
      | undefined;
    if (formElement) {
      formElement.submit();
    }
  }

  return (
    <form id="restoreForm" action={submitRestore}>
      <button
        type="button"
        className="group flex h-14 w-full cursor-pointer items-center gap-2 rounded-lg tracking-wide transition-all disabled:bg-background-paper disabled:text-gray-400"
        onClick={handleRestoreRequest}
      >
        <SettingContent icon={<DocumentUpload size={26} variant="Bold" />}>
          Restore from file
        </SettingContent>
      </button>
      <input
        id="restoreFile"
        hidden
        type="file"
        accept="application/json"
        name="file"
        onChange={handleFormSubmit}
      />
    </form>
  );
}
