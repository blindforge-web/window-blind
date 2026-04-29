import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Bell,
  Inbox,
  PackageOpen,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { OrdersRealtimeRefresh } from "@/components/admin/orders-realtime-refresh";
import { getCurrentAdmin } from "@/lib/auth";
import {
  getAdminNotifications,
  getAdminOrderStatusCounts,
  getAdminProducts,
  getAdminSupportConversations,
  getDeliveryStates,
} from "@/lib/data";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import { formatCompactNumber, formatDateTime } from "@/lib/utils";

const quickLinks = [
  {
    title: "Review orders",
    body: "Open the order queue, filter by status, search by ID, and inspect full details.",
    href: "/admin/orders",
    icon: PackageOpen,
  },
  {
    title: "Reply to support",
    body: "Open customer messages, answer conversations, and close resolved requests.",
    href: "/admin/support",
    icon: Inbox,
  },
  {
    title: "Manage products",
    body: "Create, price, publish, and edit product listings.",
    href: "/admin/products",
    icon: ShoppingBag,
  },
  {
    title: "Delivery coverage",
    body: "Enable states, edit ETA text, and maintain checkout coverage.",
    href: "/admin/delivery",
    icon: Truck,
  },
];

export default async function AdminDashboardPage() {
  const admin = hasPublicSupabaseConfig ? await getCurrentAdmin() : null;

  if (hasPublicSupabaseConfig && !admin) {
    redirect("/admin/login");
  }

  const [orderCounts, products, conversations, deliveryStates, notifications] =
    await Promise.all([
      getAdminOrderStatusCounts(),
      getAdminProducts(),
      getAdminSupportConversations({ limit: 60 }),
      getDeliveryStates(),
      getAdminNotifications(8),
    ]);

  const listedProducts = products.filter((product) => product.isListed).length;
  const openSupport = conversations.filter(
    (conversation) => conversation.status === "open",
  ).length;
  const activeDeliveryStates = deliveryStates.filter((state) => state.isActive).length;

  return (
    <AdminShell
      admin={admin}
      active="dashboard"
      title="Operations dashboard"
      subtitle="A simple starting point for order processing, support, product updates, delivery coverage, and admin alerts."
    >
      {admin ? <OrdersRealtimeRefresh /> : null}

      {!hasPublicSupabaseConfig ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
          Store configuration is incomplete. Live admin data will return when Supabase configuration is restored.
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/admin/orders?status=pending" className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Pending orders
          </p>
          <p className="mt-3 text-3xl font-extrabold">
            {formatCompactNumber(orderCounts.pending)}
          </p>
        </Link>
        <Link href="/admin/orders" className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Total orders
          </p>
          <p className="mt-3 text-3xl font-extrabold">
            {formatCompactNumber(orderCounts.all)}
          </p>
        </Link>
        <Link href="/admin/support?status=open" className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Open support
          </p>
          <p className="mt-3 text-3xl font-extrabold">
            {formatCompactNumber(openSupport)}
          </p>
        </Link>
        <Link href="/admin/products" className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Listed products
          </p>
          <p className="mt-3 text-3xl font-extrabold">
            {formatCompactNumber(listedProducts)}
          </p>
        </Link>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-[var(--color-line)] bg-white p-5"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
                <Icon size={19} />
              </span>
              <h2 className="mt-4 text-xl font-extrabold tracking-[-0.03em]">
                {item.title}
              </h2>
              <p className="mt-2 min-h-14 text-sm leading-7 text-[var(--color-muted)]">
                {item.body}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--color-primary)]">
                Open
                <ArrowRight size={15} />
              </span>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <section className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Latest alerts
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em]">
                Admin notifications
              </h2>
            </div>
            <Link href="/admin/notifications" className="ui-button ui-button-outline">
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {notifications.length ? (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.href}
                  className="block rounded-2xl border border-[var(--color-line)] px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
                      <Bell size={15} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold">
                        {notification.title}
                      </span>
                      <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                        {formatDateTime(notification.createdAt)}
                      </span>
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-[var(--color-line)] p-5 text-sm leading-7 text-[var(--color-muted)]">
                No admin notifications yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Store readiness
          </p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--color-line)] pb-4">
              <span className="text-sm font-semibold text-[var(--color-muted)]">
                Active delivery states
              </span>
              <span className="text-lg font-extrabold">{activeDeliveryStates}</span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-[var(--color-line)] pb-4">
              <span className="text-sm font-semibold text-[var(--color-muted)]">
                Product records
              </span>
              <span className="text-lg font-extrabold">{products.length}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-[var(--color-muted)]">
                Support conversations
              </span>
              <span className="text-lg font-extrabold">{conversations.length}</span>
            </div>
          </div>
        </section>
      </section>
    </AdminShell>
  );
}
