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
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <label className="space-y-2">
        <span className="text-sm font-semibold">Email address</span>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-semibold">Password</span>
        <input
          type="password"
          name="password"
          required
          className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
        />
      </label>
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
      <SubmitButton label="Sign in" pendingLabel="Signing in..." />
    </form>
  );
}
