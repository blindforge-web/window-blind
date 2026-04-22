"use client";

import { useActionState } from "react";
import { resetAdminPassword } from "@/app/actions";
import { initialActionFeedbackState } from "@/lib/action-states";
import { SubmitButton } from "@/components/store/submit-button";

export function AdminPasswordResetPanel() {
  const [state, formAction] = useActionState(
    resetAdminPassword,
    initialActionFeedbackState,
  );

  return (
    <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
          Super Admin
        </p>
        <h2 className="font-display text-4xl leading-none">
          Reset an admin password
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
          This uses the Supabase service role on the server. Only admins marked as
          <span className="font-semibold"> super_admin</span> should see or use it.
        </p>
      </div>

      <form action={formAction} className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-semibold">Admin email</span>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-semibold">New password</span>
          <input
            type="password"
            name="password"
            minLength={8}
            required
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>

        {state.message ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm lg:col-span-2 ${
              state.status === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-rose-200 bg-rose-50 text-rose-900"
            }`}
          >
            {state.message}
          </div>
        ) : null}

        <div className="lg:col-span-2">
          <SubmitButton label="Reset password" pendingLabel="Resetting..." />
        </div>
      </form>
    </section>
  );
}
