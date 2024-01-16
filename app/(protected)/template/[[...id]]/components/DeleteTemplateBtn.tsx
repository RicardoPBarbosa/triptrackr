"use client";

import { removeTemplate } from "@/actions";
import Button from "@/components/Button";

export default function DeleteTemplateBtn({
  templateId,
}: {
  templateId: string;
}) {
  return (
    <form
      action={async (formData) => {
        if (confirm("Are you sure?")) {
          removeTemplate(formData);
        }
      }}
      className="border-t border-background py-6 text-center"
    >
      <input type="hidden" name="templateId" value={templateId} />
      <Button color="danger" variant="outlined" className="w-1/2">
        Delete template
      </Button>
    </form>
  );
}
