import Link from "next/link";
import { Bell, Box, PackageSearch } from "lucide-react";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { getCurrentUser } from "@/lib/auth";
import { getCustomerOrders, getProducts } from "@/lib/data";
import { formatDateTime, getOrderStatusMeta } from "@/lib/utils";

type FeedItem = {
  id: string;
  title: string;
  body: string;
  tag: string;
  href: string;
  createdAt: string;
};

export default async function NotificationsPage() {
  const [user, products] = await Promise.all([getCurrentUser(), getProducts()]);
  const orders = user ? await getCustomerOrders(user.id) : [];

  const publicItems: FeedItem[] = products.map((product) => ({
    id: `product-${product.id}`,
    title: `${product.name} is available to order`,
    body: `Sunpilot listed this product in the ${product.collection} collection so customers can browse and order online.`,
    tag: "Product update",
    href: `/products/${product.slug}`,
    createdAt: product.createdAt,
  }));

  const orderItems: FeedItem[] = orders.flatMap((order) => {
    const status = getOrderStatusMeta(order.status);
    return [
      {
        id: `order-created-${order.id}`,
        title: `Order created for ${order.productName}`,
        body: `Order ${order.reference} was submitted and assigned tracking slug ${order.trackingSlug}.`,
        tag: "Order",
        href: `/orders/${order.reference}`,
        createdAt: order.createdAt,
      },
      {
        id: `order-status-${order.id}`,
        title: status.label,
        body: `${status.summary} Reference: ${order.reference}.`,
        tag: "Status",
        href: `/orders/${order.reference}`,
        createdAt: order.createdAt,
      },
    ];
  });

  const feed = [...orderItems, ...publicItems].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <section className="ui-panel-soft p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="ui-section-label">Notifications</p>
              <h1 className="mt-3 max-w-4xl text-5xl font-extrabold tracking-[-0.06em] text-[var(--color-ink)] sm:text-6xl">
                Product launches, order activity, and delivery updates in one feed.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                When signed in, this screen mixes store updates with your customer-specific order progress.
              </p>
            </div>
            <div className="ui-panel px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Signed in
              </p>
              <p className="mt-2 text-lg font-extrabold text-[var(--color-ink)]">
                {user ? user.fullName : "Store feed only"}
              </p>
            </div>
          </div>
        </section>

        {!user ? (
          <section className="ui-panel p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-[var(--color-primary)]" />
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                Sign in to also see your order payments, confirmations, and delivery progress here.
              </p>
            </div>
            <div className="mt-5">
              <Link href="/account?next=/notifications" className="ui-button ui-button-primary">
                Open Account Access
              </Link>
            </div>
          </section>
        ) : null}

        {feed.length ? (
          <section className="grid gap-4">
            {feed.map((item) => (
              <article key={item.id} className="ui-panel p-6">
                <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-start">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
                    {item.tag === "Product update" ? <Box size={20} /> : <PackageSearch size={20} />}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="ui-pill ui-pill-solid">{item.tag}</span>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        {formatDateTime(item.createdAt)}
                      </span>
                    </div>
                    <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
                      {item.title}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">{item.body}</p>
                  </div>
                  <div className="flex items-center">
                    <Link href={item.href} className="ui-button ui-button-outline">
                      Open
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="ui-panel p-8 text-center">
            <Bell size={28} className="mx-auto text-[var(--color-primary)]" />
            <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
              No notifications yet
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Once products are live or orders are submitted, this screen will begin to fill with updates.
            </p>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
