"use client";

import { useActionState } from "react";
import { signUpCustomer } from "@/app/actions";
import { SubmitButton } from "@/components/store/submit-button";
import { initialActionFeedbackState } from "@/lib/action-states";

export function CustomerSignUpForm({
  redirectTo = "/account",
}: {
  redirectTo?: string;
}) {
  const [state, formAction] = useActionState(
    signUpCustomer,
    initialActionFeedbackState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-white/78 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Customer name
        </p>
        <input
          type="text"
          name="fullName"
          required
          placeholder="Full name"
          className="mt-3 w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
        />
      </div>
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-white/78 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Password
          </p>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="mt-3 w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </div>
        <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-white/78 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Confirm password
          </p>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={8}
            className="mt-3 w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </div>
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
      <SubmitButton label="Create customer profile" pendingLabel="Creating profile..." />
    </form>
  );
}
