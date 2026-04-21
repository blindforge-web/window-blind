"use client";

import { useActionState } from "react";
import { signInAdmin } from "@/app/actions";
import { SubmitButton } from "@/components/store/submit-button";
import { initialAdminAuthState } from "@/lib/action-states";

export function AdminLoginForm() {
  const [state, formAction] = useActionState(signInAdmin, initialAdminAuthState);

  return (
    <form action={formAction} className="space-y-5">
      <label className="space-y-2">
        <span className="text-sm font-semibold">Admin email</span>
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
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {state.message}
        </div>
      ) : null}
      <SubmitButton label="Open dashboard" pendingLabel="Signing in..." />
    </form>
  );
}
