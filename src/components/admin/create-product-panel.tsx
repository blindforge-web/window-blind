import { createProduct } from "@/app/actions";

export function CreateProductPanel({
  actionsEnabled,
}: {
  actionsEnabled: boolean;
}) {
  return (
    <section className="rounded-[2rem] border border-[var(--color-line)] bg-[rgba(255,249,241,0.88)] p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
          New Product
        </p>
        <h2 className="font-display text-4xl leading-none">Create a listing</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
          Start with the essential selling details. Advanced visual settings are optional.
        </p>
      </div>

      <form action={createProduct} className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Product name</span>
          <input
            name="name"
            required
            disabled={!actionsEnabled}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Collection</span>
          <input
            name="collection"
            required
            disabled={!actionsEnabled}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Base price</span>
          <input
            type="number"
            name="basePrice"
            required
            disabled={!actionsEnabled}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Sale price</span>
          <input
            type="number"
            name="salePrice"
            disabled={!actionsEnabled}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Lead time</span>
          <input
            name="leadTime"
            required
            disabled={!actionsEnabled}
            placeholder="4 to 6 working days"
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Slug</span>
          <input
            name="slug"
            disabled={!actionsEnabled}
            placeholder="Leave blank to generate from name"
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-semibold">Short description</span>
          <textarea
            name="shortDescription"
            rows={3}
            required
            disabled={!actionsEnabled}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-semibold">Full description</span>
          <textarea
            name="description"
            rows={5}
            required
            disabled={!actionsEnabled}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Image URL</span>
          <input
            name="imageUrl"
            disabled={!actionsEnabled}
            placeholder="Direct image URL"
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
            disabled={!actionsEnabled}
            placeholder="120cm x 150cm, 150cm x 180cm"
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Colours</span>
          <textarea
            name="colors"
            rows={3}
            disabled={!actionsEnabled}
            placeholder="Ivory, Smoke, Walnut"
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Features</span>
          <textarea
            name="features"
            rows={3}
            disabled={!actionsEnabled}
            placeholder="Full blackout, Smooth rolling mechanism"
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Ideal for</span>
          <textarea
            name="idealFor"
            rows={3}
            disabled={!actionsEnabled}
            placeholder="Bedrooms, Offices"
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>

        <details className="rounded-[1.6rem] border border-[var(--color-line)] bg-white/88 p-4 lg:col-span-2">
          <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-ink)]">
            Advanced merchandising options
          </summary>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold">Badge</span>
              <input
                name="badge"
                disabled={!actionsEnabled}
                placeholder="Best Seller"
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Visual label</span>
              <input
                name="visualLabel"
                disabled={!actionsEnabled}
                placeholder="Blackout"
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
                defaultValue="5"
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
                defaultValue="0"
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Visual color from</span>
              <input
                name="visualFrom"
                defaultValue="#efe3cf"
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Visual color to</span>
              <input
                name="visualTo"
                defaultValue="#6b5849"
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>

            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm font-semibold">Visual accent</span>
              <input
                name="visualAccent"
                defaultValue="#1f1b18"
                disabled={!actionsEnabled}
                className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
              />
            </label>
          </div>
        </details>

        <label className="flex items-center gap-2 text-sm font-semibold lg:col-span-2">
          <input type="checkbox" name="isListed" defaultChecked disabled={!actionsEnabled} />
          List this product on the storefront immediately
        </label>

        <button
          type="submit"
          disabled={!actionsEnabled}
          className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-2"
        >
          Create listing
        </button>
      </form>
    </section>
  );
}
