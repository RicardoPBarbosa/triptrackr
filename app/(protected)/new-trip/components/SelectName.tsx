import Image from "next/image";

import Input from "@/components/Input";
import Button from "@/components/Button";
import { submitNewTrip } from "@/actions";
import { parseURLDate } from "@/utils/helpers";
import { getCountries } from "@/utils/countries";
import useUserClient from "@/hooks/useUserClient";
import useNewEntryForm from "@/hooks/useNewEntryForm";

export default function SelectName() {
  const { loading, user } = useUserClient();
  const { country: countryId, date, name } = useNewEntryForm();
  const country = getCountries().find((c) => c.id === countryId);
  const { startDate, endDate, length } = parseURLDate(date) || {};

  function handleScrollInputToTop(e: React.FocusEvent<HTMLInputElement>) {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  return (
    <form
      action={(formData) => !loading && user?.id && submitNewTrip(formData)}
      className="flex flex-col gap-6 px-3"
    >
      <div className="flex flex-col">
        <h3 className="font-bold text-tertiary">
          Confirm the country and date
        </h3>
        <div className="flex items-center justify-between pt-2">
          {!!country && (
            <div className="flex items-center gap-3">
              <Image
                src={`/assets/countries/${country.flagPath || "DEFAULT.png"}`}
                alt={country.name}
                width={40}
                height={26}
                className="rounded-md"
              />
              <span className="font-display">{country.name}</span>
            </div>
          )}
          {!!date && (
            <div className="flex flex-col items-end">
              <span>{`${startDate?.format("DD MMM YYYY") || ""}${
                endDate ? ` - ${endDate.format("DD MMM YYYY")}` : ""
              }`}</span>
              <span className="text-sm text-gray-400">{`${length} day trip`}</span>
            </div>
          )}
        </div>
      </div>
      <input type="hidden" name="countryId" value={countryId || ""} />
      <input type="hidden" name="date" value={date || ""} />
      <Input
        type="text"
        name="tripName"
        required
        placeholder="Give the trip a name"
        color="tertiary"
        defaultValue={name || ""}
        onFocus={handleScrollInputToTop}
      />
      <Button color="tertiary" type="submit">
        Add new trip
      </Button>
    </form>
  );
}
