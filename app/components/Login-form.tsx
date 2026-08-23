"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LucideEye, LucideEyeOff, LucideLoaderCircle } from "lucide-react";
import { TOKEN } from "../utils/constant";

const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LoginSchema) => {
      const res = await axiosInstance.post("/signin", data);
      return res.data;
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      setServerError(
        error.response?.data?.error ?? "Something went wrong. Please try again."
      );
    },
    onSuccess: (data) => {
      localStorage.setItem(TOKEN, data.token);
      router.push("/");
    },
  });

  const onSubmit = (data: LoginSchema) => {
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
        Welcome back
      </h1>
      <p className="mt-1.5 text-sm text-ink-muted">
        Sign in to pick up your portfolio where you left it.
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
              autoComplete="current-password"
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
          ) : null}
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
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-medium text-accent underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
