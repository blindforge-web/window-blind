import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { SiteHeader } from "@/components/navigation/site-header";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";

export default async function AdminLoginPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <section className="rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(160deg,var(--color-primary),color-mix(in_srgb,var(--color-primary)_66%,black_34%))] p-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
            Admin Access
          </p>
          <h1 className="mt-4 font-display text-6xl leading-none">
            Manage products, orders, and store operations.
          </h1>
          <ul className="mt-8 space-y-4 text-sm leading-7 text-white/80">
            <li>Products are the main focus, with simpler listing management.</li>
            <li>Orders move from pending to paid or paid delivered after proof review.</li>
            <li>Store setup covers payment account, delivery states, and contact details.</li>
          </ul>
        </section>

        <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
              Sign In
            </p>
            <h2 className="mt-2 font-display text-5xl leading-none">
              Admin dashboard login
            </h2>
          </div>

          {!hasPublicSupabaseConfig ? (
            <div className="mb-6 rounded-[1.6rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
              Supabase auth keys are not connected yet. Once the environment
              values are present, this route will use live admin authentication.
            </div>
          ) : null}

          <AdminLoginForm />

          <div className="mt-6">
            <Link
              href="/"
              className="text-sm font-semibold text-[var(--color-primary)]"
            >
              Return to website
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
