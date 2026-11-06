import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/components/login-form";
import { requireSession } from "@/shared/auth/session";

export const metadata: Metadata = {
  title: "Login | Sparelay",
};

export default async function LoginPage() {
  if (await requireSession()) redirect("/");
  return <LoginForm />;
}
