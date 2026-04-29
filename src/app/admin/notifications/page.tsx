import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, CheckCircle2, MessageCircle, PackageOpen } from "lucide-react";
import { markAdminNotificationsRead } from "@/app/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentAdmin } from "@/lib/auth";
import { getAdminNotifications } from "@/lib/data";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import { formatCompactNumber, formatDateTime, formatStatusLabel } from "@/lib/utils";

function NotificationIcon({ type }: { type: string }) {
  if (type.includes("support") || type.includes("message")) {
    return <MessageCircle size={19} />;
  }

  if (type.includes("status")) {
    return <CheckCircle2 size={19} />;
  }

  return <PackageOpen size={19} />;
}

export default async function AdminNotificationsPage() {
  const admin = hasPublicSupabaseConfig ? await getCurrentAdmin() : null;

  if (hasPublicSupabaseConfig && !admin) {
    redirect("/admin/login");
  }

  const notifications = await getAdminNotifications();
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <AdminShell
      admin={admin}
      active="notifications"
      title="Admin notifications"
      subtitle="Every operational alert that needs admin attention, including new orders, order status changes, and customer support activity."
      actions={
        <form action={markAdminNotificationsRead} className="hidden sm:block">
          <button type="submit" className="ui-button ui-button-outline">
            Mark read
          </button>
        </form>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            All alerts
          </p>
          <p className="mt-3 text-3xl font-extrabold">
            {formatCompactNumber(notifications.length)}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Unread
          </p>
          <p className="mt-3 text-3xl font-extrabold">
            {formatCompactNumber(unreadCount)}
          </p>
        </div>
        <form action={markAdminNotificationsRead} className="rounded-2xl border border-[var(--color-line)] bg-white p-5 sm:hidden">
          <button type="submit" className="ui-button ui-button-primary w-full">
            Mark all read
          </button>
        </form>
      </section>

      {notifications.length ? (
        <section className="space-y-3">
          {notifications.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border bg-white p-5 ${
                item.isRead
                  ? "border-[var(--color-line)]"
                  : "border-[var(--color-primary)] shadow-[0_18px_42px_-36px_rgba(14,42,71,0.38)]"
              }`}
            >
              <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-start">
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${
                    item.isRead
                      ? "bg-[var(--color-accent)] text-[var(--color-primary)]"
                      : "bg-[var(--color-primary)] text-white"
                  }`}
                >
                  <NotificationIcon type={item.type} />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[var(--color-line)] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                      {formatStatusLabel(item.type)}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      {formatDateTime(item.createdAt)}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-extrabold tracking-[-0.03em]">
                    {item.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                    {item.body}
                  </p>
                </div>
                <Link href={item.href} className="ui-button ui-button-outline justify-self-start md:justify-self-end">
                  Open
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-10 text-center">
          <Bell size={30} className="mx-auto text-[var(--color-primary)]" />
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em]">
            No admin notifications
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
            Order and support alerts will appear here as soon as activity arrives.
          </p>
        </section>
      )}
    </AdminShell>
  );
}
