import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";

export default function useUserClient() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();

      setUser(data.user);
      setLoading(false);
    }
    getUser();
  }, [supabase.auth]);

  return { user, loading };
}
