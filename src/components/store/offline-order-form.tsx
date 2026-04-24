"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitOfflineOrder } from "@/app/actions";
import { SubmitButton } from "@/components/store/submit-button";
import { initialOfflineOrderState } from "@/lib/action-states";
import type { DeliveryState, Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

function FieldLabel({
  title,
  helper,
}: {
  title: string;
  helper?: string;
}) {
  return (
    <div className="mb-2">
      <span className="text-sm font-semibold text-[var(--color-ink)]">{title}</span>
      {helper ? <p className="mt-1 text-xs text-[var(--color-muted)]">{helper}</p> : null}
    </div>
  );
}

export function OfflineOrderForm({
  product,
  deliveryStates,
  liveMode,
  initialCustomerName = "",
  initialEmail = "",
  loggedIn = false,
}: {
  product: Product;
  deliveryStates: DeliveryState[];
  liveMode: boolean;
  initialCustomerName?: string;
  initialEmail?: string;
  loggedIn?: boolean;
}) {
  const [state, formAction] = useActionState(
    submitOfflineOrder,
    initialOfflineOrderState,
  );
  const [quantity, setQuantity] = useState(1);
  const activeStates = deliveryStates.filter((item) => item.isActive);
  const unitAmount = product.salePrice ?? product.basePrice;
  const totalAmount = unitAmount * quantity;

  return (
    <form action={formAction} className="space-y-6" encType="multipart/form-data">
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="productSlug" value={product.slug} />
      <input type="hidden" name="productName" value={product.name} />
      <input type="hidden" name="unitAmount" value={unitAmount} />

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-[var(--color-line)] bg-white/88 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
            Checkout guide
          </p>
          <h2 className="mt-3 text-2xl font-extrabold text-[var(--color-ink)]">
            Fill the order details once, then upload your receipt.
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            This layout is split into customer details, product configuration,
            delivery information, and payment proof so the order feels easier to
            complete.
          </p>
        </div>

        <div className="rounded-[2rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-primary)_94%,white_6%)] p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/68">
            Order summary
          </p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm text-white/72">{product.name}</p>
              <p className="mt-1 text-3xl font-extrabold">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="text-right text-sm text-white/72">
              <p>{formatCurrency(unitAmount)} each</p>
              <p>Qty {quantity}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-white/80">
            {loggedIn ? (
              "This order will be tied to your account so you can check progress later."
            ) : (
              <>
                Guest checkout is allowed.{" "}
                <Link
                  href={`/account?next=/checkout/offline?product=${product.slug}`}
                  className="font-semibold text-white underline underline-offset-4"
                >
                  Sign in first
                </Link>{" "}
                if you want order history and receipt access inside your account.
              </>
            )}
          </p>
        </div>
      </div>

      <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/84 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
          1. Customer details
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <FieldLabel title="Full name" />
            <input
              name="customerName"
              required
              defaultValue={initialCustomerName}
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            />
          </label>
          <label className="block">
            <FieldLabel title="Phone number" />
            <input
              name="phone"
              required
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            />
          </label>
          <label className="block md:col-span-2">
            <FieldLabel title="Email address" helper="Optional, but useful for easier contact and future receipt access." />
            <input
              name="email"
              type="email"
              defaultValue={initialEmail}
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            />
          </label>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/84 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
          2. Product setup
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="block">
            <FieldLabel title="Width" helper="Example: 180cm" />
            <input
              name="width"
              placeholder="180cm"
              required
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            />
          </label>
          <label className="block">
            <FieldLabel title="Height" helper="Example: 220cm" />
            <input
              name="height"
              placeholder="220cm"
              required
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            />
          </label>
          <label className="block">
            <FieldLabel title="Quantity" />
            <input
              name="quantity"
              type="number"
              min="1"
              defaultValue="1"
              required
              onChange={(event) =>
                setQuantity(Math.max(1, Number(event.currentTarget.value) || 1))
              }
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            />
          </label>
          <label className="block">
            <FieldLabel title="Colour" />
            <select
              name="color"
              required
              defaultValue=""
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            >
              <option value="" disabled>
                Choose colour
              </option>
              {product.colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <FieldLabel title="Mount type" />
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
          <label className="block">
            <FieldLabel title="Control side" />
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

        <div className="mt-5 rounded-[1.8rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-secondary)_8%,white_92%)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Popular measurement presets
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.measurements.map((measurement) => (
              <span
                key={measurement}
                className="rounded-full border border-[var(--color-line)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-ink)]"
              >
                {measurement}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/84 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
          3. Delivery details
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <FieldLabel title="State" helper="Choose the delivery location nearest to you." />
            <select
              name="state"
              required
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                {activeStates.length ? "Choose delivery state" : "No delivery states available yet"}
              </option>
              {activeStates.map((item) => (
                <option key={item.code} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Estimated delivery window
            </p>
            <p className="mt-3 text-lg font-extrabold text-[var(--color-ink)]">
              {activeStates[0]?.eta || "3 to 6 working days"}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              Final timing depends on your product choice, measurements, and confirmation.
            </p>
          </div>

          <label className="block md:col-span-2">
            <FieldLabel title="Delivery address or location" />
            <textarea
              name="location"
              required
              rows={3}
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            />
          </label>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/84 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
          4. Notes and payment proof
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <label className="block">
            <FieldLabel
              title="Additional notes"
              helper="Use this for room details, fitting notes, or anything the team should know."
            />
            <textarea
              name="notes"
              rows={6}
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            />
          </label>

          <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-primary)_5%,white_95%)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Payment proof
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Upload the receipt or screenshot for{" "}
              <span className="font-bold text-[var(--color-ink)]">
                {formatCurrency(totalAmount)}
              </span>
              .
            </p>
            {!liveMode ? (
              <p className="mt-2 text-xs font-semibold text-[var(--color-secondary)]">
                Supabase service mode is not connected yet. Submission currently runs
                in preview mode.
              </p>
            ) : null}
            <input
              type="file"
              name="paymentProof"
              required
              accept="image/*,.pdf"
              className="mt-4 w-full max-w-full rounded-2xl border border-dashed border-[var(--color-line)] bg-white px-4 py-3 text-sm"
            />
          </div>
        </div>
      </section>

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
            <p className="mt-1 font-semibold">Order reference: {state.orderReference}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-[var(--color-line)] bg-white/90 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Final amount
          </p>
          <p className="mt-2 text-3xl font-extrabold text-[var(--color-ink)]">
            {formatCurrency(totalAmount)}
          </p>
        </div>
        <SubmitButton
          label="Place offline order"
          pendingLabel="Submitting order..."
          className="px-7 py-4"
        />
      </div>
    </form>
  );
}
