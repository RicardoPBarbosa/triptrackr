"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

import useNewEntryForm from "@/hooks/useNewEntryForm";
import FormController from "./components/FormController";

const SelectCountry = dynamic(() => import("./components/SelectCountry"));
const SelectDate = dynamic(() => import("./components/SelectDate"));
const SelectName = dynamic(() => import("./components/SelectName"));

export default function NewTrip() {
  const { currentActiveStep } = useNewEntryForm();

  return (
    <div className="pb-44">
      <FormController />
      <Suspense>
        {currentActiveStep === "country" && <SelectCountry />}
        {currentActiveStep === "date" && <SelectDate />}
        {currentActiveStep === "name" && <SelectName />}
      </Suspense>
    </div>
  );
}
