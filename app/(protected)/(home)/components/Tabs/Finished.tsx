"use client";

import Link from "next/link";
import { useState } from "react";
import { GlobalSearch, SearchNormal1 } from "iconsax-react";

import type { Trip } from "@/@types";
import Button from "@/components/Button";
import useApiQuery from "@/hooks/useApiQuery";
import useListingSize from "@/hooks/useListingSize";
import TripListItem from "@/components/TripListItem";
import LoadMoreTrigger from "@/components/LoadMoreTrigger";
import Skeleton from "./Skeleton";

export default function Finished() {
  const [page, setPage] = useState(1);
  const listSize = useListingSize();
  const { data, error, loading } = useApiQuery<{
    trips?: Trip[];
    hasMore: boolean;
  }>(`/api/trips/finished?page=${page}&limit=${listSize}`);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!loading && !data?.trips?.length) {
    return (
      <div className="my-10 px-3 text-center font-display text-xl">
        No trips finished yet <br /> 😢
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-3">
      <div className="flex gap-3">
        <Link href="/search" className="flex-1">
          <Button
            color="inherit"
            disabled={loading}
            variant="outlined"
            className="w-full text-left font-normal disabled:opacity-50"
            startIcon={<SearchNormal1 size={20} />}
            tabIndex={-1}
          >
            Find a trip
          </Button>
        </Link>
        <Link href={`/review/${new Date().getFullYear()}`} className="flex-1">
          <Button
            color="primary"
            disabled={loading}
            variant="outlined"
            className="w-full text-left text-sm font-normal disabled:opacity-50 sm:text-base"
            startIcon={<GlobalSearch size={21} />}
            tabIndex={-1}
          >
            Annual review
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5">
        {loading && <Skeleton size={listSize} />}
        {!loading &&
          data?.trips?.map((trip) => (
            <TripListItem key={trip.id} trip={trip} />
          ))}
      </div>

      <LoadMoreTrigger
        trigger={() => (data?.hasMore ? setPage((prev) => prev + 1) : {})}
      />
    </div>
  );
}
