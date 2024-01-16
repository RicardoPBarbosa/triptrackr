import { FormSteps } from "@/@types";
import { useSearchParams } from "next/navigation";

export default function useNewEntryForm() {
  const params = useSearchParams();
  const [country, date, name] = [
    params.get("country"),
    params.get("date"),
    params.get("name"),
  ];

  function currentActiveStep(): FormSteps {
    if (!country || date === null) {
      return FormSteps.country;
    }

    if (!date || name === null) {
      return FormSteps.date;
    }

    if (!!country && !!date) {
      return FormSteps.name;
    }

    return FormSteps.country;
  }

  return {
    country,
    date,
    name,
    currentActiveStep: currentActiveStep(),
  };
}
