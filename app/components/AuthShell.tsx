import Image from "next/image";
import Link from "next/link";

const highlights = [
  "Live prices across every major asset",
  "Portfolio valuation with cost basis and P/L",
  "AI analysis grounded in what you actually hold",
];

/**
 * Shared frame for sign in and sign up: form on the left, a quiet marketing
 * panel on the right that only appears when there is room for it.
 */
export default function AuthShell({
  image,
  children,
}: {
  image: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh bg-canvas lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex flex-col p-6 md:p-10">
        <Link href="/" className="flex w-fit items-center gap-2.5">
          <Image
            src="/logo.png"
            width={26}
            height={26}
            priority
            alt=""
            className="rounded-md"
          />
          <span className="text-base font-semibold tracking-[-0.01em] text-ink">
            CoinVista
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[360px]">{children}</div>
        </div>

        <p className="text-xs text-ink-subtle">
          © {new Date().getFullYear()} CoinVista
        </p>
      </div>

      <div className="relative hidden overflow-hidden border-l border-line lg:block">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        {/* A flat scrim, not a decorative gradient wash — it exists so the
            copy below stays legible over any photograph. */}
        <div className="absolute inset-0 bg-[#0a0c10]/72" />

        <div className="absolute inset-x-0 bottom-0 p-10">
          <p className="max-w-[24ch] text-3xl font-semibold leading-tight tracking-[-0.02em] text-white">
            Every position, priced in real time.
          </p>
          <ul className="mt-6 space-y-2.5">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                <span className="mt-[7px] size-1 shrink-0 rounded-full bg-white/50" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
