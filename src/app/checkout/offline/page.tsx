import Link from "next/link";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { OfflineOrderForm } from "@/components/store/offline-order-form";
import { getDeliveryStates, getPaymentAccount, getProducts } from "@/lib/data";
import { hasServiceRoleConfig } from "@/lib/supabase/env";
import { formatCurrency } from "@/lib/utils";

export default async function OfflineCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const params = await searchParams;
  const [products, deliveryStates] = await Promise.all([
    getProducts(),
    getDeliveryStates(),
  ]);
  const paymentAccount = await getPaymentAccount();
  const paymentDetails = paymentAccount ?? {
    bankName: "Update In Admin",
    accountName: "Add Account Name",
    accountNumber: "Add Account Number",
    note: "Update the payment account details in the admin dashboard before accepting live transfer orders.",
  };
  const selectedProduct =
    products.find((product) => product.slug === params.product) ?? products[0];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Offline Checkout
          </p>
          <h1 className="mt-2 font-display text-6xl leading-none">
            Bank transfer first, manual confirmation after
          </h1>
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
                  Amount:{" "}
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
                  {paymentDetails.bankName}
                </h2>
                <p className="mt-4 text-lg font-semibold">
                  {paymentDetails.accountName}
                </p>
                <p className="mt-1 text-3xl font-extrabold tracking-[0.14em]">
                  {paymentDetails.accountNumber}
                </p>
                <p className="mt-4 text-sm leading-7 text-white/80">
                  {paymentDetails.note}
                </p>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[var(--color-line)] bg-[rgba(255,249,241,0.84)] p-6 lg:p-8">
              <OfflineOrderForm
                product={selectedProduct}
                deliveryStates={deliveryStates}
                liveMode={hasServiceRoleConfig}
              />
            </section>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-[rgba(255,249,241,0.74)] p-10">
            <h2 className="font-display text-4xl">No products are listed yet</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Offline checkout is wired, but a customer can only place an order
              after at least one product is created and listed in Supabase.
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="/admin/dashboard"
                className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white"
              >
                Open admin dashboard
              </Link>
              <Link
                href="/catalog"
                className="rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold"
              >
                Go to catalog
              </Link>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
