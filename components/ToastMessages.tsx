"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ToastMessages() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const errors = searchParams.get("error");

  useEffect(() => {
    if (errors) {
      errors.split("__").forEach((error) => {
        toast.error(error);
      });
    }
  }, [errors]);

  useEffect(() => {
    if (success) {
      success.split("__").forEach((successMessage) => {
        toast.success(successMessage);
      });
    }
  }, [success]);

  return null;
}
