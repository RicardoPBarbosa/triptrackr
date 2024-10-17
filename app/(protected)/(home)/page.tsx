import Image from "next/image";
import { cookies } from "next/headers";

import useUser from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/server";
import Tabs from "./components/Tabs";
import ComingNext from "./components/ComingNext";

export const metadata = {
  title: "Triptrackr • Home",
};

export default async function Home() {
  const { user } = await useUser();
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("upcoming_and_finished")
    .select()
    .eq("user_id", user?.id || "")
    .limit(1)
    .single();
  const { upcoming_trips, finished_trips } = data || {};

  return (
    <div className="pb-32">
      <div className="top-padding home-bg relative mb-28 flex flex-col items-center bg-background-paper px-3">
        <Image src="/assets/logo.svg" alt="Logo" width={112} height={69} />
        <ComingNext />
      </div>
      <Tabs upcoming={upcoming_trips || 0} finished={finished_trips || 0} />
    </div>
  );
}
