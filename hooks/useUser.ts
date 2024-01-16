import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

export default async function useUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
}
