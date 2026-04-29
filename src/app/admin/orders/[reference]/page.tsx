import Link from "next/link";
import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  MapPin,
  PackageOpen,
  ReceiptText,
  Ruler,
  UserRound,
} from "lucide-react";
import { updateOrderStatus } from "@/app/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentAdmin } from "@/lib/auth";
import { getAdminOrderByReference } from "@/lib/data";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import type { OrderStatus } from "@/lib/types";
import { formatCurrency, formatDateTime, formatStatusLabel } from "@/lib/utils";

const statusOptions: OrderStatus[] = ["pending", "paid", "paid_delivered"];

function DetailBlock({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]">
        {icon}
        {label}
      </div>
      <p className="mt-3 text-base font-extrabold text-[var(--color-ink)]">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const admin = hasPublicSupabaseConfig ? await getCurrentAdmin() : null;

  if (hasPublicSupabaseConfig && !admin) {
    redirect("/admin/login");
  }

  const order = await getAdminOrderByReference(reference);

  if (!order) {
    notFound();
  }

  return (
    <AdminShell
      admin={admin}
      active="orders"
      title={order.reference}
      subtitle="Full order record, payment receipt access, delivery details, and status controls."
      actions={
        <Link href="/admin/orders" className="ui-button ui-button-outline hidden sm:inline-flex">
          <ArrowLeft size={16} />
          Orders
        </Link>
      }
    >
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Order ID
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em]">
                  {order.id}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Received {formatDateTime(order.createdAt)}
                </p>
              </div>
              <span className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                {formatStatusLabel(order.status)}
              </span>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <DetailBlock
              icon={<UserRound size={15} />}
              label="Customer"
              value={order.name}
            />
            <DetailBlock icon={<UserRound size={15} />} label="Phone" value={order.phone} />
            <DetailBlock icon={<UserRound size={15} />} label="Email" value={order.email} />
            <DetailBlock
              icon={<PackageOpen size={15} />}
              label="Product"
              value={order.productName}
            />
            <DetailBlock
              icon={<Banknote size={15} />}
              label="Amount"
              value={typeof order.amount === "number" ? formatCurrency(order.amount) : null}
            />
            <DetailBlock
              icon={<PackageOpen size={15} />}
              label="Quantity"
              value={order.quantity}
            />
            <DetailBlock icon={<MapPin size={15} />} label="State" value={order.deliveryState} />
            <DetailBlock icon={<MapPin size={15} />} label="Address" value={order.address} />
            <DetailBlock
              icon={<Ruler size={15} />}
              label="Width"
              value={order.width}
            />
            <DetailBlock
              icon={<Ruler size={15} />}
              label="Height"
              value={order.height}
            />
            <DetailBlock
              icon={<PackageOpen size={15} />}
              label="Colour"
              value={order.selectedColor}
            />
            <DetailBlock
              icon={<PackageOpen size={15} />}
              label="Mount and control"
              value={`${order.mountType || "Mount not set"} · ${
                order.controlSide || "Control not set"
              }`}
            />
          </section>

          <section className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Order notes
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              {order.description || "No additional note was provided."}
            </p>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Update status
            </p>
            <form action={updateOrderStatus} className="mt-4 space-y-3">
              <input type="hidden" name="orderId" value={order.id} />
              <input type="hidden" name="reference" value={order.reference} />
              <select
                name="status"
                defaultValue={order.status}
                disabled={!admin}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none disabled:opacity-60"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatStatusLabel(status)}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={!admin}
                className="ui-button ui-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save status
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              <ReceiptText size={15} />
              Payment receipt
            </div>
            {order.paymentProofUrl ? (
              <a
                href={order.paymentProofUrl}
                target="_blank"
                rel="noreferrer"
                className="ui-button ui-button-outline mt-4 w-full"
              >
                Open receipt
              </a>
            ) : order.paymentProofUploaded ? (
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                A receipt was uploaded, but a signed preview link is not available.
              </p>
            ) : (
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                No receipt file is attached to this order.
              </p>
            )}
          </section>
        </aside>
      </section>
    </AdminShell>
  );
}
