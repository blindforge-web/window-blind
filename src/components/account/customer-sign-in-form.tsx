"use client";

import { useActionState } from "react";
import { signInCustomer } from "@/app/actions";
import { SubmitButton } from "@/components/store/submit-button";
import { initialActionFeedbackState } from "@/lib/action-states";

export function CustomerSignInForm({
  redirectTo = "/account",
}: {
  redirectTo?: string;
}) {
  const [state, formAction] = useActionState(
    signInCustomer,
    initialActionFeedbackState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-white/78 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Email
        </p>
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="mt-3 w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
        />
      </div>
      <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-white/78 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Password
        </p>
        <input
          type="password"
          name="password"
          required
          placeholder="Enter your password"
          className="mt-3 w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
        />
      </div>
      {state.message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          {state.message}
        </div>
      ) : null}
      <SubmitButton label="Continue to account" pendingLabel="Opening account..." />
    </form>
  );
}
