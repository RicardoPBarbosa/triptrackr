"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";

import { handleError } from "@/utils/errors";
import { createClient } from "@/utils/supabase/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function deleteCover(tripCover?: string | null) {
  if (tripCover) {
    const publicId = tripCover.split("/").slice(-3).join("/").split(".")[0];
    if (publicId) {
      await cloudinary.uploader.destroy(
        publicId,
        {
          invalidate: true,
        },
        (err) => {
          if (err) throw err;
        },
      );
    }
  }
}

export async function handleCoverUploaded(tripId: string, formData: FormData) {
  const cover = formData.get("cover") as File;
  const arrayBuffer = await cover.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: trip } = await supabase
      .from("trips")
      .select("cover")
      .eq("id", tripId)
      .single();
    if (!trip) throw new Error("Trip not found");

    // remove previous cover if exists
    await deleteCover(trip.cover);

    const data = await new Promise<UploadApiResponse | undefined>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "triptrackr",
              public_id: `covers/${tripId}`,
              overwrite: true,
              invalidate: true,
              resource_type: "image",
              type: "upload",
              allowed_formats: ["jpg", "jpeg", "png", "webp"],
              transformation: [
                { width: 1280, height: 720, crop: "fill" },
                { quality: "auto", fetch_format: "auto" },
              ],
            },
            function (err, result) {
              if (err) return reject(err);
              resolve(result);
            },
          )
          .end(buffer);
      },
    );

    if (data?.secure_url) {
      await supabase
        .from("trips")
        .update({ cover: data.secure_url })
        .eq("id", tripId);

      revalidatePath(`/trip/${tripId}`);
    }
  } catch (error) {
    handleError(error);
  }
}
