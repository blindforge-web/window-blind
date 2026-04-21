import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { ProductCard } from "@/components/store/product-card";
import { getProducts } from "@/lib/data";

export default async function CatalogPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Blind Catalog
            </p>
            <h1 className="mt-2 font-display text-6xl leading-none">
              Browse listed window blinds
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)]">
            Every item here is expected to come from Supabase listings so admins
            can control prices, sales, and visibility without redeploying.
          </p>
        </div>

        {products.length ? (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-[rgba(255,249,241,0.74)] p-10">
            <h2 className="font-display text-4xl">No live listings yet</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Once admins create products in Supabase, they will appear here
              automatically with pricing, collections, lead times, and listing
              status.
            </p>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
