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
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <label className="space-y-2">
        <span className="text-sm font-semibold">Full name</span>
        <input
          type="text"
          name="fullName"
          required
          className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-semibold">Email address</span>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Password</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Confirm password</span>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={8}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>
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
      <SubmitButton label="Create account" pendingLabel="Creating..." />
    </form>
  );
}
