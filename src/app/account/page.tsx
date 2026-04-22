import Link from "next/link";
import { CustomerSignInForm } from "@/components/account/customer-sign-in-form";
import { CustomerSignOutButton } from "@/components/account/customer-sign-out-button";
import { CustomerSignUpForm } from "@/components/account/customer-sign-up-form";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { getCurrentAdmin, getCurrentUser } from "@/lib/auth";
import { getCustomerOrders } from "@/lib/data";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import { formatCurrency, formatDateTime, formatStatusLabel } from "@/lib/utils";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const [user, admin] = await Promise.all([getCurrentUser(), getCurrentAdmin()]);
  const orders = user ? await getCustomerOrders(user.id) : [];
  const redirectTo = params.next || "/account";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-8 px-6 py-12 lg:px-10">
        <section className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Account
            </p>
            <h1 className="mt-2 font-display text-6xl leading-none">
              {user ? "Track your orders and receipts" : "Sign in for order history"}
            </h1>
          </div>
          {user ? <CustomerSignOutButton /> : null}
        </section>

        {!hasPublicSupabaseConfig ? (
          <div className="rounded-[1.8rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
            Supabase auth is not configured yet, so account sign-in and order
            history are unavailable until the environment keys are connected.
          </div>
        ) : null}

        {user ? (
          <>
            <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/88 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Signed in
                </p>
                <h2 className="mt-3 font-display text-4xl leading-none">
                  {user.fullName}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {user.email}
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  Offline orders placed while logged in will appear here with their
                  latest payment and delivery status.
                </p>
              </article>

              <article className="rounded-[2rem] border border-[var(--color-line)] bg-[rgba(255,249,241,0.88)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Quick actions
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
                  >
                    Browse products
                  </Link>
                  <Link
                    href="/checkout/offline"
                    className="rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold"
                  >
                    Start checkout
                  </Link>
                  {admin ? (
                    <Link
                      href="/admin/dashboard"
                      className="rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold"
                    >
                      Admin dashboard
                    </Link>
                  ) : null}
                </div>
              </article>
            </section>

            <section className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Order history
                </p>
                <h2 className="mt-2 font-display text-5xl leading-none">
                  Receipts and status
                </h2>
              </div>

              {orders.length ? (
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <article
                      key={order.id}
                      className="grid gap-4 rounded-[2rem] border border-[var(--color-line)] bg-white/88 p-6 lg:grid-cols-[1fr_0.8fr_auto]"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                          {order.reference}
                        </p>
                        <h3 className="mt-2 text-2xl font-extrabold">
                          {order.productName}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                          {order.address}
                        </p>
                      </div>
                      <div className="text-sm leading-7 text-[var(--color-muted)]">
                        <p>Status: {formatStatusLabel(order.status)}</p>
                        {typeof order.amount === "number" ? (
                          <p>Amount: {formatCurrency(order.amount)}</p>
                        ) : null}
                        {order.quantity ? <p>Quantity: {order.quantity}</p> : null}
                        <p>{formatDateTime(order.createdAt)}</p>
                      </div>
                      <div className="flex items-center">
                        <Link
                          href={`/account/orders/${order.reference}`}
                          className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white"
                        >
                          View receipt
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-[rgba(255,249,241,0.74)] p-8">
                  <h3 className="font-display text-4xl leading-none">
                    No tracked orders yet
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                    Place an order while logged in and it will appear here with its
                    receipt summary and latest status.
                  </p>
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                Sign in
              </p>
              <h2 className="mt-2 font-display text-5xl leading-none">
                Return to your receipts
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                Login is optional for checkout, but signed-in orders can be tracked
                here later.
              </p>
              <div className="mt-6">
                <CustomerSignInForm redirectTo={redirectTo} />
              </div>
            </article>

            <article className="rounded-[2rem] border border-[var(--color-line)] bg-[rgba(255,249,241,0.88)] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                Create account
              </p>
              <h2 className="mt-2 font-display text-5xl leading-none">
                Save future order history
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                Your account gives you one place to check payment confirmation and
                delivery progress for future orders.
              </p>
              <div className="mt-6">
                <CustomerSignUpForm redirectTo={redirectTo} />
              </div>
            </article>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
