import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import { PER_PAGE } from "@/constants";
import { createClient } from "@/utils/supabase/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const amountToFetch = Number(searchParams.get("page") || 1) * PER_PAGE;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("trips")
    .select("*")
    .gt("start_date", new Date().toISOString())
    .order("start_date", { ascending: true });

  return Response.json({
    data: {
      trips: data?.slice(0, amountToFetch),
      hasMore: (data?.length || 0) > amountToFetch,
    },
  });
}
