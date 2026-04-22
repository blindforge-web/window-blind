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
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-12 lg:px-10">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Receipt
            </p>
            <h1 className="mt-2 font-display text-6xl leading-none">
              {order.reference}
            </h1>
          </div>
          <Link
            href="/account"
            className="rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold"
          >
            Back to account
          </Link>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/90 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
              Product
            </p>
            <h2 className="mt-3 font-display text-5xl leading-none">
              {order.productName}
            </h2>
            <div className="mt-6 grid gap-3 text-sm leading-7 text-[var(--color-muted)] md:grid-cols-2">
              {typeof order.amount === "number" ? (
                <p>Amount: {formatCurrency(order.amount)}</p>
              ) : null}
              {order.quantity ? <p>Quantity: {order.quantity}</p> : null}
              {order.deliveryState ? <p>State: {order.deliveryState}</p> : null}
              <p>Status: {formatStatusLabel(order.status)}</p>
              {order.width ? <p>Width: {order.width}</p> : null}
              {order.height ? <p>Height: {order.height}</p> : null}
              {order.selectedColor ? <p>Color: {order.selectedColor}</p> : null}
              {order.mountType ? <p>Mount: {order.mountType}</p> : null}
              {order.controlSide ? <p>Control side: {order.controlSide}</p> : null}
            </div>
          </article>

          <article className="rounded-[2rem] border border-[var(--color-line)] bg-[rgba(255,249,241,0.88)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Customer
            </p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
              <p>{order.name}</p>
              <p>{order.phone}</p>
              {order.email ? <p>{order.email}</p> : null}
              <p>{order.address}</p>
              <p>Submitted: {formatDateTime(order.createdAt)}</p>
            </div>
          </article>
        </section>

        {order.description ? (
          <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/90 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Notes
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              {order.description}
            </p>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
