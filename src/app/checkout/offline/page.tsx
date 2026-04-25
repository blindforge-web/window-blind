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
                Marketplace Checkout
              </p>
              <h1 className="mt-3 font-display text-6xl leading-none">
                Review your product, confirm your details, then upload your payment proof.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                This is still an offline-payment flow, but it now behaves more like a
                marketplace checkout with product switching, order review, trust cues,
                and a clearer path to account-based tracking.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Step 1
                  </p>
                  <p className="mt-2 text-sm font-bold text-[var(--color-ink)]">Choose product</p>
                </article>
                <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Step 2
                  </p>
                  <p className="mt-2 text-sm font-bold text-[var(--color-ink)]">Add delivery details</p>
                </article>
                <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Step 3
                  </p>
                  <p className="mt-2 text-sm font-bold text-[var(--color-ink)]">Upload proof and track</p>
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
                    ? `Signed in as ${currentUser.email}. This order can appear in your account history.`
                    : "Guest checkout is allowed, but signing in gives you easier order tracking and receipt access."}
                </p>
                <p>
                  {activeStates.length} active delivery state
                  {activeStates.length === 1 ? "" : "s"} available.
                </p>
                <p>
                  {paymentAccount?.bankName
                    ? `Payment destination: ${paymentAccount.bankName}.`
                    : "Payment destination will use the configured company account."}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/account"
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
                >
                  Open account
                </Link>
                <Link
                  href="/products"
                  className="rounded-2xl border border-white/18 px-5 py-3 text-sm font-semibold text-white"
                >
                  Back to catalog
                </Link>
              </div>
            </div>
          </div>

          {products.length ? (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                Switch product in checkout
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {products.map((product) => {
                  const isActive = selectedProduct?.slug === product.slug;
                  return (
                    <Link
                      key={product.id}
                      href={`/checkout/offline?product=${product.slug}`}
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
              <div className="overflow-hidden rounded-[2.4rem] border border-[var(--color-line)] bg-white/90 shadow-[0_22px_50px_-35px_rgba(15,23,42,0.28)]">
                <div className="p-4">
                  <ProductVisual product={selectedProduct} className="min-h-[22rem]" />
                </div>
                <div className="space-y-5 px-6 pb-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        Official Sunpilot Store
                      </p>
                      <h2 className="mt-2 text-3xl font-extrabold text-[var(--color-ink)]">
                        {selectedProduct.name}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-[var(--color-muted)]">
                        {selectedProduct.collection}
                      </p>
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
                        Delivery estimate
                      </p>
                      <p className="mt-2 text-lg font-extrabold text-[var(--color-ink)]">
                        {selectedProduct.leadTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(160deg,var(--color-primary),color-mix(in_srgb,var(--color-primary)_68%,black_32%))] p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  Transfer details
                </p>
                <h2 className="mt-3 text-3xl font-extrabold">
                  {paymentAccount?.bankName || "Offline transfer account"}
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
                    "Transfer to the configured company account before submitting your proof."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/90 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Checkout promise
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    Your order is recorded with product details, measurements, delivery state,
                    and payment proof for later tracking.
                  </p>
                </article>
                <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/90 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Tracking
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    Return to your account after checkout to see current status and order history.
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
