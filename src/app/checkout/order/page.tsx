import Link from "next/link";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { ContactActions } from "@/components/support/contact-actions";
import { OfflineOrderForm } from "@/components/store/offline-order-form";
import { ProductVisual } from "@/components/store/product-visual";
import { getCurrentUser } from "@/lib/auth";
import { getContactInfo, getDeliveryStates, getPaymentAccount, getProducts } from "@/lib/data";
import { hasServiceRoleConfig } from "@/lib/supabase/env";
import { formatCurrency } from "@/lib/utils";

export default async function CheckoutOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const params = await searchParams;
  const [products, deliveryStates, currentUser, contact] = await Promise.all([
    getProducts(),
    getDeliveryStates(),
    getCurrentUser(),
    getContactInfo(),
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
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="ui-section-label">Easy checkout</p>
              <h1 className="mt-3 font-display text-5xl leading-none sm:text-6xl">
                Order in three short steps.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                Pick your blind, add delivery details, upload your receipt, and submit.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {["Pick product", "Add details", "Upload receipt"].map((step, index) => (
                <span
                  key={step}
                  className="rounded-full border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)]"
                >
                  {index + 1}. {step}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="ui-pill ui-pill-solid">
              {currentUser ? "Signed in checkout" : "Guest checkout is on"}
            </span>
            <span className="ui-pill">
              {activeStates.length} delivery state{activeStates.length === 1 ? "" : "s"}
            </span>
            <span className="ui-pill">
              {paymentAccount?.bankName || "Transfer account shown in payment step"}
            </span>
          </div>

          {products.length ? (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                Choose a blind
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
          <div className="mt-10 grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
            <section className="rounded-[2.4rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,251,0.92))] p-6 lg:p-8">
              <OfflineOrderForm
                product={selectedProduct}
                deliveryStates={deliveryStates}
                paymentAccount={paymentAccount}
                liveMode={hasServiceRoleConfig}
                loggedIn={Boolean(currentUser)}
                initialCustomerName={currentUser?.fullName ?? ""}
                initialEmail={currentUser?.email ?? ""}
              />
            </section>

            <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
              <Link
                href={`/products/${selectedProduct.slug}`}
                className="block overflow-hidden rounded-[2.4rem] border border-[var(--color-line)] bg-white/90 shadow-[0_22px_50px_-35px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5"
              >
                <div className="p-4">
                  <ProductVisual product={selectedProduct} className="min-h-[20rem]" />
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
                        Open the full product page for photos and more details.
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

                  <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-[rgba(248,250,252,0.84)] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      Colours
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                      {selectedProduct.colors.join(", ")}
                    </p>
                  </div>
                </div>
              </Link>

              <section className="rounded-[2rem] border border-[var(--color-line)] bg-white/90 p-6">
                <p className="ui-section-label">Need help?</p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  You can switch products, continue as a guest, or come back later to track your
                  order.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/products" className="ui-button ui-button-outline">
                    Browse catalog
                  </Link>
                  <Link href="/orders" className="ui-button ui-button-secondary">
                    Track orders
                  </Link>
                  <Link href="/faq" className="ui-button ui-button-outline">
                    FAQ
                  </Link>
                </div>
                <ContactActions
                  contact={contact}
                  message={`Hello Sunpilot, I need help during checkout${selectedProduct ? ` for ${selectedProduct.name}` : ""}.`}
                  includeSupport={false}
                  className="mt-4"
                />
              </section>
            </aside>
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
                className="ui-button ui-button-outline"
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
