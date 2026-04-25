import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { getCurrentUser } from "@/lib/auth";
import { getCustomerOrderByReference } from "@/lib/data";
import { formatCurrency, formatDateTime, formatStatusLabel } from "@/lib/utils";

export default async function AccountOrderReceiptPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/account");
  }

  const { reference } = await params;
  const order = await getCustomerOrderByReference(user.id, reference);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-12 lg:px-10">
        <section className="rounded-[2.5rem] border border-[var(--color-line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,247,251,0.9))] p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                Order details
              </p>
              <h1 className="mt-2 font-display text-6xl leading-none">{order.reference}</h1>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                A cleaner order screen helps customers confirm what was ordered, what was
                paid, and what happens next.
              </p>
            </div>
            <Link
              href="/account"
              className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold"
            >
              Back to account
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <article className="rounded-[2.2rem] border border-[var(--color-line)] bg-white/92 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
              Product summary
            </p>
            <h2 className="mt-3 font-display text-5xl leading-none">{order.productName}</h2>
            <div className="mt-6 grid gap-3 text-sm leading-7 text-[var(--color-muted)] md:grid-cols-2">
              {typeof order.amount === "number" ? <p>Amount: {formatCurrency(order.amount)}</p> : null}
              {order.quantity ? <p>Quantity: {order.quantity}</p> : null}
              {order.deliveryState ? <p>State: {order.deliveryState}</p> : null}
              <p>Status: {formatStatusLabel(order.status)}</p>
              {order.width ? <p>Width: {order.width}</p> : null}
              {order.height ? <p>Height: {order.height}</p> : null}
              {order.selectedColor ? <p>Colour: {order.selectedColor}</p> : null}
              {order.mountType ? <p>Mount: {order.mountType}</p> : null}
              {order.controlSide ? <p>Control side: {order.controlSide}</p> : null}
            </div>
          </article>

          <article className="rounded-[2.2rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-primary)_94%,white_6%)] p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              Customer and timeline
            </p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-white/82">
              <p>{order.name}</p>
              <p>{order.phone}</p>
              {order.email ? <p>{order.email}</p> : null}
              <p>{order.address}</p>
              <p>Submitted: {formatDateTime(order.createdAt)}</p>
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[2.2rem] border border-[var(--color-line)] bg-white/92 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Order status
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white">
                {formatStatusLabel(order.status)}
              </span>
              {order.paymentProofUploaded ? (
                <span className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
                  Receipt uploaded
                </span>
              ) : null}
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              Orders stay visible here while the team reviews the receipt and updates delivery.
            </p>
          </article>

          {order.description ? (
            <article className="rounded-[2.2rem] border border-[var(--color-line)] bg-white/92 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Notes
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {order.description}
              </p>
            </article>
          ) : (
            <article className="rounded-[2.2rem] border border-[var(--color-line)] bg-white/92 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Next action
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Need another order? Return to the catalog and continue shopping.
              </p>
              <div className="mt-5">
                <Link
                  href="/products"
                  className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Browse products
                </Link>
              </div>
            </article>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
