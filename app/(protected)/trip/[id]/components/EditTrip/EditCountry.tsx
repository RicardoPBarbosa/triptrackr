import { SearchNormal1 } from "iconsax-react";

import Input from "@/components/Input";
import useCountrySelect from "@/hooks/useCountrySelect";
import CountriesSectionList from "@/components/CountriesSectionList";

type Props = {
  countryId: string;
  setCountryId: (countryId: string) => void;
};

export default function EditCountry({ countryId, setCountryId }: Props) {
  const { searchQuery, setSearchQuery, continents, onShowAll } =
    useCountrySelect();

  return (
    <div className="relative flex h-full flex-col">
      <Input
        type="search"
        placeholder="Search the country by name"
        startIcon={<SearchNormal1 size={20} />}
        color="primary"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="relative mt-2 flex h-[calc(100%-90px)] flex-col overflow-y-auto pb-10">
        <CountriesSectionList
          continents={continents}
          onShowAll={onShowAll}
          countryId={countryId}
          setCountryId={setCountryId}
        />
        {!searchQuery && (
          <div className="fixed bottom-[78px] left-0 z-50 h-10 w-full bg-gradient-to-t from-background to-transparent" />
        )}
      </div>
    </div>
  );
}
