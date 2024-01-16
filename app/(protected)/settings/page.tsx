import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GoogleDrive, Logout, Mobile, UserSquare } from "iconsax-react";

import useUser from "@/hooks/useUser";
import Button from "@/components/Button";
import { createClient } from "@/utils/supabase/server";
import RestoreForm from "./components/RestoreForm";
import { SettingsAnchor, SettingContent } from "./components/SettingsGroup";

function splitName(name: string) {
  const [first, ...rest] = name.split(" ");
  return [first, rest.join(" ")];
}

export default async function Settings() {
  const { user } = await useUser();

  if (!user) {
    return redirect("/login");
  }

  async function signOut() {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
    return redirect("/login");
  }

  return (
    <div className="pb-32">
      <div className="top-padding relative flex flex-col items-center bg-background-paper px-3">
        <h1 className="font-body text-lg font-semibold tracking-widest">
          SETTINGS
        </h1>
        <div className="my-8 flex w-full items-center justify-between px-4">
          <div className="flex items-center gap-1">
            <UserSquare variant="Bulk" size={48} />
            <h2 className="flex flex-1 flex-col gap-1 font-bold leading-none">
              {splitName(user.user_metadata["name"] || "").map((s) => (
                <span key={s}>{s}</span>
              ))}
            </h2>
          </div>
          <form action={signOut}>
            <Button
              type="submit"
              color="primary"
              className="h-12"
              variant="outlined"
              startIcon={<Logout size={30} />}
            >
              Log out
            </Button>
          </form>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-2 px-3">
        <h3 className="text-lg font-bold capitalize text-primary">Backup</h3>
        <div className="flex flex-col gap-3">
          <SettingsAnchor href="api/backup/gdrive">
            <SettingContent icon={<GoogleDrive size={26} variant="Bold" />}>
              Backup to Google Drive
            </SettingContent>
          </SettingsAnchor>
          <SettingsAnchor href="api/backup/device">
            <SettingContent icon={<Mobile size={26} variant="Bold" />}>
              Backup to your device
            </SettingContent>
          </SettingsAnchor>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-2 px-3">
        <h3 className="text-lg font-bold capitalize text-primary">Restore</h3>
        <RestoreForm />
      </div>
    </div>
  );
}
