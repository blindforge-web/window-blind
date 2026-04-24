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
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--color-muted)]">
          <div className="flex flex-wrap items-center gap-2">
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
            className="rounded-full border border-[var(--color-line)] px-4 py-2 font-semibold text-[var(--color-ink)]"
          >
            Back to catalog
          </Link>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
          <section className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <ProductVisual product={product} className="min-h-[34rem]" />

              <div className="space-y-5 rounded-[2.2rem] border border-[var(--color-line)] bg-white/92 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
                  Official Sunpilot Store
                </p>
                <h1 className="text-4xl font-extrabold leading-tight text-[var(--color-ink)]">
                  {product.name}
                </h1>
                <p className="text-base leading-8 text-[var(--color-muted)]">
                  {product.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-bold text-[var(--color-ink)]">{product.rating}/5</span>
                  <span className="text-[var(--color-muted)]">
                    {product.reviewCount} customer review{product.reviewCount === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <article className="rounded-[1.4rem] border border-[var(--color-line)] bg-[rgba(248,250,252,0.82)] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      Lead time
                    </p>
                    <p className="mt-2 text-sm font-bold text-[var(--color-ink)]">
                      {product.leadTime}
                    </p>
                  </article>
                  <article className="rounded-[1.4rem] border border-[var(--color-line)] bg-[rgba(248,250,252,0.82)] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      Category
                    </p>
                    <p className="mt-2 text-sm font-bold text-[var(--color-ink)]">
                      {product.collection}
                    </p>
                  </article>
                  <article className="rounded-[1.4rem] border border-[var(--color-line)] bg-[rgba(248,250,252,0.82)] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      Status
                    </p>
                    <p className="mt-2 text-sm font-bold text-[var(--color-ink)]">Admin listed</p>
                  </article>
                </div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/90 p-6">
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

              <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/90 p-6">
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

            <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/90 p-6">
              <h2 className="text-lg font-extrabold">Product highlights</h2>
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

          <aside className="space-y-5 xl:sticky xl:top-28 xl:h-fit">
            <article className="rounded-[2.2rem] border border-[var(--color-line)] bg-white/96 p-6 shadow-[0_22px_55px_-35px_rgba(15,23,42,0.38)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                Price
              </p>
              <div className="mt-2 flex items-center gap-3">
                <p className="text-4xl font-extrabold text-[var(--color-ink)]">
                  {formatCurrency(currentPrice)}
                </p>
                {product.salePrice ? (
                  <p className="text-base text-[var(--color-muted)] line-through">
                    {formatCurrency(product.basePrice)}
                  </p>
                ) : null}
              </div>

              <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
                <p>Delivery estimate: {product.leadTime}</p>
                <p>Payment method: offline transfer with proof upload</p>
                <p>Order tracking available in account after checkout</p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={`/checkout/offline?product=${product.slug}`}
                  className="rounded-2xl bg-[var(--color-primary)] px-6 py-4 text-center text-sm font-semibold text-white"
                >
                  Order this product
                </Link>
                <Link
                  href="/account"
                  className="rounded-2xl border border-[var(--color-line)] px-6 py-4 text-center text-sm font-semibold text-[var(--color-ink)]"
                >
                  Track previous orders
                </Link>
              </div>
            </article>

            <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
                Store promise
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
                <p>Only admin-approved listings are visible.</p>
                <p>Designed for homes, offices, and commercial interiors.</p>
                <p>Measurement-first ordering with manual payment verification.</p>
              </div>
            </article>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
