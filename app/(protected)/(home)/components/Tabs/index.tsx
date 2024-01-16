"use client";

import dynamic from "next/dynamic";
import { twMerge } from "tailwind-merge";
import React, { Suspense, useState } from "react";

const Upcoming = dynamic(() => import("./Upcoming"));
const Finished = dynamic(() => import("./Finished"));

export default function Tabs({
  upcoming,
  finished,
}: {
  upcoming: number;
  finished: number;
}) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "finished">(
    "finished",
  );

  return (
    <>
      <div className="mx-auto mb-6 flex max-w-xs flex-col gap-5">
        <div className="flex items-center">
          <button
            className="flex flex-1 flex-col items-center gap-1"
            onClick={() => setActiveTab("upcoming")}
          >
            <span className="text-2xl font-bold text-tertiary">{upcoming}</span>
            <span className="font-display text-sm text-gray-200">Upcoming</span>
          </button>
          <button
            className="flex flex-1 flex-col items-center gap-1"
            onClick={() => setActiveTab("finished")}
          >
            <span className="text-2xl font-bold text-primary">{finished}</span>
            <span className="font-display text-sm text-gray-200">Finished</span>
          </button>
        </div>
        <div className="relative h-[3px] w-full rounded-sm bg-background-paper">
          <div
            className={twMerge(
              "absolute -top-[2px] left-0 h-[calc(100%+3px)] w-1/2 rounded-md bg-primary transition-all",
              activeTab === "upcoming"
                ? "translate-x-0 bg-tertiary"
                : "translate-x-full bg-primary",
            )}
          />
        </div>
      </div>
      {activeTab === "upcoming" && (
        <Suspense>
          <Upcoming />
        </Suspense>
      )}
      {activeTab === "finished" && (
        <Suspense>
          <Finished />
        </Suspense>
      )}
    </>
  );
}
