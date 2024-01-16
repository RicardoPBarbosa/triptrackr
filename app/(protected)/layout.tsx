import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import useUser from "@/hooks/useUser";
import Navigation from "@/components/Navigation";
const ToastMessages = dynamic(() => import("@/components/ToastMessages"));

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await useUser();

  if (!user) {
    return redirect("/login");
  }
  return (
    <>
      {children}
      <Navigation />
      <ToastMessages />
    </>
  );
}
