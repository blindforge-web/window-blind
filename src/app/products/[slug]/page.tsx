import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { ProductVisual } from "@/components/store/product-visual";
import { getProductBySlug } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const currentPrice = product.salePrice ?? product.basePrice;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]">
            <Link href="/products" className="font-semibold text-[var(--color-ink)]">
              Catalog
            </Link>
            <span>/</span>
            <span>{product.collection}</span>
            <span>/</span>
            <span>{product.name}</span>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/72 px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
          >
            <ArrowLeft size={16} />
            Back to catalog
          </Link>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
          <section className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
              <ProductVisual product={product} className="min-h-[36rem]" />

              <div className="rounded-[2.2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_84%,white_16%)] p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)] sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                  {product.collection}
                </p>
                <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)] sm:text-5xl">
                  {product.name}
                </h1>
                <p className="mt-4 text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                  {product.description}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <article className="rounded-[1.4rem] border border-[var(--color-line)] bg-white/72 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      Lead time
                    </p>
                    <p className="mt-2 text-sm font-bold text-[var(--color-ink)]">{product.leadTime}</p>
                  </article>
                  <article className="rounded-[1.4rem] border border-[var(--color-line)] bg-white/72 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      Rating
                    </p>
                    <p className="mt-2 text-sm font-bold text-[var(--color-ink)]">
                      {product.rating}/5
                    </p>
                  </article>
                  <article className="rounded-[1.4rem] border border-[var(--color-line)] bg-white/72 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      Reviews
                    </p>
                    <p className="mt-2 text-sm font-bold text-[var(--color-ink)]">
                      {product.reviewCount}
                    </p>
                  </article>
                </div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <article className="rounded-[2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-6">
                <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[var(--color-ink)]">
                  Available sizes
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.measurements.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--color-line)] bg-white/72 px-4 py-2 text-sm font-medium text-[var(--color-ink)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>

              <article className="rounded-[2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-6">
                <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[var(--color-ink)]">
                  Available colours
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.colors.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--color-line)] bg-white/72 px-4 py-2 text-sm font-medium text-[var(--color-ink)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            </div>

            <article className="rounded-[2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-6">
              <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[var(--color-ink)]">
                Why customers choose this product
              </h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {product.features.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.4rem] border border-[var(--color-line)] bg-white/68 px-4 py-4 text-sm leading-7 text-[var(--color-muted)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(140deg,color-mix(in_srgb,var(--color-primary)_97%,black_3%),color-mix(in_srgb,var(--color-primary)_76%,black_24%))] p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/68">
                Best for
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.idealFor.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/16 bg-white/8 px-4 py-2 text-sm font-medium text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          </section>

          <aside className="space-y-5 xl:sticky xl:top-28 xl:h-fit">
            <article className="rounded-[2.2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_86%,white_14%)] p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.32)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Starting price
              </p>
              <div className="mt-2 flex items-center gap-3">
                <p className="text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                  {formatCurrency(currentPrice)}
                </p>
                {product.salePrice ? (
                  <p className="text-base text-[var(--color-muted)] line-through">
                    {formatCurrency(product.basePrice)}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 rounded-[1.2rem] border border-[var(--color-line)] bg-white/70 px-4 py-3 text-sm text-[var(--color-muted)]">
                  <Truck size={16} className="mt-1 shrink-0 text-[var(--color-ink)]" />
                  <span>Delivery estimate: {product.leadTime}</span>
                </div>
                <div className="flex items-start gap-3 rounded-[1.2rem] border border-[var(--color-line)] bg-white/70 px-4 py-3 text-sm text-[var(--color-muted)]">
                  <ShieldCheck size={16} className="mt-1 shrink-0 text-[var(--color-ink)]" />
                  <span>Transfer confirmation with receipt upload and manual review.</span>
                </div>
                <div className="flex items-start gap-3 rounded-[1.2rem] border border-[var(--color-line)] bg-white/70 px-4 py-3 text-sm text-[var(--color-muted)]">
                  <Check size={16} className="mt-1 shrink-0 text-[var(--color-ink)]" />
                  <span>Order tracking remains available from the customer account area.</span>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <Link
                  href={`/checkout/order?product=${product.slug}`}
                  className="rounded-[1.2rem] bg-[var(--color-primary)] px-6 py-4 text-center text-sm font-semibold text-white"
                >
                  Order this product
                </Link>
                <Link
                  href="/account"
                  className="rounded-[1.2rem] border border-[var(--color-line)] bg-white/72 px-6 py-4 text-center text-sm font-semibold text-[var(--color-ink)]"
                >
                  Track previous orders
                </Link>
              </div>
            </article>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
