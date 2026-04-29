import Link from "next/link";
import type { ReactNode } from "react";
import {
  Bell,
  BookOpen,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  PackageOpen,
  Settings,
  ShoppingBag,
  Truck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { AdminNotificationsRealtimeRefresh } from "@/components/admin/admin-notifications-realtime-refresh";
import { SignOutButton } from "@/components/admin/sign-out-button";
import type { AdminIdentity } from "@/lib/types";
import { getUnreadAdminNotificationCount } from "@/lib/data";
import { cn, formatCompactNumber, formatStatusLabel, getInitials } from "@/lib/utils";

type AdminNavId =
  | "dashboard"
  | "orders"
  | "support"
  | "notifications"
  | "products"
  | "delivery"
  | "settings"
  | "team"
  | "guide";

type AdminNavItem = {
  id: AdminNavId;
  label: string;
  href: string;
  icon: LucideIcon;
};

const navGroups: Array<{ label: string; items: AdminNavItem[] }> = [
  {
    label: "Daily work",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { id: "orders", label: "Orders", href: "/admin/orders", icon: PackageOpen },
      { id: "support", label: "Support", href: "/admin/support", icon: Inbox },
      { id: "notifications", label: "Notifications", href: "/admin/notifications", icon: Bell },
    ],
  },
  {
    label: "Store",
    items: [
      { id: "products", label: "Products", href: "/admin/products", icon: ShoppingBag },
      { id: "delivery", label: "Delivery", href: "/admin/delivery", icon: Truck },
      { id: "settings", label: "Site Settings", href: "/admin/site-settings", icon: Settings },
    ],
  },
  {
    label: "Team",
    items: [
      { id: "team", label: "Admins", href: "/admin/team", icon: UsersRound },
      { id: "guide", label: "Guide", href: "/admin/guide", icon: BookOpen },
    ],
  },
];

const flatNav: AdminNavItem[] = navGroups.flatMap((group) => group.items);

export async function AdminShell({
  admin,
  active,
  title,
  subtitle,
  actions,
  children,
}: {
  admin: AdminIdentity | null;
  active: AdminNavId;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const unreadCount = admin ? await getUnreadAdminNotificationCount() : 0;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)] text-[var(--color-ink)]">
      {admin ? <AdminNotificationsRealtimeRefresh /> : null}
      <div className="mx-auto flex max-w-[92rem] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 flex-col rounded-[1.4rem] border border-[var(--color-line)] bg-white/95 p-4 shadow-[0_24px_70px_-52px_rgba(14,42,71,0.36)] lg:flex">
          <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-2xl px-2 py-2">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-sm font-extrabold text-white">
              SP
            </span>
            <span>
              <span className="block text-lg font-extrabold tracking-[-0.04em]">
                Sunpilot Admin
              </span>
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                Operations
              </span>
            </span>
          </Link>

          <nav className="mt-6 flex-1 space-y-6 overflow-y-auto pr-1">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {group.label}
                </p>
                <div className="mt-2 space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.id;
                    const showBadge = item.id === "notifications" && unreadCount > 0;

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm font-bold",
                          isActive
                            ? "bg-[var(--color-primary)] text-white"
                            : "text-[var(--color-muted)] hover:bg-[var(--color-accent)] hover:text-[var(--color-ink)]",
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Icon size={18} />
                          <span className="truncate">{item.label}</span>
                        </span>
                        {showBadge ? (
                          <span className="rounded-full bg-[var(--color-secondary)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-ink)]">
                            {formatCompactNumber(unreadCount)}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="border-t border-[var(--color-line)] pt-4">
            <Link
              href="/"
              className="mb-3 flex items-center justify-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-bold text-[var(--color-ink)]"
            >
              <ExternalLink size={16} />
              View website
            </Link>
            {admin ? <SignOutButton /> : null}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 -mx-4 border-b border-[var(--color-line)] bg-white/94 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:rounded-[1.4rem] lg:border lg:px-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-secondary)]">
                  Admin workspace
                </p>
                <h1 className="mt-1 truncate text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">
                  {title}
                </h1>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {actions}
                <Link
                  href="/admin/notifications"
                  className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line)] bg-white"
                  aria-label="Admin notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 ? (
                    <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[var(--color-secondary)] px-1.5 py-0.5 text-center text-[10px] font-extrabold">
                      {formatCompactNumber(unreadCount)}
                    </span>
                  ) : null}
                </Link>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-extrabold text-white">
                  {admin ? getInitials(admin.fullName) : "A"}
                </span>
              </div>
            </div>
            {subtitle ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-muted)]">
                {subtitle}
              </p>
            ) : null}
            {admin ? (
              <p className="mt-2 text-xs font-semibold text-[var(--color-muted)]">
                {admin.fullName} · {formatStatusLabel(admin.role)}
              </p>
            ) : null}

            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {flatNav.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                const showBadge = item.id === "notifications" && unreadCount > 0;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "relative inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold",
                      isActive
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-line)] bg-white text-[var(--color-muted)]",
                    )}
                  >
                    <Icon size={15} />
                    {item.label}
                    {showBadge ? (
                      <span className="rounded-full bg-[var(--color-secondary)] px-1.5 py-0.5 text-[9px] font-extrabold text-[var(--color-ink)]">
                        {formatCompactNumber(unreadCount)}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </header>

          <main className="space-y-6 py-6 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
