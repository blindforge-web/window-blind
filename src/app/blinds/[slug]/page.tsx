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
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <ProductVisual product={product} className="min-h-[32rem]" />

          <section className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                {product.collection}
              </p>
              <h1 className="font-display text-6xl leading-none">{product.name}</h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--color-muted)]">
                {product.description}
              </p>
            </div>

            <div className="rounded-[2rem] border border-[var(--color-line)] bg-[rgba(255,249,241,0.82)] p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-[var(--color-muted)]">Starting from</p>
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-extrabold">
                      {formatCurrency(currentPrice)}
                    </p>
                    {product.salePrice ? (
                      <p className="text-lg text-[var(--color-muted)] line-through">
                        {formatCurrency(product.basePrice)}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="text-sm text-[var(--color-muted)]">
                  <p>Lead time: {product.leadTime}</p>
                  <p>
                    Rating: {product.rating}/5 from {product.reviewCount} signals
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/70 p-6">
                <h2 className="text-lg font-extrabold">Measurements</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.measurements.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--color-line)] px-3 py-2 text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
              <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/70 p-6">
                <h2 className="text-lg font-extrabold">Colors</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.colors.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--color-line)] px-3 py-2 text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            </div>

            <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/70 p-6">
              <h2 className="text-lg font-extrabold">Why clients choose this blind</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-[var(--color-muted)] md:grid-cols-2">
                {product.features.map((item) => (
                  <li key={item} className="rounded-2xl bg-[rgba(138,103,69,0.06)] px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <div className="flex flex-wrap gap-4">
              <Link
                href={`/checkout/offline?product=${product.slug}`}
                className="rounded-full bg-[var(--color-ink)] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[var(--color-forest)]"
              >
                Order this blind
              </Link>
              <Link
                href="/catalog"
                className="rounded-full border border-[var(--color-line)] px-6 py-4 text-sm font-semibold"
              >
                Back to catalog
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
