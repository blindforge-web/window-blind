import {
  saveProductPricing,
  toggleProductListing,
} from "@/app/actions";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductAdminCard({
  product,
  actionsEnabled,
}: {
  product: Product;
  actionsEnabled: boolean;
}) {
  const currentPrice = product.salePrice ?? product.basePrice;

  return (
    <article className="space-y-4 rounded-[2rem] border border-[var(--color-line)] bg-[rgba(255,249,241,0.84)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            {product.collection}
          </p>
          <h3 className="font-display text-3xl leading-none">{product.name}</h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Live price: {formatCurrency(currentPrice)}
          </p>
        </div>
        <form action={toggleProductListing}>
          <input type="hidden" name="productId" value={product.id} />
          <input
            type="hidden"
            name="nextState"
            value={String(!product.isListed)}
          />
          <button
            type="submit"
            disabled={!actionsEnabled}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              product.isListed
                ? "bg-emerald-100 text-emerald-900"
                : "bg-stone-200 text-stone-700"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {product.isListed ? "Listed" : "Delisted"}
          </button>
        </form>
      </div>

      <p className="text-sm leading-7 text-[var(--color-muted)]">
        {product.shortDescription}
      </p>

      <form action={saveProductPricing} className="grid gap-3 md:grid-cols-2">
        <input type="hidden" name="productId" value={product.id} />
        <label className="space-y-2">
          <span className="text-sm font-semibold">Base price</span>
          <input
            type="number"
            name="basePrice"
            defaultValue={product.basePrice}
            disabled={!actionsEnabled}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Sale price</span>
          <input
            type="number"
            name="salePrice"
            defaultValue={product.salePrice ?? ""}
            disabled={!actionsEnabled}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>
        <button
          type="submit"
          disabled={!actionsEnabled}
          className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-forest)] disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
        >
          Save pricing
        </button>
      </form>
    </article>
  );
}
