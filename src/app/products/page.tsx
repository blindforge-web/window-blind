import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { ProductCard } from "@/components/store/product-card";
import { getProducts } from "@/lib/data";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; q?: string }>;
}) {
  const params = await searchParams;
  const products = await getProducts();
  const collections = Array.from(new Set(products.map((product) => product.collection))).sort(
    (a, b) => a.localeCompare(b),
  );
  const selectedCollection = params.collection?.trim() || "";
  const searchTerm = params.q?.trim().toLowerCase() || "";

  const filteredProducts = products.filter((product) => {
    const matchesCollection = selectedCollection
      ? product.collection === selectedCollection
      : true;
    const haystack = [
      product.name,
      product.collection,
      product.shortDescription,
      product.description,
      ...product.colors,
      ...product.features,
      ...product.idealFor,
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch = searchTerm ? haystack.includes(searchTerm) : true;
    return matchesCollection && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <section className="overflow-hidden rounded-[2.4rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-secondary)]">
                Product Catalog
              </p>
              <h1 className="mt-3 max-w-3xl text-5xl font-extrabold tracking-[-0.06em] text-[var(--color-ink)] sm:text-6xl">
                A cleaner browse experience for blinds and interior fittings.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                Search by room, finish, collection, or feature. The customer side now behaves
                like a modern catalog instead of a basic product list.
              </p>

              <form action="/products" className="mt-6 flex flex-wrap gap-3">
                <div className="flex min-w-[18rem] flex-1 items-center gap-3 rounded-[1.2rem] border border-[var(--color-line)] bg-white/80 px-4 py-3">
                  <Search size={18} className="text-[var(--color-muted)]" />
                  <input
                    type="search"
                    name="q"
                    defaultValue={params.q ?? ""}
                    placeholder="Search product, room, feature, colour..."
                    className="min-w-0 flex-1 border-0 bg-transparent outline-none"
                  />
                </div>
                {selectedCollection ? (
                  <input type="hidden" name="collection" value={selectedCollection} />
                ) : null}
                <button
                  type="submit"
                  className="rounded-[1.2rem] bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white"
                >
                  Search catalog
                </button>
              </form>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white/72 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Live products
                </p>
                <p className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                  {products.length}
                </p>
              </article>
              <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-white/72 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Collections
                </p>
                <p className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                  {collections.length}
                </p>
              </article>
              <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-secondary)_10%,white_90%)] p-5 sm:col-span-2">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  <SlidersHorizontal size={14} />
                  Active filters
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {selectedCollection ? `Collection: ${selectedCollection}. ` : "All collections. "}
                  {searchTerm ? `Search: ${params.q}.` : "No search query applied."}
                </p>
              </article>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={params.q ? `/products?q=${encodeURIComponent(params.q)}` : "/products"}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                !selectedCollection
                  ? "bg-[var(--color-ink)] text-white"
                  : "border border-[var(--color-line)] bg-white/72 text-[var(--color-ink)]"
              }`}
            >
              All products
            </Link>
            {collections.map((collection) => {
              const href = searchTerm
                ? `/products?collection=${encodeURIComponent(collection)}&q=${encodeURIComponent(searchTerm)}`
                : `/products?collection=${encodeURIComponent(collection)}`;
              return (
                <Link
                  key={collection}
                  href={href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    selectedCollection === collection
                      ? "bg-[var(--color-ink)] text-white"
                      : "border border-[var(--color-line)] bg-white/72 text-[var(--color-ink)]"
                  }`}
                >
                  {collection}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Showing
              </p>
              <h2 className="mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)] sm:text-5xl">
                {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}
              </h2>
            </div>
            <Link
              href="/checkout/order"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/72 px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
            >
              Place an order
              <ArrowRight size={16} />
            </Link>
          </div>

          {filteredProducts.length ? (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/62 p-10">
              <h2 className="text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                No products match this search
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                Try another keyword, remove the collection filter, or reset the catalog.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex rounded-full border border-[var(--color-line)] bg-white/72 px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
              >
                Reset catalog
              </Link>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
