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

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
            Guided order details
          </p>
          <h2 className="mt-3 text-2xl font-extrabold text-[var(--color-ink)]">
            Build the final order brief in one clean pass.
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Customer details, blind specification, delivery information, and transfer
            receipt are grouped into separate cards so the process reads like a checkout
            summary instead of a long admin-style form.
          </p>
        </div>

        <div className="rounded-[2rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-primary)_94%,white_6%)] p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/68">
            Live summary
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
              "This order will be connected to your account so you can track changes later."
            ) : (
              <>
                You can continue without signing in.{" "}
                <Link
                  href={`/account?next=/checkout/order?product=${product.slug}`}
                  className="font-semibold text-white underline underline-offset-4"
                >
                  Access your account first
                </Link>{" "}
                if you want this order saved directly into your order history.
              </>
            )}
          </p>
        </div>
      </div>

      <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/88 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
              1. Customer details
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              These details are used for delivery coordination, status updates, and final confirmation.
            </p>
          </div>
          <div className="rounded-full border border-[var(--color-line)] bg-[rgba(248,250,252,0.9)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Buyer information
          </div>
        </div>

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
            <FieldLabel
              title="Email address"
              helper="Optional, but recommended for updates, receipts, and future order access."
            />
            <input
              name="email"
              type="email"
              defaultValue={initialEmail}
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            />
          </label>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/88 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
              2. Product setup
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              Confirm the exact blind specification you want prepared for production.
            </p>
          </div>
          <div className="rounded-full border border-[var(--color-line)] bg-[rgba(248,250,252,0.9)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Blind specification
          </div>
        </div>

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

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-secondary)_8%,white_92%)] p-4">
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

          <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Marketplace tip
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Need another look? Open the product page to review visuals, finishes, and use cases.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/88 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
              3. Delivery details
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              Choose the delivery destination and provide the address as clearly as possible.
            </p>
          </div>
          <div className="rounded-full border border-[var(--color-line)] bg-[rgba(248,250,252,0.9)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Shipping information
          </div>
        </div>

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

          <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-[rgba(248,250,252,0.84)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Estimated delivery window
            </p>
            <p className="mt-3 text-lg font-extrabold text-[var(--color-ink)]">
              {activeStates[0]?.eta || "3 to 6 working days"}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              Final timing depends on product lead time, payment confirmation, and location.
            </p>
          </div>

          <label className="block md:col-span-2">
            <FieldLabel title="Delivery address or location" />
            <textarea
              name="location"
              required
              rows={4}
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            />
          </label>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/88 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
              4. Payment proof and notes
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              Attach your transfer receipt and include any production or installation notes.
            </p>
          </div>
          <div className="rounded-full border border-[var(--color-line)] bg-[rgba(248,250,252,0.9)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Final review
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <label className="block">
            <FieldLabel
              title="Additional notes"
              helper="Use this for room notes, fitting instructions, or anything the team should know."
            />
            <textarea
              name="notes"
              rows={6}
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            />
          </label>

          <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-primary)_5%,white_95%)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Receipt upload
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Attach the receipt or transfer screenshot for{" "}
              <span className="font-bold text-[var(--color-ink)]">
                {formatCurrency(totalAmount)}
              </span>
              .
            </p>
            {!liveMode ? (
              <p className="mt-2 text-xs font-semibold text-[var(--color-secondary)]">
                Live order storage is not connected yet. This screen is currently running in preview mode.
              </p>
            ) : null}
            <input
              type="file"
              name="paymentProof"
              required
              accept="image/*,.pdf"
              className="mt-4 w-full rounded-2xl border border-dashed border-[var(--color-line)] bg-white px-4 py-3 text-sm"
            />
            <div className="mt-4 rounded-[1.4rem] border border-[var(--color-line)] bg-white/88 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                Accepted files
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                Images and PDF receipts only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {state.message ? (
        <div
          className={`rounded-[1.8rem] border px-5 py-4 text-sm ${
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

      <div className="rounded-[2rem] border border-[var(--color-line)] bg-white/96 p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Final amount
            </p>
            <p className="text-3xl font-extrabold text-[var(--color-ink)]">
              {formatCurrency(totalAmount)}
            </p>
            <p className="text-sm leading-7 text-[var(--color-muted)]">
              Submit after completing the transfer and attaching the receipt.
            </p>
          </div>
          <SubmitButton
            label="Submit order"
            pendingLabel="Submitting..."
            className="px-7 py-4"
          />
        </div>
      </div>
    </form>
  );
}
