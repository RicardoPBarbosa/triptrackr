import type { Country } from "@/@types";
import { MAX_INITIAL_COUNTRIES, SHOW_ALL_ID } from "@/constants";

import data from "./data.json";
import { sortAlphabetically } from "../helpers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateDataFormat(data: any): Country[] {
  if (
    !Array.isArray(data) ||
    !data.length ||
    data.some(
      (row) =>
        typeof row !== "object" ||
        !row.hasOwnProperty("id") ||
        !row.hasOwnProperty("name") ||
        !row.hasOwnProperty("continent") ||
        !row.hasOwnProperty("flagPath"),
    )
  )
    return [];

  return data;
}

function sortObject(obj: { [key: string]: Country[] }): {
  [key: string]: Country[];
} {
  return Object.keys(obj)
    .sort()
    .reduce(
      (result, key) => {
        result[key] = obj[key];
        return result;
      },
      {} as { [key: string]: Country[] },
    );
}

function stringMatch(string: string, substring: string) {
  const split = string.split(" ");
  if (split.length > 1) {
    return split.some((word) =>
      word.toLowerCase().startsWith(substring.toLowerCase()),
    );
  }
  return string.toLowerCase().startsWith(substring.toLowerCase());
}

export function getCountries() {
  return validateDataFormat(data);
}

export function countriesByContinent(
  showAll: { [key: string]: boolean } = {},
  searchQuery: string,
) {
  const countries = getCountries();
  const continents: { [key: string]: Country[] } = {};
  if (!countries?.length) return [];
  countries
    .sort((a, b) => sortAlphabetically(a.name, b.name))
    .forEach((country) => {
      if (
        Object.keys(continents).findIndex((c) => c === country.continent) === -1
      ) {
        continents[country.continent] = [country];
      } else {
        continents[country.continent].push(country);
      }
    });

  const sortedObject = sortObject(continents);

  const sections = Object.entries(sortedObject).map(
    ([continent, countries]) => ({
      title: continent,
      data:
        showAll[continent] || searchQuery.length
          ? countries
          : [
              ...countries.slice(0, MAX_INITIAL_COUNTRIES),
              { id: SHOW_ALL_ID, name: "Show all", continent, flagPath: "" },
            ],
    }),
  );

  if (searchQuery.length) {
    const filteredSections = sections.filter((section) =>
      section.data.some((country) => stringMatch(country.name, searchQuery)),
    );

    return filteredSections.map((section) => ({
      ...section,
      data: section.data.filter((country) =>
        stringMatch(country.name, searchQuery),
      ),
    }));
  }

  return sections;
}
