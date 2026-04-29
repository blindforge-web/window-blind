import Link from "next/link";
import { Package2, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { getCurrentUser } from "@/lib/auth";
import { getCustomerOrders } from "@/lib/data";
import { formatCurrency, formatDateTime, getOrderStatusMeta } from "@/lib/utils";

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6 lg:px-10">
          <section className="rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(150deg,#ffffff,rgba(234,242,255,0.94))] p-6 text-center shadow-[0_30px_70px_-42px_rgba(14,42,71,0.22)] sm:p-8 lg:p-10">
            <ShieldCheck size={28} className="mx-auto text-[var(--color-primary)]" />
            <h1 className="mt-4 text-5xl font-extrabold tracking-[-0.06em] text-[var(--color-ink)] sm:text-6xl">
              Sign in to track your Sunpilot orders
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
              The order screen keeps customer order IDs, tracking slugs, payment review, and delivery status together.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/account?next=/orders" className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white">
                Open account access
              </Link>
              <Link href="/products" className="rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)]">
                Browse products
              </Link>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const orders = await getCustomerOrders(user.id);
  const confirmedOrders = orders.filter((order) => order.status !== "pending").length;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <section className="rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(150deg,#ffffff,rgba(234,242,255,0.94))] p-6 shadow-[0_30px_70px_-42px_rgba(14,42,71,0.22)] sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                Order screen
              </p>
              <h1 className="mt-3 text-5xl font-extrabold tracking-[-0.06em] text-[var(--color-ink)] sm:text-6xl">
                Track every Sunpilot order in one place.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                Each order now exposes its internal ID, customer-facing tracking slug, and current fulfillment status for cleaner follow-up.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-white px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">All orders</p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-ink)]">{orders.length}</p>
              </div>
              <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-white px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Confirmed</p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-ink)]">{confirmedOrders}</p>
              </div>
            </div>
          </div>
        </section>

        {orders.length ? (
          <section className="grid gap-4">
            {orders.map((order) => {
              const status = getOrderStatusMeta(order.status);
              return (
                <article
                  key={order.id}
                  className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_20px_46px_-34px_rgba(14,42,71,0.18)]"
                >
                  <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr_auto] lg:items-start">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                        {order.reference}
                      </p>
                      <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
                        {order.productName}
                      </h2>
                      <div className="mt-4 grid gap-2 text-sm leading-7 text-[var(--color-muted)]">
                        <p>Tracking slug: {order.trackingSlug}</p>
                        <p>Order ID: {order.id}</p>
                        <p>Created: {formatDateTime(order.createdAt)}</p>
                        {typeof order.amount === "number" ? <p>Amount: {formatCurrency(order.amount)}</p> : null}
                      </div>
                    </div>

                    <div className="rounded-[1.4rem] bg-[var(--color-accent)] p-4">
                      <p className="text-sm font-bold text-[var(--color-ink)]">{status.label}</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{status.summary}</p>
                    </div>

                    <div className="flex items-center">
                      <Link
                        href={`/orders/${order.reference}`}
                        className="inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
                      >
                        View order
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="rounded-[1.8rem] border border-dashed border-[var(--color-line)] bg-white p-8 text-center">
            <Package2 size={28} className="mx-auto text-[var(--color-primary)]" />
            <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
              No tracked orders yet
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Place an order while signed in and it will appear here automatically.
            </p>
            <div className="mt-6">
              <Link href="/checkout/order" className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white">
                Start an order
              </Link>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
