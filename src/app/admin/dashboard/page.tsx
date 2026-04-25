import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPasswordResetPanel } from "@/components/admin/admin-password-reset-panel";
import { CreateProductPanel } from "@/components/admin/create-product-panel";
import { DeliveryStateCard } from "@/components/admin/delivery-state-card";
import { OrderAdminRow } from "@/components/admin/order-admin-row";
import { OrdersRealtimeRefresh } from "@/components/admin/orders-realtime-refresh";
import { ProductAdminCard } from "@/components/admin/product-admin-card";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { SiteHeader } from "@/components/navigation/site-header";
import { getCurrentAdmin } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/data";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import { formatCompactNumber } from "@/lib/utils";

const dashboardViews = [
  {
    id: "overview",
    label: "Overview",
    description: "Daily store summary and quick access.",
  },
  {
    id: "products",
    label: "Products",
    description: "Create and update product listings.",
  },
  {
    id: "orders",
    label: "Orders",
    description: "Review payments and update delivery status.",
  },
  {
    id: "setup",
    label: "Store Setup",
    description: "Delivery coverage and links to site settings.",
  },
  {
    id: "security",
    label: "Security",
    description: "Restricted admin account tools.",
  },
] as const;

type DashboardViewId = (typeof dashboardViews)[number]["id"];

function isDashboardView(value?: string): value is DashboardViewId {
  return dashboardViews.some((view) => view.id === value);
}

function PanelHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-4xl leading-none">{title}</h2>
      {body ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
          {body}
        </p>
      ) : null}
    </div>
  );
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const admin = hasPublicSupabaseConfig ? await getCurrentAdmin() : null;

  if (hasPublicSupabaseConfig && !admin) {
    redirect("/admin/login");
  }

  const dashboard = await getAdminDashboardData();
  const actionsEnabled = Boolean(admin);
  const selectedView = isDashboardView(params.view) ? params.view : "overview";
  const activeView = dashboardViews.find((view) => view.id === selectedView) ?? dashboardViews[0];

  const pendingOrders = dashboard.orders.filter((order) => order.status === "pending").length;
  const activeProducts = dashboard.products.filter((product) => product.isListed).length;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      {actionsEnabled ? <OrdersRealtimeRefresh /> : null}

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-12 lg:px-10">
        <section className="rounded-[2.7rem] border border-[var(--color-line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,247,251,0.9))] p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                Admin Dashboard
              </p>
              <h1 className="mt-2 font-display text-6xl leading-none">
                Product-first admin workspace
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                This dashboard is now focused on the work that matters most every day:
                products, orders, payment setup, delivery coverage, and contact details.
                Public-site content and branding now live in a separate site settings screen.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/site-settings"
                className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
              >
                Open site settings
              </Link>
              {admin ? <SignOutButton /> : null}
            </div>
          </div>
        </section>

        {!hasPublicSupabaseConfig ? (
          <div className="rounded-[1.8rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
            Supabase environment values are missing. The dashboard shell is visible,
            but live authentication and editing are disabled until the public keys are configured.
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-4 lg:sticky lg:top-24">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Admin Views
            </p>
            <nav className="mt-3 space-y-2">
              {dashboardViews.map((view) => {
                const isActive = selectedView === view.id;
                return (
                  <Link
                    key={view.id}
                    href={`/admin/dashboard?view=${view.id}`}
                    className={`block rounded-2xl border px-3 py-3 transition ${
                      isActive
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-line)] bg-white text-[var(--color-ink)]"
                    }`}
                  >
                    <p className="text-sm font-bold">{view.label}</p>
                    <p
                      className={`mt-1 text-xs leading-5 ${
                        isActive ? "text-white/80" : "text-[var(--color-muted)]"
                      }`}
                    >
                      {view.description}
                    </p>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="space-y-8">
            <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                {activeView.label}
              </p>
              <h2 className="mt-2 font-display text-4xl leading-none">
                {activeView.description}
              </h2>
            </section>

            {selectedView === "overview" ? (
              <>
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Listed products", formatCompactNumber(activeProducts)],
                    ["All products", formatCompactNumber(dashboard.products.length)],
                    ["Pending orders", formatCompactNumber(pendingOrders)],
                    ["Delivery states", formatCompactNumber(dashboard.deliveryStates.length)],
                  ].map(([label, value]) => (
                    <article
                      key={label}
                      className="rounded-[1.8rem] border border-[var(--color-line)] bg-white/90 p-5"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                        {label}
                      </p>
                      <p className="mt-3 font-display text-4xl">{value}</p>
                    </article>
                  ))}
                </section>

                <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
                  <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6">
                    <PanelHeading
                      eyebrow="Quick access"
                      title="Main admin actions"
                      body="Most admin work should happen in these three areas."
                    />
                    <div className="grid gap-3 md:grid-cols-3">
                      <Link
                        href="/admin/dashboard?view=products"
                        className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-4 text-sm font-semibold"
                      >
                        Manage products
                      </Link>
                      <Link
                        href="/admin/dashboard?view=orders"
                        className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-4 text-sm font-semibold"
                      >
                        Review orders
                      </Link>
                      <Link
                        href="/admin/dashboard?view=setup"
                        className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-4 text-sm font-semibold"
                      >
                        Delivery setup
                      </Link>
                      <Link
                        href="/admin/site-settings"
                        className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-4 text-sm font-semibold"
                      >
                        Site settings
                      </Link>
                    </div>
                  </section>

                  <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6">
                    <PanelHeading
                      eyebrow="Scope"
                      title="What moved"
                      body="Homepage sections, service imagery, team imagery, navigation, social links, branding, gallery, and client content now live on the dedicated site settings screen."
                    />
                    <p className="text-sm leading-7 text-[var(--color-muted)]">
                      The workflow is now simpler: keep daily operational work here, and use the
                      dedicated site settings screen for public-site content management.
                    </p>
                  </section>
                </section>
              </>
            ) : null}

            {selectedView === "products" ? (
              <>
                <CreateProductPanel actionsEnabled={actionsEnabled} />

                <section className="space-y-5">
                  <PanelHeading
                    eyebrow="Catalog"
                    title="Existing products"
                    body="Use the essential fields first. Advanced styling and merchandising options are still available, but they are now kept behind shorter editing surfaces."
                  />

                  {dashboard.products.length ? (
                    <div className="grid gap-5 xl:grid-cols-2">
                      {dashboard.products.map((product) => (
                        <ProductAdminCard
                          key={product.id}
                          product={product}
                          actionsEnabled={actionsEnabled}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/92 p-8">
                      <h3 className="font-display text-4xl">No products created yet</h3>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                        Create the first product listing above.
                      </p>
                    </div>
                  )}
                </section>
              </>
            ) : null}

            {selectedView === "orders" ? (
              <section className="space-y-5">
                <PanelHeading
                  eyebrow="Orders"
                  title="Offline order queue"
                  body="Incoming orders appear here so admins can verify payment proof and update status quickly."
                />

                {dashboard.orders.length ? (
                  <div className="space-y-4">
                    {dashboard.orders.map((order) => (
                      <OrderAdminRow
                        key={order.id}
                        order={order}
                        actionsEnabled={actionsEnabled}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/92 p-8">
                    <h3 className="font-display text-4xl">No orders yet</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                      New customer orders will appear here.
                    </p>
                  </div>
                )}
              </section>
            ) : null}

            {selectedView === "setup" ? (
              <>
                <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6">
                  <PanelHeading
                    eyebrow="Scope"
                    title="Site-managed settings moved out"
                    body="Payment account details, contact information, navigation, team, gallery, services, and other public-site content now live only in the dedicated site settings screen."
                  />
                  <Link
                    href="/admin/site-settings"
                    className="inline-flex rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
                  >
                    Open site settings
                  </Link>
                </section>

                <section className="space-y-5">
                  <PanelHeading
                    eyebrow="Delivery"
                    title="Delivery state coverage"
                    body="These states are used during checkout."
                  />

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {dashboard.deliveryStates.map((deliveryState) => (
                      <DeliveryStateCard
                        key={deliveryState.code}
                        deliveryState={deliveryState}
                        actionsEnabled={actionsEnabled}
                      />
                    ))}
                  </div>
                </section>
              </>
            ) : null}

            {selectedView === "security" && admin?.role === "super_admin" ? (
              <AdminPasswordResetPanel />
            ) : null}

            {selectedView === "security" && admin?.role !== "super_admin" ? (
              <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6 text-sm text-[var(--color-muted)]">
                Only `super_admin` accounts can access security tools.
              </section>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
