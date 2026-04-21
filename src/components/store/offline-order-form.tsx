"use client";

import { useActionState } from "react";
import { submitOfflineOrder } from "@/app/actions";
import { SubmitButton } from "@/components/store/submit-button";
import { initialOfflineOrderState } from "@/lib/action-states";
import type { DeliveryState, Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function OfflineOrderForm({
  product,
  deliveryStates,
  liveMode,
}: {
  product: Product;
  deliveryStates: DeliveryState[];
  liveMode: boolean;
}) {
  const [state, formAction] = useActionState(
    submitOfflineOrder,
    initialOfflineOrderState,
  );
  const activeStates = deliveryStates.filter((item) => item.isActive);
  const totalAmount = product.salePrice ?? product.basePrice;

  return (
    <form action={formAction} className="space-y-6" encType="multipart/form-data">
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="productSlug" value={product.slug} />
      <input type="hidden" name="productName" value={product.name} />
      <input type="hidden" name="totalAmount" value={totalAmount} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Full name</span>
          <input
            name="customerName"
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
          <span className="text-sm font-semibold">State</span>
          <select
            name="state"
            required
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            defaultValue=""
          >
            <option value="" disabled>
              {activeStates.length
                ? "Choose delivery state"
                : "No delivery states available yet"}
            </option>
            {activeStates.map((item) => (
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold">Delivery address or location</span>
          <textarea
            name="location"
            required
            rows={3}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Width</span>
          <input
            name="width"
            placeholder="e.g. 180cm"
            required
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Height</span>
          <input
            name="height"
            placeholder="e.g. 220cm"
            required
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Quantity</span>
          <input
            name="quantity"
            type="number"
            min="1"
            defaultValue="1"
            required
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Color</span>
          <select
            name="color"
            required
            defaultValue=""
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          >
            <option value="" disabled>
              Choose color
            </option>
            {product.colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Mount type</span>
          <select
            name="mountType"
            required
            defaultValue=""
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          >
            <option value="" disabled>
              Select mount
            </option>
            <option value="Inside mount">Inside mount</option>
            <option value="Outside mount">Outside mount</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Control side</span>
          <select
            name="controlSide"
            required
            defaultValue=""
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          >
            <option value="" disabled>
              Select side
            </option>
            <option value="Left">Left</option>
            <option value="Right">Right</option>
          </select>
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-semibold">Additional notes</span>
        <textarea
          name="notes"
          rows={4}
          className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
        />
      </label>

      <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.72)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Payment Proof
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              Upload the transfer receipt or screenshot for{" "}
              <span className="font-bold text-[var(--color-ink)]">
                {formatCurrency(totalAmount)}
              </span>
              .
            </p>
            {!liveMode ? (
              <p className="mt-2 text-xs font-semibold text-[var(--color-bronze)]">
                Supabase service mode is not connected yet. Submission currently
                runs in preview mode.
              </p>
            ) : null}
          </div>
          <input
            type="file"
            name="paymentProof"
            required
            accept="image/*,.pdf"
            className="max-w-full rounded-2xl border border-dashed border-[var(--color-line)] bg-white px-4 py-3 text-sm"
          />
        </div>
      </div>

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
              Order reference: {state.orderReference}
            </p>
          ) : null}
        </div>
      ) : null}

      <SubmitButton
        label="Submit offline order"
        pendingLabel="Submitting order..."
      />
    </form>
  );
}
