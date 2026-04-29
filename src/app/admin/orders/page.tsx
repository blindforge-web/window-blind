import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, PackageCheck, Search } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentAdmin } from "@/lib/auth";
import {
  getAdminOrders,
  getAdminOrderStatusCounts,
} from "@/lib/data";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import type { OrderItem } from "@/lib/types";
import {
  formatCompactNumber,
  formatCurrency,
  formatDateTime,
  formatStatusLabel,
} from "@/lib/utils";

const statusTabs: Array<{
  id: OrderItem["status"] | "all";
  label: string;
}> = [
  { id: "all", label: "All orders" },
  { id: "pending", label: "Pending" },
  { id: "paid", label: "Paid" },
  { id: "paid_delivered", label: "Delivered" },
];

function getStatus(value?: string): OrderItem["status"] | "all" {
  return statusTabs.some((tab) => tab.id === value)
    ? (value as OrderItem["status"] | "all")
    : "all";
}

function StatusPill({ status }: { status: OrderItem["status"] }) {
  const tone =
    status === "pending"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : status === "paid"
        ? "border-sky-200 bg-sky-50 text-sky-900"
        : "border-emerald-200 bg-emerald-50 text-emerald-900";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-extrabold uppercase ${tone}`}>
      {formatStatusLabel(status)}
    </span>
  );
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const admin = hasPublicSupabaseConfig ? await getCurrentAdmin() : null;

  if (hasPublicSupabaseConfig && !admin) {
    redirect("/admin/login");
  }

  const selectedStatus = getStatus(params.status);
  const query = params.q?.trim() ?? "";
  const [orders, counts] = await Promise.all([
    getAdminOrders({ status: selectedStatus, query }),
    getAdminOrderStatusCounts(),
  ]);

  return (
    <AdminShell
      admin={admin}
      active="orders"
      title="Orders received"
      subtitle="Review every submitted blind order, search by order ID or reference, and open the full order record before updating its status."
    >
      {!hasPublicSupabaseConfig ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
          Admin data is unavailable until Supabase configuration is restored.
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statusTabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/admin/orders${tab.id === "all" ? "" : `?status=${tab.id}`}`}
            className={`rounded-2xl border bg-white p-5 ${
              selectedStatus === tab.id
                ? "border-[var(--color-primary)] shadow-[0_18px_42px_-34px_rgba(14,42,71,0.4)]"
                : "border-[var(--color-line)]"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {tab.label}
            </p>
            <p className="mt-3 text-3xl font-extrabold">
              {formatCompactNumber(counts[tab.id])}
            </p>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <form className="grid gap-3 md:grid-cols-[1fr_auto]" action="/admin/orders">
          <input type="hidden" name="status" value={selectedStatus} />
          <label className="relative block">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search by order ID, reference, customer name, phone, email, product, or state"
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white py-3 pl-11 pr-4 text-sm outline-none"
            />
          </label>
          <button type="submit" className="ui-button ui-button-primary">
            Search orders
          </button>
        </form>
      </section>

      {orders.length ? (
        <section className="space-y-3">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-[var(--color-line)] bg-white p-5"
            >
              <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr_0.75fr_auto] xl:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill status={order.status} />
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      {formatDateTime(order.createdAt)}
                    </span>
                  </div>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.04em]">
                    {order.reference}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-muted)]">
                    {order.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-extrabold">{order.name}</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{order.phone}</p>
                  {order.email ? (
                    <p className="mt-1 text-sm text-[var(--color-muted)]">{order.email}</p>
                  ) : null}
                </div>

                <div>
                  <p className="text-sm font-extrabold">{order.productName}</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    Qty {order.quantity ?? 1}
                    {typeof order.amount === "number"
                      ? ` · ${formatCurrency(order.amount)}`
                      : ""}
                  </p>
                </div>

                <Link
                  href={`/admin/orders/${order.reference}`}
                  className="ui-button ui-button-outline justify-self-start xl:justify-self-end"
                >
                  View details
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-10 text-center">
          <PackageCheck size={30} className="mx-auto text-[var(--color-primary)]" />
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em]">
            No matching orders
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
            Adjust the status tab or search term to find older order records.
          </p>
        </section>
      )}
    </AdminShell>
  );
}
