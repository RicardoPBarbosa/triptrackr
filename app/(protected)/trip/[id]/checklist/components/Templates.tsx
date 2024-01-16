"use client";

import Link from "next/link";
import { useState } from "react";
import { FolderAdd, FolderOpen, Setting2 } from "iconsax-react";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import type { Template } from "@/@types";
import { handleUseTemplate } from "@/actions";
import { sortAlphabetically } from "@/utils/helpers";

export default function Templates({
  tripId,
  templates,
}: {
  tripId: string;
  templates: Template[] | null;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        color="primary"
        startIcon={<FolderOpen variant="Bulk" size={25} />}
        className="h-12 border-none font-display font-bold"
      >
        Templates
      </Button>
      <Modal
        title="Choose a template"
        open={open}
        handleClose={() => setOpen(false)}
      >
        <div className="flex flex-col gap-2 divide-y divide-background">
          {templates
            ?.sort((a, b) => sortAlphabetically(a.name, b.name))
            .map((template) => (
              <div className="flex items-center gap-3 pt-2" key={template.id}>
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg ring-2 ring-background-paper-light">
                  <span className="text-lg font-semibold leading-none">
                    {template.items.length}
                  </span>
                  <span className="text-xs tracking-wide">items</span>
                </div>
                <p className="flex-1 font-display">{template.name}</p>
                <Button
                  color="primary"
                  className="h-10"
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true);
                    await handleUseTemplate(tripId, template.id);
                    setLoading(false);
                    setOpen(false);
                  }}
                >
                  Use
                </Button>
                <Link href={`/template/${template.id}`}>
                  <Button
                    color="inherit"
                    variant="outlined"
                    className="h-10 px-3 hover:!bg-background-paper-light"
                  >
                    <Setting2 size={22} />
                  </Button>
                </Link>
              </div>
            ))}
        </div>
        <div className="mt-2 border-t border-background pt-4 text-center">
          <Link href="/template">
            <Button
              color="primary"
              tabIndex={-1}
              variant="outlined"
              startIcon={<FolderAdd variant="Bulk" />}
            >
              Add a new template
            </Button>
          </Link>
        </div>
      </Modal>
    </>
  );
}
