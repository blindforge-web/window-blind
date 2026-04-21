import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ProductVisual } from "@/components/store/product-visual";

export function ProductCard({ product }: { product: Product }) {
  const currentPrice = product.salePrice ?? product.basePrice;

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[rgba(255,249,241,0.82)] shadow-[0_24px_70px_-45px_rgba(24,16,10,0.7)]">
      <div className="p-4">
        <ProductVisual product={product} className="h-72" />
      </div>
      <div className="space-y-4 px-6 pb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              {product.collection}
            </p>
            <h3 className="font-display text-3xl leading-none">{product.name}</h3>
          </div>
          {product.badge ? (
            <span className="rounded-full border border-[rgba(138,103,69,0.2)] bg-[rgba(138,103,69,0.08)] px-3 py-1 text-xs font-semibold text-[var(--color-bronze)]">
              {product.badge}
            </span>
          ) : null}
        </div>

        <p className="text-sm leading-7 text-[var(--color-muted)]">
          {product.shortDescription}
        </p>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--color-muted)]">From</p>
            <div className="flex items-center gap-3">
              <p className="text-xl font-extrabold text-[var(--color-ink)]">
                {formatCurrency(currentPrice)}
              </p>
              {product.salePrice ? (
                <p className="text-sm text-[var(--color-muted)] line-through">
                  {formatCurrency(product.basePrice)}
                </p>
              ) : null}
            </div>
          </div>
          <Link
            href={`/blinds/${product.slug}`}
            className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-forest)] hover:bg-[var(--color-forest)] hover:text-white"
          >
            See Details
          </Link>
        </div>
      </div>
    </article>
  );
}
