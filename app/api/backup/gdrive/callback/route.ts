/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Readable } from "stream";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { OAuth2Client } from "google-auth-library";

import { createClient } from "@/utils/supabase/server";

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI,
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (code) {
    let error: string | undefined;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
      const drive = google.drive({
        version: "v3",
        // @ts-ignore
        auth: oauth2Client,
      });
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      const { data } = await supabase.from("trips").select(
        `
            *,
            checklists(*),
            expenses(*)
          `,
      );
      const jsonStream = new Readable();
      jsonStream.push(JSON.stringify(data));
      jsonStream.push(null);

      const fileMetadata = {
        name: `triptrackr-backup-${new Date().getTime()}.json`,
        mimeType: "application/json",
      };
      const media = {
        mimeType: "application/json",
        body: jsonStream,
        name: `triptrackr-backup-${new Date().toISOString()}.json`,
      };
      const uploadResponse = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
      });

      if (uploadResponse.status !== 200) {
        error = uploadResponse.statusText;
      }
    } catch (error) {
      redirect(
        `/settings?error=${encodeURIComponent((error as Error).message)}`,
      );
    }

    if (!error) {
      redirect(
        `/settings?success=${encodeURIComponent(
          "Export uploaded to your Drive successfully",
        )}`,
      );
    }

    redirect(`/settings?error=${encodeURIComponent(error)}`);
  }

  redirect(
    `/settings?error=${encodeURIComponent(
      "Could not retrieve a code from Google. Please try again.",
    )}`,
  );
}
