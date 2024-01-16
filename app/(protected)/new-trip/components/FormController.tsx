"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { ArrowRight } from "iconsax-react";

import { FormSteps } from "@/@types";
import useNewEntryForm from "@/hooks/useNewEntryForm";

const FORM_STEPS = {
  1: FormSteps.country,
  2: FormSteps.date,
  3: FormSteps.name,
} as { [key: number]: FormSteps };

const continueBtnStyles = {
  [FormSteps.country]: "bg-secondary text-white",
  [FormSteps.date]: "bg-tertiary text-background",
  [FormSteps.name]: "",
} as const;

const stepStyles = {
  1: {
    bg: "bg-primary",
    text: "text-background",
    shadow: "shadow-[0_4px_25px_#000] shadow-primary/30",
  },
  2: {
    bg: "bg-secondary",
    text: "text-white",
    shadow: "shadow-[0_4px_25px_#000] shadow-secondary/30",
  },
  3: {
    bg: "bg-tertiary",
    text: "text-background",
    shadow: "shadow-[0_4px_25px_#000] shadow-tertiary/30",
  },
} as { [key: number]: { bg: string; text: string; shadow: string } };

function StepNumber({
  number,
  isActive = false,
}: {
  number: number;
  isActive?: boolean;
}) {
  const styles = stepStyles[number];

  return (
    <div
      className={twMerge(
        "grid h-10 w-10 place-content-center rounded-full bg-background-paper",
        isActive &&
          `h-11 w-11 border-2 border-white/30 ${Object.values(
            styles || {},
          ).join(" ")}`,
      )}
    >
      <p className="font-body text-lg font-bold">{number}</p>
    </div>
  );
}

export default function FormController() {
  const { country, date, currentActiveStep } = useNewEntryForm();
  const canContinue =
    (currentActiveStep === FormSteps.country && !!country) ||
    (currentActiveStep === FormSteps.date && !!date) ||
    (currentActiveStep === FormSteps.name && false); // hide button on the last step

  return (
    <>
      <div className="top-padding new-trip-bg relative mb-16 bg-background-paper px-3 text-center">
        <h1 className="font-body text-lg font-semibold tracking-widest">
          NEW TRIP
        </h1>
        <div className="mt-4 flex h-[103px] justify-evenly rounded-lg border border-background bg-background">
          {Object.entries(FORM_STEPS).map(([number, label]) => (
            <Link
              key={`${number}-${label}`}
              className="flex flex-1 flex-col items-center justify-between py-4 transition-all hover:brightness-150"
              href={{
                query: {
                  country,
                  ...(Number(number) > 1 && !!country && { date }),
                  ...(Number(number) > 2 && !!date && { name: "" }),
                },
              }}
              style={{
                pointerEvents:
                  currentActiveStep === label ||
                  (Number(number) === 2 && !country) ||
                  (Number(number) === 3 && !date)
                    ? "none"
                    : "auto",
              }}
            >
              <StepNumber
                isActive={currentActiveStep === label}
                number={Number(number)}
              />
              <h2 className="text-sm capitalize">{label}</h2>
            </Link>
          ))}
        </div>
      </div>
      {canContinue && (
        <Link
          tabIndex={-1}
          href={{
            query: {
              country,
              date,
              ...(currentActiveStep === FormSteps.date && { name: "" }),
            },
          }}
          className={twMerge(
            "fixed bottom-[105px] left-1/2 z-50 flex h-14 -translate-x-1/2 items-center gap-4 rounded-lg border border-white/30 px-5 font-display transition-all hover:brightness-90",
            continueBtnStyles[currentActiveStep],
          )}
        >
          <span>Continue</span>
          <ArrowRight />
        </Link>
      )}
    </>
  );
}
