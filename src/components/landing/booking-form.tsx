"use client";

import { useActionState } from "react";
import { submitOrderRequest } from "@/app/actions";
import { SubmitButton } from "@/components/store/submit-button";
import { initialOfflineOrderState } from "@/lib/action-states";

export function BookingForm({ orderTypes }: { orderTypes: string[] }) {
  const [state, formAction] = useActionState(
    submitOrderRequest,
    initialOfflineOrderState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Full name</span>
          <input
            name="name"
            required
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Phone number</span>
          <input
            name="phone"
            required
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Email address</span>
          <input
            name="email"
            type="email"
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Order type</span>
          <select
            name="orderType"
            defaultValue=""
            required
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          >
            <option value="" disabled>
              Select order type
            </option>
            {orderTypes.map((orderType) => (
              <option key={orderType} value={orderType}>
                {orderType}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-semibold">Address</span>
        <textarea
          name="address"
          required
          rows={3}
          className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-semibold">Description</span>
        <textarea
          name="description"
          required
          rows={5}
          className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
        />
      </label>

      {state.message ? (
        <div
          className={`rounded-[1.6rem] border px-4 py-4 text-sm ${
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          <p>{state.message}</p>
          {state.orderReference ? (
            <p className="mt-1 font-semibold">
              Booking reference: {state.orderReference}
            </p>
          ) : null}
        </div>
      ) : null}

      <SubmitButton
        label="Submit booking"
        pendingLabel="Submitting booking..."
        className="bg-[var(--color-primary)] hover:bg-[var(--color-ink)]"
      />
    </form>
  );
}
