import { savePaymentAccount } from "@/app/actions";
import type { PaymentAccount } from "@/lib/types";

export function PaymentAccountPanel({
  paymentAccount,
  actionsEnabled,
}: {
  paymentAccount: PaymentAccount;
  actionsEnabled: boolean;
}) {
  return (
    <section className="rounded-[2rem] border border-[var(--color-line)] bg-[rgba(255,249,241,0.88)] p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
          Payment Account
        </p>
        <h2 className="font-display text-4xl leading-none">
          Update transfer destination
        </h2>
      </div>

      <form action={savePaymentAccount} className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Bank name</span>
          <input
            name="bankName"
            defaultValue={paymentAccount.bankName}
            disabled={!actionsEnabled}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Account name</span>
          <input
            name="accountName"
            defaultValue={paymentAccount.accountName}
            disabled={!actionsEnabled}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Account number</span>
          <input
            name="accountNumber"
            defaultValue={paymentAccount.accountNumber}
            disabled={!actionsEnabled}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-semibold">Checkout note</span>
          <textarea
            name="paymentNote"
            rows={3}
            defaultValue={paymentAccount.note}
            disabled={!actionsEnabled}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>
        <button
          type="submit"
          disabled={!actionsEnabled}
          className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-forest)] disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-2"
        >
          Save payment account
        </button>
      </form>
    </section>
  );
}
