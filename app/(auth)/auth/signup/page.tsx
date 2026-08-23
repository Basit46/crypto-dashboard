import type { Metadata } from "next";
import AuthShell from "@/app/components/AuthShell";
import SignupForm from "@/app/components/Signup-form";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <AuthShell image="/auth-img2.jpg">
      <SignupForm />
    </AuthShell>
  );
}
