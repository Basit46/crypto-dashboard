"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LucideEye, LucideEyeOff, LucideLoaderCircle } from "lucide-react";

const signupSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type SignupSchema = z.infer<typeof signupSchema>;

export default function SignupForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({ resolver: zodResolver(signupSchema) });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SignupSchema) => {
      const res = await axiosInstance.post("/signup", data);
      return res.data;
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      setServerError(
        error.response?.data?.error ?? "Something went wrong. Please try again."
      );
    },
    onSuccess: () => router.push("/auth/signin"),
  });

  const onSubmit = (data: SignupSchema) => {
    setServerError("");
    mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col", className)}
      {...props}
    >
      <h1 className="text-2xl font-semibold tracking-[-0.02em] text-ink">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-ink-muted">
        Track holdings, follow assets, and get analysis on what you own.
      </p>

      <div className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-neg">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="pr-10"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-ink-subtle transition-colors hover:text-ink"
            >
              {showPassword ? (
                <LucideEyeOff className="size-4" />
              ) : (
                <LucideEye className="size-4" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs text-neg">{errors.password.message}</p>
          ) : (
            <p className="text-xs text-ink-subtle">At least 6 characters.</p>
          )}
        </div>

        {serverError ? (
          <p className="rounded-lg border border-neg-border bg-neg-soft px-3 py-2 text-sm text-neg">
            {serverError}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <LucideLoaderCircle className="animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="font-medium text-accent underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
