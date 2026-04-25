import Link from "next/link";
import { ArrowRight, Package, Receipt, User2 } from "lucide-react";
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
      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <section className="rounded-[2.4rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)] sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-secondary)]">
                Customer Account
              </p>
              <h1 className="mt-3 max-w-3xl text-5xl font-extrabold tracking-[-0.06em] text-[var(--color-ink)] sm:text-6xl">
                {user
                  ? "Your orders, receipts, and delivery updates"
                  : "Customer access that feels like a real account area"}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                Review purchases, monitor progress, and return to previous orders from one
                professional customer workspace.
              </p>
            </div>
            {user ? <CustomerSignOutButton /> : null}
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
            <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <article className="rounded-[2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-6 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.24)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                  Account owner
                </p>
                <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                  {user.fullName}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{user.email}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white"
                  >
                    Browse products
                  </Link>
                  <Link
                    href="/checkout/order"
                    className="rounded-full border border-[var(--color-line)] bg-white/72 px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
                  >
                    Place an order
                  </Link>
                  {admin ? (
                    <Link
                      href="/admin/dashboard"
                      className="rounded-full border border-[var(--color-line)] bg-white/72 px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
                    >
                      Admin
                    </Link>
                  ) : null}
                </div>
              </article>

              <div className="grid gap-4 sm:grid-cols-3">
                <article className="rounded-[2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-5">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-secondary)_16%,white_84%)] text-[var(--color-ink)]">
                    <Package size={18} />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    Orders
                  </p>
                  <p className="mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                    {orders.length}
                  </p>
                </article>
                <article className="rounded-[2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-5">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-secondary)_16%,white_84%)] text-[var(--color-ink)]">
                    <Receipt size={18} />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    Confirmed
                  </p>
                  <p className="mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                    {paidOrders}
                  </p>
                </article>
                <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(140deg,color-mix(in_srgb,var(--color-primary)_97%,black_3%),color-mix(in_srgb,var(--color-primary)_78%,black_22%))] p-5 text-white">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <User2 size={18} />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/68">
                    Total value
                  </p>
                  <p className="mt-2 text-2xl font-extrabold tracking-[-0.05em]">
                    {totalSpent ? formatCurrency(totalSpent) : "NGN 0"}
                  </p>
                </article>
              </div>
            </section>

            <section className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Orders
                </p>
                <h2 className="mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)] sm:text-5xl">
                  Recent activity
                </h2>
              </div>

              {orders.length ? (
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <article
                      key={order.id}
                      className="rounded-[2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-6 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.24)]"
                    >
                      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr_auto] lg:items-center">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                            {order.reference}
                          </p>
                          <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
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
                            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white"
                          >
                            View order
                            <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/62 p-8">
                  <h3 className="text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                    No tracked orders yet
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                    Place an order while logged in and it will appear here with receipt history
                    and delivery status updates.
                  </p>
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="rounded-[2.2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-8 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.24)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                Account access
              </p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)] sm:text-5xl">
                Continue to your order history
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                Account access is optional at checkout, but signed-in orders are easier to manage later.
              </p>
              <div className="mt-6">
                <CustomerSignInForm redirectTo={redirectTo} />
              </div>
            </article>

            <div className="grid gap-6">
              <article className="rounded-[2.2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-8 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.24)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                  New customer profile
                </p>
                <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)] sm:text-5xl">
                  Keep future orders in one place
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  Create a customer profile to keep confirmations, receipts, and delivery progress together.
                </p>
                <div className="mt-6">
                  <CustomerSignUpForm redirectTo={redirectTo} />
                </div>
              </article>

              <article className="rounded-[2.2rem] border border-white/10 bg-[linear-gradient(140deg,color-mix(in_srgb,var(--color-primary)_97%,black_3%),color-mix(in_srgb,var(--color-primary)_78%,black_22%))] p-8 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/68">
                  Customer flow
                </p>
                <p className="mt-4 text-sm leading-7 text-white/80">
                  Browse products, submit an order, attach your receipt, and return here to
                  follow progress.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
                  >
                    Shop now
                  </Link>
                  <Link
                    href="/checkout/order"
                    className="rounded-full border border-white/18 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Place order
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
