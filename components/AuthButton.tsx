import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import useUser from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const { user } = await useUser();

  async function signOut() {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
    return redirect("/login");
  }

  return user ? (
    <div className="flex flex-col items-center gap-4">
      Hey, {user.email}!
      <form action={signOut}>
        <button className="rounded-md bg-slate-700 px-4 py-2 no-underline hover:bg-slate-600">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="grid h-12 w-full place-content-center rounded-xl border border-primary bg-primary/10 font-medium tracking-wide text-primary no-underline transition-colors hover:bg-primary/20"
    >
      Login
    </Link>
  );
}
