import { deleteProduct, deleteProductMedia, upsertProduct, upsertProductMedia } from "@/app/actions";
import { ProductVisual } from "@/components/store/product-visual";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductAdminCard({
  product,
  actionsEnabled,
}: {
  product: Product;
  actionsEnabled: boolean;
}) {
  return (
    <article className="rounded-[2rem] border border-[var(--color-line)] bg-[rgba(255,249,241,0.84)] p-5">
      <form action={upsertProduct} className="space-y-5">
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="currentSlug" value={product.slug} />
        <input type="hidden" name="currentImageUrl" value={product.imageUrl ?? ""} />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              {product.collection}
            </p>
            <h3 className="font-display text-3xl leading-none">{product.name}</h3>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              {product.shortDescription}
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              name="isListed"
              defaultChecked={product.isListed}
              disabled={!actionsEnabled}
            />
            Listed
          </label>
        </div>

        <ProductVisual product={product} className="min-h-[16rem]" />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-white/88 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Starting price
            </p>
            <p className="mt-2 text-2xl font-extrabold text-[var(--color-ink)]">
              {formatCurrency(product.salePrice ?? product.basePrice)}
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-white/88 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Lead time
            </p>
            <p className="mt-2 text-lg font-extrabold text-[var(--color-ink)]">
              {product.leadTime}
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-white/88 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">
              URL key
            </p>
            <p className="mt-2 text-sm font-bold text-[var(--color-ink)]">{product.slug}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={`/products/${product.slug}`}
            className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
          >
            Open product page
          </a>
          <a
            href={`/checkout/order?product=${product.slug}`}
            className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
          >
            Open order flow
          </a>
        </div>

        <details className="rounded-[1.6rem] border border-[var(--color-line)] bg-white/88 p-4" open>
          <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-ink)]">
            Core listing details
          </summary>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold">Product name</span>
              <input
                name="name"
                defaultValue={product.name}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Collection</span>
              <input
                name="collection"
                defaultValue={product.collection}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

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

            <label className="space-y-2">
              <span className="text-sm font-semibold">Lead time</span>
              <input
                name="leadTime"
                defaultValue={product.leadTime}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">URL key</span>
              <input
                name="slug"
                defaultValue={product.slug}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm font-semibold">Short description</span>
              <textarea
                name="shortDescription"
                rows={3}
                defaultValue={product.shortDescription}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm font-semibold">Full description</span>
              <textarea
                name="description"
                rows={5}
                defaultValue={product.description}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Image URL</span>
              <input
                name="imageUrl"
                defaultValue=""
                placeholder={product.imageUrl ?? "Direct image URL"}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Upload image</span>
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Measurements</span>
              <textarea
                name="measurements"
                rows={3}
                defaultValue={product.measurements.join(", ")}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Colours</span>
              <textarea
                name="colors"
                rows={3}
                defaultValue={product.colors.join(", ")}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>
          </div>
        </details>

        <details className="rounded-[1.6rem] border border-[var(--color-line)] bg-white/88 p-4">
          <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-ink)]">
            Advanced product fields
          </summary>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold">Features</span>
              <textarea
                name="features"
                rows={4}
                defaultValue={product.features.join(", ")}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Ideal for</span>
              <textarea
                name="idealFor"
                rows={4}
                defaultValue={product.idealFor.join(", ")}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Badge</span>
              <input
                name="badge"
                defaultValue={product.badge ?? ""}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Visual label</span>
              <input
                name="visualLabel"
                defaultValue={product.visual.label}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Rating</span>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                defaultValue={product.rating}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Review count</span>
              <input
                type="number"
                min="0"
                name="reviewCount"
                defaultValue={product.reviewCount}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Visual color from</span>
              <input
                name="visualFrom"
                defaultValue={product.visual.from}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Visual color to</span>
              <input
                name="visualTo"
                defaultValue={product.visual.to}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm font-semibold">Visual accent</span>
              <input
                name="visualAccent"
                defaultValue={product.visual.accent}
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="flex items-center gap-2 text-sm font-semibold lg:col-span-2">
              <input type="checkbox" name="removeImage" disabled={!actionsEnabled} />
              Remove current image
            </label>
          </div>
        </details>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={!actionsEnabled}
            className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            Save product
          </button>
          <button
            type="submit"
            formAction={deleteProduct}
            disabled={!actionsEnabled}
            className="rounded-full border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 disabled:opacity-60"
          >
            Delete product
          </button>
        </div>
      </form>

      <details className="mt-5 rounded-[1.6rem] border border-[var(--color-line)] bg-white/88 p-4">
        <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-ink)]">
          Product media gallery
        </summary>
        <div className="mt-4 space-y-4">
          {product.mediaGallery.map((item) => (
            <form
              key={item.id}
              action={upsertProductMedia}
              className="grid gap-4 rounded-[1.4rem] border border-[var(--color-line)] bg-white p-4"
            >
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="productSlug" value={product.slug} />
              <input type="hidden" name="currentMediaUrl" value={item.mediaUrl} />

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Title</span>
                  <input name="title" defaultValue={item.title ?? ""} disabled={!actionsEnabled} className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Media type</span>
                  <select name="mediaKind" defaultValue={item.mediaKind} disabled={!actionsEnabled} className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60">
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Media URL</span>
                  <input name="mediaUrl" defaultValue="" placeholder={item.mediaUrl} disabled={!actionsEnabled} className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Upload media</span>
                  <input type="file" name="mediaFile" accept="image/*,video/*" disabled={!actionsEnabled} className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm disabled:opacity-60" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Alt text</span>
                  <input name="altText" defaultValue={item.altText ?? ""} disabled={!actionsEnabled} className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Sort order</span>
                  <input type="number" name="sortOrder" defaultValue={item.sortOrder} disabled={!actionsEnabled} className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60" />
                </label>
              </div>

              <div className="flex flex-wrap gap-4 text-sm font-semibold">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isActive" defaultChecked={item.isActive} disabled={!actionsEnabled} />
                  Visible
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isFeatured" defaultChecked={item.isFeatured} disabled={!actionsEnabled} />
                  Featured
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isDetail" defaultChecked={item.isDetail} disabled={!actionsEnabled} />
                  Detail shot
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={!actionsEnabled} className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                  Save media
                </button>
                <button type="submit" formAction={deleteProductMedia} disabled={!actionsEnabled} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60">
                  Delete media
                </button>
              </div>
            </form>
          ))}

          <form action={upsertProductMedia} className="grid gap-4 rounded-[1.4rem] border border-dashed border-[var(--color-line)] bg-white p-4">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="productSlug" value={product.slug} />

            <p className="text-sm font-semibold text-[var(--color-ink)]">Add new gallery media</p>
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold">Title</span>
                <input name="title" disabled={!actionsEnabled} className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold">Media type</span>
                <select name="mediaKind" defaultValue="image" disabled={!actionsEnabled} className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold">Media URL</span>
                <input name="mediaUrl" disabled={!actionsEnabled} className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold">Upload media</span>
                <input type="file" name="mediaFile" accept="image/*,video/*" disabled={!actionsEnabled} className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm disabled:opacity-60" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold">Alt text</span>
                <input name="altText" disabled={!actionsEnabled} className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold">Sort order</span>
                <input type="number" name="sortOrder" defaultValue={product.mediaGallery.length + 1} disabled={!actionsEnabled} className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60" />
              </label>
            </div>
            <div className="flex flex-wrap gap-4 text-sm font-semibold">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isActive" defaultChecked disabled={!actionsEnabled} />
                Visible
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isFeatured" disabled={!actionsEnabled} />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isDetail" disabled={!actionsEnabled} />
                Detail shot
              </label>
            </div>
            <div>
              <button type="submit" disabled={!actionsEnabled} className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                Add media
              </button>
            </div>
          </form>
        </div>
      </details>
    </article>
  );
}
