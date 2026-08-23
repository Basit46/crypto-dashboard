import Link from "next/link";
import { LucideLock } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shown when a section has rendered but has nothing to show. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-6 py-10 text-center",
        className
      )}
    >
      {Icon ? (
        <div className="mb-1 grid size-9 place-items-center rounded-lg border border-line bg-surface-sunken text-ink-subtle">
          <Icon className="size-[17px]" />
        </div>
      ) : null}
      <p className="text-base font-medium text-ink">{title}</p>
      {description ? (
        <p className="max-w-[34ch] text-sm text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

/** Shown in place of any section that needs an authenticated user. */
export function SignInGate({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-2.5 px-6 py-8 text-center",
        className
      )}
    >
      <div className="grid size-9 place-items-center rounded-lg border border-line bg-surface-sunken text-ink-subtle">
        <LucideLock className="size-[16px]" />
      </div>
      <p className="text-sm text-ink-muted">{label}</p>
      <Link
        href="/auth/signin"
        className="text-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        Sign in to continue
      </Link>
    </div>
  );
}
