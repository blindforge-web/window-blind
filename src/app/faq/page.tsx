import Link from "next/link";
import { ArrowRight, HelpCircle, ReceiptText } from "lucide-react";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { ContactActions } from "@/components/support/contact-actions";
import { faqItems } from "@/lib/faqs";
import { getContactInfo, getPaymentAccount } from "@/lib/data";

export default async function FAQPage() {
  const [contact, paymentAccount] = await Promise.all([
    getContactInfo(),
    getPaymentAccount(),
  ]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-10 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <section className="ui-panel-soft p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="ui-section-label">FAQ</p>
              <h1 className="mt-3 max-w-4xl text-5xl font-extrabold tracking-[-0.06em] text-[var(--color-ink)] sm:text-6xl">
                Answers for ordering, payment, delivery, and support.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                Use these answers to move from product selection to checkout with clear payment and tracking expectations.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/products" className="ui-button ui-button-primary">
                  Browse products
                  <ArrowRight size={16} />
                </Link>
                <Link href="/checkout/order" className="ui-button ui-button-secondary">
                  Start order
                </Link>
                <Link href="/orders" className="ui-button ui-button-outline">
                  Track orders
                </Link>
              </div>
            </div>

            <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white/92 p-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
                  <ReceiptText size={19} />
                </span>
                <div>
                  <p className="ui-section-label">Offline payment</p>
                  <h2 className="mt-1 text-2xl font-extrabold text-[var(--color-ink)]">
                    Transfer, upload, submit
                  </h2>
                </div>
              </div>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
                <p>1. Confirm your product, measurement, quantity, and delivery state.</p>
                <p>2. Transfer the checkout total to the displayed business account.</p>
                <p>3. Upload your receipt and submit the order for admin confirmation.</p>
              </div>
              {paymentAccount?.bankName ? (
                <div className="mt-5 rounded-[1.3rem] border border-[var(--color-line)] bg-[var(--color-accent)] p-4 text-sm">
                  <p className="font-bold text-[var(--color-ink)]">{paymentAccount.bankName}</p>
                  <p className="mt-1 text-[var(--color-muted)]">{paymentAccount.accountName}</p>
                  <p className="mt-2 text-2xl font-extrabold tracking-[0.1em] text-[var(--color-ink)]">
                    {paymentAccount.accountNumber}
                  </p>
                </div>
              ) : null}
            </article>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {faqItems.map((item) => (
            <details
              key={item.id}
              className="group rounded-[1.6rem] border border-[var(--color-line)] bg-white/94 p-5 shadow-[0_20px_46px_-36px_rgba(14,42,71,0.18)]"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    {item.category}
                  </p>
                  <h2 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[var(--color-ink)]">
                    {item.question}
                  </h2>
                </div>
                <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
                  <HelpCircle size={17} />
                </span>
              </summary>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {item.answer}
              </p>
            </details>
          ))}
        </section>

        <section className="ui-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="ui-section-label">Need direct help?</p>
              <h2 className="mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                Talk to Sunpilot before you order.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                Ask about measurements, product choice, payment confirmation, delivery coverage, or an existing order.
              </p>
            </div>
            <ContactActions
              contact={contact}
              message="Hello Sunpilot, I need help after reading the FAQ."
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
