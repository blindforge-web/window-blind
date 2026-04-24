import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ProductVisual } from "@/components/store/product-visual";

export function ProductCard({ product }: { product: Product }) {
  const currentPrice = product.salePrice ?? product.basePrice;

  return (
    <article className="group overflow-hidden rounded-[1.8rem] border border-[var(--color-line)] bg-white shadow-[0_22px_55px_-40px_rgba(15,23,42,0.48)]">
      <div className="p-3">
        <ProductVisual product={product} className="h-72 rounded-[1.5rem]" />
      </div>

      <div className="space-y-4 px-5 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Official Sunpilot Store
            </p>
            <h3 className="mt-2 text-xl font-extrabold leading-7 text-[var(--color-ink)]">
              {product.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-[var(--color-muted)]">
              {product.collection}
            </p>
          </div>
          {product.badge ? (
            <span className="rounded-full bg-[color-mix(in_srgb,var(--color-secondary)_18%,white_82%)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]">
              {product.badge}
            </span>
          ) : null}
        </div>

        <p className="text-sm leading-7 text-[var(--color-muted)]">
          {product.shortDescription}
        </p>

        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold text-[var(--color-ink)]">{product.rating}/5</span>
          <span className="text-[var(--color-muted)]">
            {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.colors.slice(0, 3).map((color) => (
            <span
              key={color}
              className="rounded-full border border-[var(--color-line)] bg-[rgba(248,250,252,0.9)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]"
            >
              {color}
            </span>
          ))}
        </div>

        <div className="rounded-[1.3rem] border border-[var(--color-line)] bg-[rgba(248,250,252,0.84)] p-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
                Price
              </p>
              <div className="mt-1 flex items-center gap-3">
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
            <div className="text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
              <p>{product.leadTime}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-center text-sm font-semibold text-white"
          >
            View details
          </Link>
          <Link
            href={`/checkout/offline?product=${product.slug}`}
            className="rounded-2xl border border-[var(--color-line)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)]"
          >
            Order
          </Link>
        </div>
      </div>
    </article>
  );
}
