import Link from "next/link";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { OfflineOrderForm } from "@/components/store/offline-order-form";
import { ProductVisual } from "@/components/store/product-visual";
import { getCurrentUser } from "@/lib/auth";
import { getDeliveryStates, getPaymentAccount, getProducts } from "@/lib/data";
import { hasServiceRoleConfig } from "@/lib/supabase/env";
import { formatCurrency } from "@/lib/utils";

export default async function OfflineCheckoutPage({
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
  const selectedProduct = products.find((product) => product.slug === params.product) ?? products[0];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
              Guided Checkout
            </p>
            <h1 className="mt-2 font-display text-6xl leading-none">
              Review the product, add your order details, then upload payment proof.
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            This remains an offline payment process, but the page now behaves more like
            an ecommerce checkout with clearer order summary, shipping details, and
            payment instructions.
          </p>
        </div>

        {selectedProduct ? (
          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="space-y-6">
              <div className="overflow-hidden rounded-[2.4rem] border border-[var(--color-line)] bg-white/84">
                <div className="p-4">
                  <ProductVisual product={selectedProduct} className="min-h-[20rem]" />
                </div>
                <div className="space-y-4 px-6 pb-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                        Selected product
                      </p>
                      <h2 className="mt-2 font-display text-4xl leading-none">
                        {selectedProduct.name}
                      </h2>
                    </div>
                    <Link
                      href={`/products/${selectedProduct.slug}`}
                      className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
                    >
                      View details
                    </Link>
                  </div>
                  <p className="text-sm leading-7 text-[var(--color-muted)]">
                    {selectedProduct.shortDescription}
                  </p>
                  <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                      Unit price
                    </p>
                    <p className="mt-2 text-3xl font-extrabold text-[var(--color-ink)]">
                      {formatCurrency(selectedProduct.salePrice ?? selectedProduct.basePrice)}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                      Lead time: {selectedProduct.leadTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(160deg,var(--color-primary),color-mix(in_srgb,var(--color-primary)_68%,black_32%))] p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  Company account
                </p>
                <h2 className="mt-3 font-display text-4xl leading-none">
                  {paymentAccount?.bankName || "Offline transfer account"}
                </h2>
                {paymentAccount?.accountName ? (
                  <p className="mt-4 text-lg font-semibold">{paymentAccount.accountName}</p>
                ) : null}
                {paymentAccount?.accountNumber ? (
                  <p className="mt-1 text-3xl font-extrabold tracking-[0.14em]">
                    {paymentAccount.accountNumber}
                  </p>
                ) : null}
                <p className="mt-4 text-sm leading-7 text-white/80">
                  {paymentAccount?.note ||
                    "Transfer to the configured company account before you submit your proof of payment."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/88 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Delivery coverage
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {deliveryStates.filter((item) => item.isActive).length} active delivery
                    state{deliveryStates.filter((item) => item.isActive).length === 1 ? "" : "s"}.
                  </p>
                </article>
                <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/88 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Account status
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {currentUser
                      ? `Signed in as ${currentUser.email}. This order can appear in your account history.`
                      : "Guest checkout is allowed, but account login gives you order tracking and easier future access."}
                  </p>
                </article>
              </div>
            </section>

            <section className="rounded-[2.4rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,251,0.9))] p-6 lg:p-8">
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
          <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/70 p-10">
            <h2 className="font-display text-4xl">No products are listed yet</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Add at least one live product before opening checkout to visitors.
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
