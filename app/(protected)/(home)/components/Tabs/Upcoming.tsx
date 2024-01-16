"use client";

import { useState } from "react";

import type { Trip } from "@/@types";
import useApiQuery from "@/hooks/useApiQuery";
import useListingSize from "@/hooks/useListingSize";
import TripListItem from "@/components/TripListItem";
import LoadMoreTrigger from "@/components/LoadMoreTrigger";
import Skeleton from "./Skeleton";

export default function Upcoming() {
  const listSize = useListingSize();
  const [page, setPage] = useState(1);
  const { data, error, loading } = useApiQuery<{
    trips?: Trip[];
    hasMore: boolean;
  }>(`/api/trips/upcoming?page=${page}&limit=${listSize}`);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!loading && !data?.trips?.length) {
    return (
      <div className="my-10 px-3 text-center font-display text-xl">
        No trips coming up <br /> 😢
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5">
        {loading && <Skeleton size={listSize / 2} />}
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
