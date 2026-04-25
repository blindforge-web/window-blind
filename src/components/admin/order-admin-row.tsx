import { updateOrderStatus } from "@/app/actions";
import type { OrderItem, OrderStatus } from "@/lib/types";
import { formatCurrency, formatDateTime, formatStatusLabel } from "@/lib/utils";

const statusOptions: OrderStatus[] = ["pending", "paid", "paid_delivered"];

export function OrderAdminRow({
  order,
  actionsEnabled,
}: {
  order: OrderItem;
  actionsEnabled: boolean;
}) {
  return (
    <article className="grid gap-4 rounded-[1.8rem] border border-[var(--color-line)] bg-white/85 p-5 lg:grid-cols-[1.15fr_1fr_0.9fr_1.15fr] lg:items-start">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
          {order.reference}
        </p>
        <h3 className="text-lg font-extrabold">{order.name}</h3>
        {order.productName ? (
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-secondary)]">
            {order.productName}
          </p>
        ) : null}
        <p className="text-sm leading-7 text-[var(--color-muted)]">
          {order.description}
        </p>
      </div>

      <div className="space-y-2 text-sm text-[var(--color-muted)]">
        <p className="font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]">
          {order.orderType}
        </p>
        <p>{order.phone}</p>
        {order.email ? <p>{order.email}</p> : null}
        <p>{order.address}</p>
        {order.deliveryState ? <p>State: {order.deliveryState}</p> : null}
        {order.quantity ? <p>Quantity: {order.quantity}</p> : null}
        {typeof order.amount === "number" ? (
          <p>Amount: {formatCurrency(order.amount)}</p>
        ) : null}
        {order.paymentProofUrl ? (
          <a
            href={order.paymentProofUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[var(--color-primary)]"
          >
            View receipt
          </a>
        ) : order.paymentProofUploaded ? (
          <p>Receipt uploaded</p>
        ) : null}
        <p className="text-xs uppercase tracking-[0.16em]">
          {formatDateTime(order.createdAt)}
        </p>
      </div>

      <div className="space-y-3">
        <span className="rounded-full bg-[rgba(212,175,55,0.14)] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-secondary)]">
          {formatStatusLabel(order.status)}
        </span>
        {order.paymentProofUrl ? (
          <a
            href={order.paymentProofUrl}
            target="_blank"
            rel="noreferrer"
            className="block rounded-[1.2rem] border border-[var(--color-line)] bg-[rgba(248,250,252,0.84)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)]"
          >
            Open receipt
          </a>
        ) : null}
      </div>

      <form action={updateOrderStatus} className="space-y-3">
        <input type="hidden" name="orderId" value={order.id} />
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
          Update status
        </p>
        <select
          name="status"
          defaultValue={order.status}
          disabled={!actionsEnabled}
          className="min-w-0 w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none disabled:opacity-60"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {formatStatusLabel(status)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!actionsEnabled}
          className="w-full rounded-full bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save status
        </button>
      </form>
    </article>
  );
}
