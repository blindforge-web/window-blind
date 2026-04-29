import Link from "next/link";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { OfflineOrderForm } from "@/components/store/offline-order-form";
import { ProductVisual } from "@/components/store/product-visual";
import { getCurrentUser } from "@/lib/auth";
import { getDeliveryStates, getPaymentAccount, getProducts } from "@/lib/data";
import { hasServiceRoleConfig } from "@/lib/supabase/env";
import { formatCurrency } from "@/lib/utils";

export default async function CheckoutOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const params = await searchParams;
  const [products, deliveryStates, currentUser] = await Promise.all([
    getProducts(),
    getDeliveryStates(),
    getCurrentUser(),
  ]);
  const paymentAccount = await getPaymentAccount();
  const selectedProduct =
    products.find((product) => product.slug === params.product) ?? products[0];

  const activeStates = deliveryStates.filter((item) => item.isActive);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <section className="rounded-[2.8rem] border border-[var(--color-line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,247,251,0.9))] p-8 lg:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                Order checkout
              </p>
              <h1 className="mt-3 font-display text-6xl leading-none">
                Confirm your specification and submit your order with confidence.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                Review the selected blind, confirm delivery details, and attach your transfer
                receipt in one guided flow designed for real customer orders.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    01
                  </p>
                  <p className="mt-2 text-sm font-bold text-[var(--color-ink)]">
                    Review selection
                  </p>
                </article>
                <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    02
                  </p>
                  <p className="mt-2 text-sm font-bold text-[var(--color-ink)]">
                    Confirm delivery
                  </p>
                </article>
                <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    03
                  </p>
                  <p className="mt-2 text-sm font-bold text-[var(--color-ink)]">
                    Upload receipt
                  </p>
                </article>
              </div>
            </div>

            <div className="rounded-[2.2rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-primary)_94%,white_6%)] p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                Account and support
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-white/82">
                <p>
                  {currentUser
                    ? `Signed in as ${currentUser.email}. This order will appear in your account timeline.`
                    : "You can continue as a guest, but account access gives you a cleaner order history and receipt archive."}
                </p>
                <p>
                  {activeStates.length} delivery destination
                  {activeStates.length === 1 ? "" : "s"} currently available.
                </p>
                <p>
                  {paymentAccount?.bankName
                    ? `Transfers are received through ${paymentAccount.bankName}.`
                    : "Transfers will be routed to the business account currently configured."}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/orders"
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
                >
                  Track orders
                </Link>
                <Link
                  href="/products"
                  className="rounded-2xl border border-white/18 px-5 py-3 text-sm font-semibold text-white"
                >
                  Browse catalog
                </Link>
              </div>
            </div>
          </div>

          {products.length ? (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                Available collections
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {products.map((product) => {
                  const isActive = selectedProduct?.slug === product.slug;
                  return (
                    <Link
                      key={product.id}
                      href={`/checkout/order?product=${product.slug}`}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                        isActive
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                          : "border-[var(--color-line)] bg-white text-[var(--color-ink)]"
                      }`}
                    >
                      {product.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </section>

        {selectedProduct ? (
          <div className="mt-10 grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
            <section className="space-y-6">
              <Link
                href={`/products/${selectedProduct.slug}`}
                className="block overflow-hidden rounded-[2.4rem] border border-[var(--color-line)] bg-white/90 shadow-[0_22px_50px_-35px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5"
              >
                <div className="p-4">
                  <ProductVisual product={selectedProduct} className="min-h-[22rem]" />
                </div>
                <div className="space-y-5 px-6 pb-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        {selectedProduct.collection}
                      </p>
                      <h2 className="mt-2 text-3xl font-extrabold text-[var(--color-ink)]">
                        {selectedProduct.name}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-[var(--color-muted)]">
                        Open the full product page for extended details and visuals.
                      </p>
                    </div>
                    <span className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
                      Product details
                    </span>
                  </div>

                  <p className="text-sm leading-7 text-[var(--color-muted)]">
                    {selectedProduct.shortDescription}
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-[rgba(248,250,252,0.84)] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                        Unit price
                      </p>
                      <p className="mt-2 text-3xl font-extrabold text-[var(--color-ink)]">
                        {formatCurrency(
                          selectedProduct.salePrice ?? selectedProduct.basePrice,
                        )}
                      </p>
                    </div>
                    <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-[rgba(248,250,252,0.84)] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                        Lead time
                      </p>
                      <p className="mt-2 text-lg font-extrabold text-[var(--color-ink)]">
                        {selectedProduct.leadTime}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(160deg,var(--color-primary),color-mix(in_srgb,var(--color-primary)_68%,black_32%))] p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  Transfer instructions
                </p>
                <h2 className="mt-3 text-3xl font-extrabold">
                  {paymentAccount?.bankName || "Business transfer account"}
                </h2>
                {paymentAccount?.accountName ? (
                  <p className="mt-3 text-lg font-semibold">{paymentAccount.accountName}</p>
                ) : null}
                {paymentAccount?.accountNumber ? (
                  <p className="mt-1 text-3xl font-extrabold tracking-[0.14em]">
                    {paymentAccount.accountNumber}
                  </p>
                ) : null}
                <p className="mt-4 text-sm leading-7 text-white/80">
                  {paymentAccount?.note ||
                    "Transfer to the configured business account, then attach the receipt so the order can move into confirmation."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/90 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Order record
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    Every submission stores the product, measurements, delivery destination,
                    and receipt reference for follow-up.
                  </p>
                </article>
                <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/90 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Account tracking
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    Return to your orders screen at any time to review IDs, tracking slugs,
                    and submitted order history.
                  </p>
                </article>
              </div>
            </section>

            <section className="rounded-[2.4rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,251,0.92))] p-6 lg:p-8">
              <OfflineOrderForm
                product={selectedProduct}
                deliveryStates={deliveryStates}
                liveMode={hasServiceRoleConfig}
                loggedIn={Boolean(currentUser)}
                initialCustomerName={currentUser?.fullName ?? ""}
                initialEmail={currentUser?.email ?? ""}
              />
            </section>
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/70 p-10">
            <h2 className="font-display text-4xl">No products are listed yet</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Publish at least one product before opening ordering to customers.
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="/products"
                className="rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold"
              >
                Browse products
              </Link>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
