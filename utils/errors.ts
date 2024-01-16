import { z } from "zod";
import { redirect } from "next/navigation";

export function handleError(error: unknown, baseUrl?: string) {
  const base = baseUrl ?? "";
  const paramSymbol = base.includes("?") ? "&" : "?";

  if (error instanceof z.ZodError) {
    return redirect(
      `${base}${paramSymbol}error=${encodeURIComponent(
        error.errors.map((e) => e.message).join("__"),
      )}`,
    );
  } else {
    return redirect(
      `${base}${paramSymbol}error=${encodeURIComponent(
        (error as Error).message,
      )}`,
    );
  }
}
