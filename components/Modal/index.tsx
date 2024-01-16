import type { Variants } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Backdrop from "./Backdrop";

const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
  },
};

type Props = {
  open: boolean;
  handleClose: () => void;
  children: ReactNode;
  title?: string;
};

export default function Modal({ open, handleClose, children, title }: Props) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, handleClose]);

  return (
    <AnimatePresence initial={false} mode="wait">
      {open && (
        <Backdrop onClick={handleClose}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-lg bg-background-paper p-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="mb-4 flex w-full items-center justify-between">
              <h1 className="text-xl font-bold">{title || ""}</h1>
              <button
                onClick={handleClose}
                className="flex items-center gap-2 text-sm font-medium tracking-wide text-gray-300 transition-colors hover:text-white"
              >
                <span className="rounded-md bg-background-light p-1.5 text-[0.65rem] font-medium leading-none tracking-wider ring-1 ring-inset ring-gray-500">
                  ESC
                </span>{" "}
                close
              </button>
            </div>
            {children}
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
