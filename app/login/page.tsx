import Image from "next/image";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

import useUser from "@/hooks/useUser";
import Button from "@/components/Button";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Triptrackr • Login",
};

export default async function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const { user } = await useUser();

  if (user) {
    return redirect("/");
  }

  async function signIn() {
    "use server";

    const origin = headers().get("origin");
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect(data.url);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-20 bg-background">
      <Image
        src="/assets/home-logo.svg"
        alt="Logo"
        className="max-w-xs"
        width={320}
        height={190}
      />
      <form
        className="relative flex w-full max-w-xs flex-col justify-center gap-2"
        action={signIn}
      >
        <Button
          color="primary"
          className="hover:!bg-gradient-to-r hover:from-secondary hover:to-tertiary"
        >
          Continue with Google
        </Button>
        {searchParams?.message && (
          <p className="mt-2 w-full rounded-lg bg-background-paper px-1 py-2 text-center text-sm tracking-wide opacity-70">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
