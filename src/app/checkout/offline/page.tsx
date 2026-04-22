import Link from "next/link";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { OfflineOrderForm } from "@/components/store/offline-order-form";
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

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Offline Checkout
            </p>
            <h1 className="mt-2 font-display text-6xl leading-none">
              Transfer, upload proof, then wait for confirmation
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            Orders stay offline-payment only. After your transfer is made, upload
            the receipt here and the admin will verify payment before marking the
            order as paid or delivered.
          </p>
        </div>

        {selectedProduct ? (
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="space-y-6">
              <div className="rounded-[2rem] border border-[var(--color-line)] bg-[rgba(255,249,241,0.84)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Selected product
                </p>
                <h2 className="mt-3 font-display text-4xl leading-none">
                  {selectedProduct.name}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {selectedProduct.shortDescription}
                </p>
                <p className="mt-4 text-lg font-extrabold">
                  Unit price:{" "}
                  {formatCurrency(
                    selectedProduct.salePrice ?? selectedProduct.basePrice,
                  )}
                </p>
              </div>

              <div className="rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(160deg,#29463d,#8a6745)] p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  Company account
                </p>
                <h2 className="mt-3 font-display text-4xl leading-none">
                  {paymentAccount?.bankName || "Offline transfer account"}
                </h2>
                {paymentAccount?.accountName ? (
                  <p className="mt-4 text-lg font-semibold">
                    {paymentAccount.accountName}
                  </p>
                ) : null}
                {paymentAccount?.accountNumber ? (
                  <p className="mt-1 text-3xl font-extrabold tracking-[0.14em]">
                    {paymentAccount.accountNumber}
                  </p>
                ) : null}
                <p className="mt-4 text-sm leading-7 text-white/80">
                  {paymentAccount?.note ||
                    "Use the account details configured by the admin before submitting your proof of payment."}
                </p>
              </div>

              <div className="rounded-[2rem] border border-[var(--color-line)] bg-white/85 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Account option
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {currentUser ? (
                    <>
                      Signed in as{" "}
                      <span className="font-semibold text-[var(--color-ink)]">
                        {currentUser.email}
                      </span>
                      . This order will appear in your account history.
                    </>
                  ) : (
                    <>
                      Login is optional.{" "}
                      <Link
                        href={`/account?next=/checkout/offline?product=${selectedProduct.slug}`}
                        className="font-semibold text-[var(--color-primary)]"
                      >
                        Sign in or create an account
                      </Link>{" "}
                      if you want receipt access and order-status tracking.
                    </>
                  )}
                </p>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[var(--color-line)] bg-[rgba(255,249,241,0.84)] p-6 lg:p-8">
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
          <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-[rgba(255,249,241,0.74)] p-10">
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
