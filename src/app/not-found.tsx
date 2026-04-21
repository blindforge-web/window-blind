import Link from "next/link";
import { SiteHeader } from "@/components/navigation/site-header";

export default async function NotFound() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
          404
        </p>
        <h1 className="mt-4 font-display text-7xl leading-none">
          This page does not exist.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
          The page may have been removed, renamed, or never published from the
          admin dashboard.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="rounded-full bg-[var(--color-primary)] px-6 py-4 text-sm font-semibold text-white"
          >
            Return home
          </Link>
        </div>
      </main>
    </div>
  );
}
