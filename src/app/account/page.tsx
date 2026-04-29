import Link from "next/link";
import { Bell, Package, Receipt, User2 } from "lucide-react";
import { AccountAccessPanel } from "@/components/account/account-access-panel";
import { CustomerSignOutButton } from "@/components/account/customer-sign-out-button";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { getCurrentAdmin, getCurrentUser } from "@/lib/auth";
import { getCustomerOrders } from "@/lib/data";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import { formatCurrency, formatDateTime, getOrderStatusMeta } from "@/lib/utils";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const [user, admin] = await Promise.all([getCurrentUser(), getCurrentAdmin()]);
  const orders = user ? await getCustomerOrders(user.id) : [];
  const redirectTo = params.next || "/account";
  const confirmedOrders = orders.filter((order) => order.status !== "pending").length;
  const totalSpent = orders.reduce(
    (sum, order) => sum + (typeof order.amount === "number" ? order.amount : 0),
    0,
  );
  const latestOrder = orders[0] ?? null;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <section className="rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(150deg,#ffffff,rgba(234,242,255,0.94))] p-6 shadow-[0_30px_70px_-42px_rgba(14,42,71,0.24)] sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                Customer account
              </p>
              <h1 className="mt-3 max-w-3xl text-5xl font-extrabold tracking-[-0.06em] text-[var(--color-ink)] sm:text-6xl">
                {user
                  ? "Your Sunpilot workspace for orders, updates, and account details"
                  : "A cleaner account entry built for real customers"}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                Customers can sign in, see tracked orders, open notifications, and continue shopping without losing context.
              </p>
            </div>
            {user ? <CustomerSignOutButton /> : null}
          </div>
        </section>

        {!hasPublicSupabaseConfig ? (
          <div className="rounded-[1.6rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
            Supabase auth is not configured yet, so account access and saved order history are unavailable until the environment keys are connected.
          </div>
        ) : null}

        {user ? (
          <>
            <section className="grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
              <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_20px_46px_-34px_rgba(14,42,71,0.18)] sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                  Account owner
                </p>
                <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                  {user.fullName}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{user.email}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/products" className="rounded-[1rem] border border-[var(--color-line)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)]">
                    Browse products
                  </Link>
                  <Link href="/orders" className="rounded-[1rem] border border-[var(--color-line)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)]">
                    View orders
                  </Link>
                  <Link href="/notifications" className="rounded-[1rem] border border-[var(--color-line)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)]">
                    Notifications
                  </Link>
                  <Link href="/checkout/order" className="rounded-[1rem] bg-[var(--color-primary)] px-4 py-3 text-center text-sm font-semibold text-white">
                    New order
                  </Link>
                </div>
                {admin ? (
                  <div className="mt-4">
                    <Link
                      href="/admin/dashboard"
                      className="inline-flex rounded-full border border-[var(--color-line)] bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
                    >
                      Open admin dashboard
                    </Link>
                  </div>
                ) : null}
              </article>

              <div className="grid gap-4 sm:grid-cols-3">
                <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-5">
                  <Package size={18} className="text-[var(--color-primary)]" />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Orders</p>
                  <p className="mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">{orders.length}</p>
                </article>
                <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-5">
                  <Receipt size={18} className="text-[var(--color-primary)]" />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Confirmed</p>
                  <p className="mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">{confirmedOrders}</p>
                </article>
                <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--color-primary)_96%,black_4%),color-mix(in_srgb,var(--color-primary)_72%,white_28%))] p-5 text-white">
                  <User2 size={18} />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/68">Total value</p>
                  <p className="mt-2 text-2xl font-extrabold tracking-[-0.05em]">{totalSpent ? formatCurrency(totalSpent) : "NGN 0"}</p>
                </article>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
              <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_20px_46px_-34px_rgba(14,42,71,0.18)] sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                  Latest order snapshot
                </p>
                {latestOrder ? (
                  <>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                      {latestOrder.productName}
                    </h2>
                    <div className="mt-5 grid gap-3 text-sm leading-7 text-[var(--color-muted)] sm:grid-cols-2">
                      <p>Reference: {latestOrder.reference}</p>
                      <p>Tracking slug: {latestOrder.trackingSlug}</p>
                      <p>Order ID: {latestOrder.id}</p>
                      <p>Created: {formatDateTime(latestOrder.createdAt)}</p>
                    </div>
                    <div className="mt-5 rounded-[1.3rem] bg-[var(--color-accent)] p-4">
                      <p className="text-sm font-bold text-[var(--color-ink)]">
                        {getOrderStatusMeta(latestOrder.status).label}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                        {getOrderStatusMeta(latestOrder.status).summary}
                      </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href={`/orders/${latestOrder.reference}`} className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white">
                        Open order
                      </Link>
                      <Link href="/notifications" className="rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)]">
                        Check notifications
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                      No tracked orders yet
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                      As soon as you place an order while signed in, it will appear here with its ID, tracking slug, and current status.
                    </p>
                    <div className="mt-6">
                      <Link href="/checkout/order" className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white">
                        Start your first order
                      </Link>
                    </div>
                  </>
                )}
              </article>

              <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_20px_46px_-34px_rgba(14,42,71,0.18)] sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
                    <Bell size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                      Customer updates
                    </p>
                    <h2 className="mt-1 text-3xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                      One place for store and order alerts
                    </h2>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    "Product listings added by Sunpilot.",
                    "Order submission and payment review notices.",
                    "Confirmation and delivery updates in one feed.",
                  ].map((item) => (
                    <div key={item} className="rounded-[1.1rem] border border-[var(--color-line)] bg-[var(--color-accent)] px-4 py-3 text-sm text-[var(--color-muted)]">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/notifications" className="inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white">
                    Open notifications
                  </Link>
                </div>
              </article>
            </section>
          </>
        ) : (
          <section className="space-y-6">
            <AccountAccessPanel redirectTo={redirectTo} />
            <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_20px_46px_-34px_rgba(14,42,71,0.16)] sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                Guest checkout still works
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                Customers can order first and sign in later if needed.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                Signing in gives a better experience, but it does not block someone from buying. They can continue to the order screen and still submit payment proof remotely.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/checkout/order" className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white">
                  Continue to order
                </Link>
                <Link href="/products" className="rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)]">
                  Browse products
                </Link>
              </div>
            </article>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
