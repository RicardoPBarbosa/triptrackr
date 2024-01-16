import { Add } from "iconsax-react";
import { useEffect, type ReactNode } from "react";
import type { Variants } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";

import Button from "./Button";
import type { ThemeColorsKeys } from "@/@types";

const slideInUp: Variants = {
  hidden: {
    opacity: 0,
    y: "100%",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "just",
      duration: 0.2,
      stiffness: 50,
    },
  },
  exit: {
    opacity: 0,
    y: "100%",
  },
};

type Props = {
  children: ReactNode;
  open: boolean;
  close: () => void;
  submitLabel?: string;
  submit?: () => void;
  submitButtonColor?: ThemeColorsKeys;
};

export default function FullscreenModal({
  children,
  open,
  close,
  submitLabel,
  submit,
  submitButtonColor,
}: Props) {
  // * in case the UX is bad on desktop, for mobile it's better if we keep the scroll position so when leaving the modal we can go back to the same position
  useEffect(() => {
    if (open) {
      document.body.style.position = "fixed";
      document.body.style.overflowY = "scroll";
    } else {
      document.body.style.position = "static";
      document.body.style.overflowY = "unset";
    }

    return () => {
      document.body.style.position = "static";
      document.body.style.overflowY = "unset";
    };
  }, [open]);

  return (
    <AnimatePresence initial={false} mode="wait">
      {open && (
        <motion.div
          variants={slideInUp}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="top-padding fixed left-0 top-0 z-50 h-screen w-full bg-background px-4 pb-20"
        >
          <div className="flex h-full flex-col pb-20">{children}</div>
          <div className="fixed bottom-16 left-0 flex h-20 w-full items-end gap-4 px-3 pb-4">
            <Button
              color="inherit"
              variant="outlined"
              onClick={close}
              className="flex-1"
            >
              <div className="flex items-center justify-center">
                <Add className="rotate-45" size={28} />{" "}
                <span className="font-normal">Close</span>
              </div>
            </Button>
            {submit && (
              <Button
                color={submitButtonColor || "primary"}
                onClick={submit}
                className="flex-1"
              >
                {submitLabel || "Save"}
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
