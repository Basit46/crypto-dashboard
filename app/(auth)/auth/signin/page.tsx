import type { Metadata } from "next";
import AuthShell from "@/app/components/AuthShell";
import { LoginForm } from "@/app/components/Login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell image="/auth-img.jpg">
      <LoginForm />
    </AuthShell>
  );
}
