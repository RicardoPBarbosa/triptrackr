import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

export const runtime = "edge";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from("trips").select(
    `
        *,
        checklists(*),
        expenses(*)
      `,
  );
  const json = JSON.stringify(data);

  return new Response(json, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename=triptrackr-backup-${new Date().getTime()}.json`,
    },
  });
}
