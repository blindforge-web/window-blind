import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ProductVisual } from "@/components/store/product-visual";

export function ProductCard({ product }: { product: Product }) {
  const currentPrice = product.salePrice ?? product.basePrice;

  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_86%,white_14%)] shadow-[0_24px_60px_-36px_rgba(15,23,42,0.32)] backdrop-blur-sm">
      <Link
        href={`/products/${product.slug}`}
        aria-label={`Open ${product.name}`}
        className="absolute inset-0 z-0"
      />
      <div className="p-3">
        <ProductVisual product={product} className="h-72 rounded-[1.65rem]" />
      </div>

      <div className="relative z-10 space-y-5 px-5 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
              {product.collection}
            </p>
            <h3 className="text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
              {product.name}
            </h3>
          </div>
          {product.badge ? (
            <span className="rounded-full border border-[color-mix(in_srgb,var(--color-secondary)_28%,white_72%)] bg-[color-mix(in_srgb,var(--color-secondary)_16%,white_84%)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]">
              {product.badge}
            </span>
          ) : null}
        </div>

        <p className="text-sm leading-7 text-[var(--color-muted)]">{product.shortDescription}</p>

        <div className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-[var(--color-line)] bg-white/70 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
            <Star size={16} className="fill-[var(--color-secondary)] text-[var(--color-secondary)]" />
            <span className="font-bold">{product.rating}</span>
            <span className="text-[var(--color-muted)]">
              {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {product.leadTime}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.colors.slice(0, 3).map((color) => (
            <span
              key={color}
              className="rounded-full border border-[var(--color-line)] bg-white/72 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]"
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

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-ink)] text-white shadow-[0_16px_30px_-18px_rgba(15,23,42,0.8)]"
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={`/products/${product.slug}`}
            className="rounded-[1.1rem] border border-[var(--color-line)] bg-white/72 px-4 py-3 text-center text-sm font-semibold text-[var(--color-ink)]"
          >
            Product details
          </Link>
          <Link
            href={`/checkout/order?product=${product.slug}`}
            className="rounded-[1.1rem] bg-[var(--color-primary)] px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Order now
          </Link>
        </div>
      </div>
    </article>
  );
}
