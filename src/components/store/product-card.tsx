import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { ProductVisual } from "@/components/store/product-visual";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const currentPrice = product.salePrice ?? product.basePrice;

  return (
    <article className="ui-panel overflow-hidden p-3">
      <ProductVisual
        product={product}
        className="h-72 bg-[linear-gradient(180deg,#f8fbff,#eaf2ff)]"
        mediaClassName="h-full w-full object-contain p-4"
      />

      <div className="space-y-4 px-2 pb-2 pt-5 sm:px-3 sm:pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="ui-section-label">{product.collection}</p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
              {product.name}
            </h3>
          </div>
          {product.badge ? <span className="ui-pill ui-pill-solid">{product.badge}</span> : null}
        </div>

        <p className="text-sm leading-7 text-[var(--color-muted)]">{product.shortDescription}</p>

        <div className="flex items-center justify-between rounded-[1.2rem] bg-[var(--color-accent)] px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-[var(--color-ink)]">
            <Star size={15} className="fill-[var(--color-secondary)] text-[var(--color-secondary)]" />
            <span className="font-bold">{product.rating}</span>
            <span className="text-[var(--color-muted)]">{product.reviewCount} reviews</span>
          </div>
          <span className="font-semibold text-[var(--color-muted)]">{product.leadTime}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.colors.slice(0, 3).map((color) => (
            <span
              key={color}
              className="rounded-full border border-[var(--color-line)] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]"
            >
              {color}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Starting at
            </p>
            <div className="mt-1 flex items-center gap-3">
              <p className="text-3xl font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
                {formatCurrency(currentPrice)}
              </p>
              {product.salePrice ? (
                <p className="text-sm text-[var(--color-muted)] line-through">
                  {formatCurrency(product.basePrice)}
                </p>
              ) : null}
            </div>
          </div>
          <Link href={`/products/${product.slug}`} className="ui-button ui-button-outline px-4 py-3 text-sm">
            Details
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <Link href={`/checkout/order?product=${product.slug}`} className="ui-button ui-button-primary w-full">
          Order This Blind
        </Link>
      </div>
    </article>
  );
}
