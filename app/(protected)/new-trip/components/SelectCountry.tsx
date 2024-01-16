import { SearchNormal1 } from "iconsax-react";

import Input from "@/components/Input";
import useNewEntryForm from "@/hooks/useNewEntryForm";
import useCountrySelect from "@/hooks/useCountrySelect";
import CountriesSectionList from "@/components/CountriesSectionList";

export default function SelectCountry() {
  const { country: selectedCountryId } = useNewEntryForm();
  const { searchQuery, setSearchQuery, continents, onShowAll } =
    useCountrySelect();

  return (
    <div className="flex flex-col px-3">
      <Input
        type="search"
        placeholder="Search the country by name"
        startIcon={<SearchNormal1 size={20} />}
        color="primary"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <CountriesSectionList
        continents={continents}
        onShowAll={onShowAll}
        countryId={selectedCountryId}
      />
    </div>
  );
}
