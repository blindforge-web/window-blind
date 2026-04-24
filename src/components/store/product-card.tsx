import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ProductVisual } from "@/components/store/product-visual";

export function ProductCard({ product }: { product: Product }) {
  const currentPrice = product.salePrice ?? product.basePrice;

  return (
    <article className="group overflow-hidden rounded-[2.2rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.88))] shadow-[0_28px_70px_-45px_rgba(15,23,42,0.6)]">
      <div className="p-4">
        <ProductVisual product={product} className="h-80" />
      </div>
      <div className="space-y-5 px-6 pb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              {product.collection}
            </p>
            <h3 className="mt-2 font-display text-4xl leading-none">{product.name}</h3>
          </div>
          {product.badge ? (
            <span className="rounded-full border border-[color-mix(in_srgb,var(--color-secondary)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-secondary)_12%,white_88%)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)]">
              {product.badge}
            </span>
          ) : null}
        </div>

        <p className="text-sm leading-7 text-[var(--color-muted)]">
          {product.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2">
          {product.colors.slice(0, 3).map((color) => (
            <span
              key={color}
              className="rounded-full border border-[var(--color-line)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-muted)]"
            >
              {color}
            </span>
          ))}
        </div>

        <div className="rounded-[1.6rem] border border-[var(--color-line)] bg-white/92 p-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Starting from
              </p>
              <div className="mt-2 flex items-center gap-3">
                <p className="text-2xl font-extrabold text-[var(--color-ink)]">
                  {formatCurrency(currentPrice)}
                </p>
                {product.salePrice ? (
                  <p className="text-sm text-[var(--color-muted)] line-through">
                    {formatCurrency(product.basePrice)}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="text-right text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-muted)]">
              <p>{product.leadTime}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/products/${product.slug}`}
            className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
          >
            View product
          </Link>
          <Link
            href={`/checkout/offline?product=${product.slug}`}
            className="rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
          >
            Order now
          </Link>
        </div>
      </div>
    </article>
  );
}
