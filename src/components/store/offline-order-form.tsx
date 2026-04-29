"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitOfflineOrder } from "@/app/actions";
import { SubmitButton } from "@/components/store/submit-button";
import { initialOfflineOrderState } from "@/lib/action-states";
import type { DeliveryState, PaymentAccount, Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const inputClassName =
  "w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none";

const sectionClassName =
  "rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-5";

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

function splitMeasurementPreset(value: string) {
  const [width = "", height = ""] = value.split(/\s*x\s*/i).map((part) => part.trim());
  return { width, height };
}

export function OfflineOrderForm({
  product,
  deliveryStates,
  paymentAccount,
  liveMode,
  initialCustomerName = "",
  initialEmail = "",
  loggedIn = false,
}: {
  product: Product;
  deliveryStates: DeliveryState[];
  paymentAccount: PaymentAccount | null;
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
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");
  const activeStates = deliveryStates.filter((item) => item.isActive);
  const selectedState =
    activeStates.find((item) => item.name === selectedStateName) ?? null;
  const unitAmount = product.salePrice ?? product.basePrice;
  const totalAmount = unitAmount * quantity;
  const accountReady = Boolean(
    paymentAccount?.bankName &&
      paymentAccount?.accountName &&
      paymentAccount?.accountNumber,
  );

  function applyMeasurementPreset(measurement: string) {
    const preset = splitMeasurementPreset(measurement);

    if (!preset.width || !preset.height) {
      return;
    }

    setSelectedPreset(measurement);
    setWidth(preset.width);
    setHeight(preset.height);
  }

  return (
    <form action={formAction} className="space-y-5" encType="multipart/form-data">
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="productSlug" value={product.slug} />
      <input type="hidden" name="productName" value={product.name} />
      <input type="hidden" name="unitAmount" value={unitAmount} />

      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className={sectionClassName}>
          <p className="ui-section-label">Quick form</p>
          <h2 className="mt-2 text-2xl font-extrabold text-[var(--color-ink)]">
            Short, simple, and easy to finish.
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            {loggedIn ? (
              "This order will be saved to your account."
            ) : (
              <>
                Guest checkout is on.{" "}
                <Link
                  href={`/account?next=/checkout/order?product=${product.slug}`}
                  className="font-semibold text-[var(--color-primary)] underline underline-offset-4"
                >
                  Sign in first
                </Link>{" "}
                if you want this order saved to your account automatically.
              </>
            )}
          </p>
        </div>

        <div className="rounded-[2rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-primary)_94%,white_6%)] p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/68">
            Live total
          </p>
          <div className="mt-3">
            <p className="text-sm text-white/72">{product.name}</p>
            <p className="mt-1 text-3xl font-extrabold">{formatCurrency(totalAmount)}</p>
            <p className="mt-3 text-sm text-white/72">{formatCurrency(unitAmount)} each</p>
            <p className="mt-1 text-sm text-white/72">Qty {quantity}</p>
          </div>
        </div>
      </div>

      <section className={sectionClassName}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="ui-section-label">1. Your details</p>
            <h3 className="mt-2 text-xl font-extrabold text-[var(--color-ink)]">
              Who should we contact?
            </h3>
          </div>
          <div className="rounded-full border border-[var(--color-line)] bg-[rgba(248,250,252,0.9)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Contact details
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <FieldLabel title="Full name" />
            <input
              name="customerName"
              required
              defaultValue={initialCustomerName}
              placeholder="Your full name"
              className={inputClassName}
            />
          </label>
          <label className="block">
            <FieldLabel title="Phone number" />
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              required
              placeholder="0800 000 0000"
              className={inputClassName}
            />
          </label>
          <label className="block md:col-span-2">
            <FieldLabel title="Email address" helper="Optional" />
            <input
              name="email"
              type="email"
              defaultValue={initialEmail}
              placeholder="you@example.com"
              className={inputClassName}
            />
          </label>
        </div>
      </section>

      <section className={sectionClassName}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="ui-section-label">2. Blind details</p>
            <h3 className="mt-2 text-xl font-extrabold text-[var(--color-ink)]">
              Tell us what you want.
            </h3>
          </div>
          <div className="rounded-full border border-[var(--color-line)] bg-[rgba(248,250,252,0.9)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Product setup
          </div>
        </div>

        {product.measurements.length ? (
          <div className="mt-5 rounded-[1.8rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-secondary)_8%,white_92%)] p-4">
            <p className="text-sm font-semibold text-[var(--color-ink)]">
              Tap a size to fill width and height faster.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.measurements.map((measurement) => (
                <button
                  key={measurement}
                  type="button"
                  onClick={() => applyMeasurementPreset(measurement)}
                  aria-pressed={selectedPreset === measurement}
                  className={`rounded-full border px-3 py-2 text-xs font-semibold ${
                    selectedPreset === measurement
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--color-line)] bg-white text-[var(--color-ink)]"
                  }`}
                >
                  {measurement}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="block">
            <FieldLabel title="Width" helper="Example: 180cm" />
            <input
              name="width"
              placeholder="180cm"
              value={width}
              required
              onChange={(event) => {
                setSelectedPreset("");
                setWidth(event.currentTarget.value);
              }}
              className={inputClassName}
            />
          </label>
          <label className="block">
            <FieldLabel title="Height" helper="Example: 220cm" />
            <input
              name="height"
              placeholder="220cm"
              value={height}
              required
              onChange={(event) => {
                setSelectedPreset("");
                setHeight(event.currentTarget.value);
              }}
              className={inputClassName}
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
              className={inputClassName}
            />
          </label>
          <label className="block">
            <FieldLabel title="Colour" />
            <select
              name="color"
              required
              defaultValue=""
              className={inputClassName}
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
              className={inputClassName}
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
              className={inputClassName}
            >
              <option value="" disabled>
                Select side
              </option>
              <option value="Left">Left</option>
              <option value="Right">Right</option>
            </select>
          </label>
        </div>
      </section>

      <section className={sectionClassName}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="ui-section-label">3. Delivery</p>
            <h3 className="mt-2 text-xl font-extrabold text-[var(--color-ink)]">
              Where should we deliver?
            </h3>
          </div>
          <div className="rounded-full border border-[var(--color-line)] bg-[rgba(248,250,252,0.9)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
            {activeStates.length} state{activeStates.length === 1 ? "" : "s"} live
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_0.85fr]">
          <label className="block">
            <FieldLabel title="State" helper="Choose your delivery state." />
            <select
              name="state"
              required
              value={selectedStateName}
              disabled={!activeStates.length}
              onChange={(event) => setSelectedStateName(event.currentTarget.value)}
              className={inputClassName}
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
              {selectedState?.eta || "Choose a state"}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              {selectedState
                ? `${selectedState.name} is currently active for delivery.`
                : "ETA updates after you pick a state."}
            </p>
          </div>

          <label className="block md:col-span-2">
            <FieldLabel title="Delivery address or location" />
            <textarea
              name="location"
              required
              rows={3}
              placeholder="Street, area, landmark, and city"
              className={inputClassName}
            />
          </label>
        </div>
      </section>

      <section className={sectionClassName}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="ui-section-label">4. Pay and finish</p>
            <h3 className="mt-2 text-xl font-extrabold text-[var(--color-ink)]">
              Make payment, upload the receipt, and submit.
            </h3>
          </div>
          <div className="rounded-full border border-[var(--color-line)] bg-[rgba(248,250,252,0.9)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Final step
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-primary)_5%,white_95%)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Payment details
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                `1. Transfer ${formatCurrency(totalAmount)}`,
                "2. Upload receipt",
                "3. Submit order",
              ].map((step) => (
                <div
                  key={step}
                  className="rounded-[1.4rem] border border-[var(--color-line)] bg-white/88 px-4 py-3 text-sm font-semibold text-[var(--color-ink)]"
                >
                  {step}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[1.6rem] border border-[var(--color-line)] bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {paymentAccount?.bankName || "Business transfer account"}
              </p>
              {paymentAccount?.accountName ? (
                <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
                  {paymentAccount.accountName}
                </p>
              ) : null}
              {paymentAccount?.accountNumber ? (
                <p className="mt-1 text-3xl font-extrabold tracking-[0.12em] text-[var(--color-ink)]">
                  {paymentAccount.accountNumber}
                </p>
              ) : null}
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {paymentAccount?.note ||
                  "Transfer the full amount, upload the receipt, and submit your order."}
              </p>
            </div>

            {!accountReady ? (
              <p className="mt-3 text-sm font-semibold text-[var(--color-secondary)]">
                Payment account setup is incomplete. The admin should finish it before taking live orders.
              </p>
            ) : null}

            {!liveMode ? (
              <p className="mt-3 text-sm font-semibold text-[var(--color-secondary)]">
                Online submission is temporarily unavailable. Please contact the team before retrying.
              </p>
            ) : null}
          </div>

          <div className="space-y-4">
            <label className="block">
              <FieldLabel title="Upload payment receipt" helper="Image or PDF, max 5MB." />
              <input
                type="file"
                name="paymentProof"
                required
                accept="image/*,.pdf"
                className="w-full rounded-2xl border border-dashed border-[var(--color-line)] bg-white px-4 py-3 text-sm"
              />
            </label>

            <label className="block">
              <FieldLabel title="Extra note" helper="Optional" />
              <textarea
                name="notes"
                rows={4}
                placeholder="Anything the team should know"
                className={inputClassName}
              />
            </label>
          </div>
        </div>

        {state.message ? (
          <div
            className={`mt-5 rounded-[1.8rem] border px-5 py-4 text-sm ${
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

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[1.8rem] border border-[var(--color-line)] bg-white/96 p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)]">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Amount to pay
            </p>
            <p className="text-3xl font-extrabold text-[var(--color-ink)]">
              {formatCurrency(totalAmount)}
            </p>
            <p className="text-sm leading-7 text-[var(--color-muted)]">
              Submit after the transfer and receipt upload.
            </p>
          </div>
          <SubmitButton
            label="Submit order"
            pendingLabel="Submitting..."
            className="px-7 py-4"
          />
        </div>
      </section>
    </form>
  );
}
