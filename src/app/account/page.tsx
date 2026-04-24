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
  const paidOrders = orders.filter((order) => order.status !== "pending").length;
  const totalSpent = orders.reduce(
    (sum, order) => sum + (typeof order.amount === "number" ? order.amount : 0),
    0,
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-8 px-6 py-12 lg:px-10">
        <section className="rounded-[2.7rem] border border-[var(--color-line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,247,251,0.9))] p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                Customer Account
              </p>
              <h1 className="mt-2 font-display text-6xl leading-none">
                {user ? "Your orders, receipts, and next actions" : "Sign in to manage orders"}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                This area should feel like a customer dashboard, not a hidden utility page.
                Customers can browse products, continue checkout, and return to orders from here.
              </p>
            </div>
            {user ? <CustomerSignOutButton /> : null}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#overview"
              className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
            >
              Overview
            </a>
            <a
              href="#orders"
              className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
            >
              Orders
            </a>
            <a
              href="#shop"
              className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
            >
              Shop
            </a>
          </div>
        </section>

        {!hasPublicSupabaseConfig ? (
          <div className="rounded-[1.8rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
            Supabase auth is not configured yet, so account sign-in and order history are
            unavailable until the environment keys are connected.
          </div>
        ) : null}

        {user ? (
          <>
            <section id="overview" className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <article className="rounded-[2.2rem] border border-[var(--color-line)] bg-white/92 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Account owner
                </p>
                <h2 className="mt-3 font-display text-4xl leading-none">{user.fullName}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{user.email}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  Orders placed while logged in appear here with their current payment and
                  delivery state.
                </p>
              </article>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <article className="rounded-[2.2rem] border border-[var(--color-line)] bg-white/92 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Orders
                  </p>
                  <p className="mt-3 font-display text-4xl">{orders.length}</p>
                </article>
                <article className="rounded-[2.2rem] border border-[var(--color-line)] bg-white/92 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Confirmed
                  </p>
                  <p className="mt-3 font-display text-4xl">{paidOrders}</p>
                </article>
                <article className="rounded-[2.2rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-primary)_94%,white_6%)] p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/68">
                    Total value
                  </p>
                  <p className="mt-3 text-2xl font-extrabold">
                    {totalSpent ? formatCurrency(totalSpent) : "NGN 0"}
                  </p>
                </article>
              </div>
            </section>

            <section id="shop" className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <article className="rounded-[2.2rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-secondary)_10%,white_90%)] p-6">
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
                      Open admin
                    </Link>
                  ) : null}
                </div>
              </article>

              <article className="rounded-[2.2rem] border border-[var(--color-line)] bg-white/92 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Order tabs
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white">
                    All orders
                  </span>
                  <span className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
                    Pending review
                  </span>
                  <span className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
                    Paid / delivered
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  The structure is now clearer for customers. We will follow the same idea on
                  the admin side so editing and navigation do not feel messy.
                </p>
              </article>
            </section>

            <section id="orders" className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Orders
                </p>
                <h2 className="mt-2 font-display text-5xl leading-none">Recent activity</h2>
              </div>

              {orders.length ? (
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <article
                      key={order.id}
                      className="rounded-[2.2rem] border border-[var(--color-line)] bg-white/92 p-6"
                    >
                      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr_auto]">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                            {order.reference}
                          </p>
                          <h3 className="mt-2 text-2xl font-extrabold text-[var(--color-ink)]">
                            {order.productName}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                            {order.address}
                          </p>
                        </div>

                        <div className="grid gap-2 text-sm leading-7 text-[var(--color-muted)]">
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
                            className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
                          >
                            Open order
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/76 p-8">
                  <h3 className="font-display text-4xl leading-none">No tracked orders yet</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                    Place an order while logged in and it will appear here with receipt
                    summary and status updates.
                  </p>
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="rounded-[2.2rem] border border-[var(--color-line)] bg-white/92 p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                Sign in
              </p>
              <h2 className="mt-2 font-display text-5xl leading-none">Return to your orders</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                Login is optional for checkout, but signed-in orders can be tracked here later.
              </p>
              <div className="mt-6">
                <CustomerSignInForm redirectTo={redirectTo} />
              </div>
            </article>

            <div className="grid gap-6">
              <article className="rounded-[2.2rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-secondary)_10%,white_90%)] p-8">
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

              <article className="rounded-[2.2rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-primary)_94%,white_6%)] p-8 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  Store screens
                </p>
                <p className="mt-4 text-sm leading-7 text-white/82">
                  Landing page for company details, catalog for products, checkout for orders,
                  and account for tracking. That is the customer-side structure now.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
                  >
                    Shop now
                  </Link>
                  <Link
                    href="/checkout/offline"
                    className="rounded-full border border-white/18 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Checkout
                  </Link>
                </div>
              </article>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
