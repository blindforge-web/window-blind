import Link from "next/link";
import { CheckCircle2, Clock3, PackageCheck, Truck } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { getCurrentUser } from "@/lib/auth";
import { getCustomerOrderByReference } from "@/lib/data";
import { formatCurrency, formatDateTime, getOrderStatusMeta } from "@/lib/utils";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const user = await getCurrentUser();
  const { reference } = await params;

  if (!user) {
    redirect(`/account?next=/orders/${reference}`);
  }

  const order = await getCustomerOrderByReference(user.id, reference);

  if (!order) {
    notFound();
  }

  const status = getOrderStatusMeta(order.status);
  const timeline = [
    {
      label: "Order submitted",
      done: true,
      body: "Your product choice, measurements, and receipt were received by Sunpilot.",
      icon: Clock3,
    },
    {
      label: "Payment confirmed",
      done: order.status !== "pending",
      body: "The team confirms payment before moving the order ahead.",
      icon: CheckCircle2,
    },
    {
      label: "Delivered",
      done: order.status === "paid_delivered",
      body: "Final delivery completion is reflected in the account and notification screens.",
      icon: Truck,
    },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <section className="rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(150deg,#ffffff,rgba(234,242,255,0.94))] p-6 shadow-[0_30px_70px_-42px_rgba(14,42,71,0.22)] sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                Order detail
              </p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)] sm:text-5xl">
                {order.productName}
              </h1>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{status.summary}</p>
            </div>
            <Link href="/orders" className="ui-button ui-button-outline">
              Back to orders
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_20px_46px_-34px_rgba(14,42,71,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Tracking keys
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.3rem] bg-[var(--color-accent)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Reference</p>
                <p className="mt-2 text-lg font-extrabold text-[var(--color-ink)]">{order.reference}</p>
              </div>
              <div className="rounded-[1.3rem] bg-[var(--color-accent)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Tracking slug</p>
                <p className="mt-2 text-lg font-extrabold text-[var(--color-ink)]">{order.trackingSlug}</p>
              </div>
              <div className="rounded-[1.3rem] border border-[var(--color-line)] p-4 sm:col-span-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Order ID</p>
                <p className="mt-2 break-all text-sm font-semibold text-[var(--color-ink)]">{order.id}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--color-primary)_96%,black_4%),color-mix(in_srgb,var(--color-primary)_72%,white_28%))] p-6 text-white shadow-[0_20px_46px_-34px_rgba(14,42,71,0.28)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/68">
              Current status
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.05em]">{status.label}</h2>
            <p className="mt-4 text-sm leading-7 text-white/80">{status.summary}</p>
            <div className="mt-6 rounded-[1.2rem] border border-white/12 bg-white/10 p-4 text-sm leading-7 text-white/84">
              Submitted: {formatDateTime(order.createdAt)}
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_20px_46px_-34px_rgba(14,42,71,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Specification
            </p>
            <div className="mt-5 grid gap-3 text-sm leading-7 text-[var(--color-muted)] sm:grid-cols-2">
              <p>Product: {order.productName}</p>
              {typeof order.amount === "number" ? <p>Amount: {formatCurrency(order.amount)}</p> : null}
              {order.quantity ? <p>Quantity: {order.quantity}</p> : null}
              {order.deliveryState ? <p>State: {order.deliveryState}</p> : null}
              {order.width ? <p>Width: {order.width}</p> : null}
              {order.height ? <p>Height: {order.height}</p> : null}
              {order.selectedColor ? <p>Colour: {order.selectedColor}</p> : null}
              {order.mountType ? <p>Mount type: {order.mountType}</p> : null}
              {order.controlSide ? <p>Control side: {order.controlSide}</p> : null}
            </div>
            {order.description ? (
              <div className="mt-5 rounded-[1.2rem] bg-[var(--color-accent)] p-4 text-sm leading-7 text-[var(--color-muted)]">
                {order.description}
              </div>
            ) : null}
          </article>

          <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_20px_46px_-34px_rgba(14,42,71,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Customer and delivery
            </p>
            <div className="mt-5 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
              <p>{order.name}</p>
              <p>{order.phone}</p>
              {order.email ? <p>{order.email}</p> : null}
              <p>{order.address}</p>
            </div>
          </article>
        </section>

        <section className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_20px_46px_-34px_rgba(14,42,71,0.18)]">
          <div className="flex items-center gap-3">
            <PackageCheck size={18} className="text-[var(--color-primary)]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                Order timeline
              </p>
              <h2 className="mt-1 text-3xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                What happens next
              </h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {timeline.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.label}
                  className={`rounded-[1.4rem] border p-4 ${
                    item.done
                      ? "border-[var(--color-line)] bg-[var(--color-accent)]"
                      : "border-dashed border-[var(--color-line)] bg-white"
                  }`}
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--color-primary)] shadow-[0_10px_20px_-16px_rgba(14,42,71,0.45)]">
                    <Icon size={18} />
                  </span>
                  <p className="mt-4 text-lg font-extrabold tracking-[-0.03em] text-[var(--color-ink)]">{item.label}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{item.body}</p>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
