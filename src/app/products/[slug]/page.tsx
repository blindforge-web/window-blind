import Link from "next/link";
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
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/products"
            className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
          >
            Back to catalog
          </Link>
          <p className="text-sm leading-7 text-[var(--color-muted)]">
            {product.collection} / {product.name}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-5">
            <ProductVisual product={product} className="min-h-[34rem]" />

            <div className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white/88 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Lead time
                </p>
                <p className="mt-3 text-lg font-extrabold text-[var(--color-ink)]">
                  {product.leadTime}
                </p>
              </article>
              <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white/88 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Rating
                </p>
                <p className="mt-3 text-lg font-extrabold text-[var(--color-ink)]">
                  {product.rating}/5
                </p>
              </article>
              <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white/88 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Reviews
                </p>
                <p className="mt-3 text-lg font-extrabold text-[var(--color-ink)]">
                  {product.reviewCount}
                </p>
              </article>
            </div>
          </div>

          <section className="space-y-6">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                {product.collection}
              </p>
              <h1 className="font-display text-6xl leading-none">{product.name}</h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--color-muted)]">
                {product.description}
              </p>
            </div>

            <div className="rounded-[2.2rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,247,251,0.88))] p-6">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-medium text-[var(--color-muted)]">Starting from</p>
                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-4xl font-extrabold text-[var(--color-ink)]">
                      {formatCurrency(currentPrice)}
                    </p>
                    {product.salePrice ? (
                      <p className="text-lg text-[var(--color-muted)] line-through">
                        {formatCurrency(product.basePrice)}
                      </p>
                    ) : null}
                  </div>
                </div>
                {product.badge ? (
                  <span className="rounded-full bg-[color-mix(in_srgb,var(--color-secondary)_14%,white_86%)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]">
                    {product.badge}
                  </span>
                ) : null}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/checkout/offline?product=${product.slug}`}
                  className="rounded-full bg-[var(--color-primary)] px-6 py-4 text-sm font-semibold text-white"
                >
                  Order this product
                </Link>
                <Link
                  href="/products"
                  className="rounded-full border border-[var(--color-line)] px-6 py-4 text-sm font-semibold"
                >
                  Keep browsing
                </Link>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/80 p-6">
                <h2 className="text-lg font-extrabold">Available sizes</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.measurements.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
              <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/80 p-6">
                <h2 className="text-lg font-extrabold">Available colours</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.colors.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            </div>

            <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/80 p-6">
              <h2 className="text-lg font-extrabold">Why customers choose this product</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-[var(--color-muted)] md:grid-cols-2">
                {product.features.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl bg-[color-mix(in_srgb,var(--color-secondary)_10%,white_90%)] px-4 py-3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[2rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-primary)_94%,white_6%)] p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                Best for
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.idealFor.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/18 bg-white/10 px-3 py-2 text-sm font-medium text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
