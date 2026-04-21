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
          Admin Product Composer
        </p>
        <h2 className="font-display text-4xl leading-none">Create a new listing</h2>
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
          <span className="text-sm font-semibold">Slug</span>
          <input
            name="slug"
            required
            disabled={!actionsEnabled}
            placeholder="monarch-blackout"
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
          <span className="text-sm font-semibold">Lead time</span>
          <input
            name="leadTime"
            required
            disabled={!actionsEnabled}
            placeholder="4 to 6 working days"
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-semibold">Short description</span>
          <input
            name="shortDescription"
            required
            disabled={!actionsEnabled}
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-semibold">Full description</span>
          <textarea
            name="description"
            rows={4}
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
        <label className="space-y-2">
          <span className="text-sm font-semibold">Measurements</span>
          <textarea
            name="measurements"
            rows={3}
            disabled={!actionsEnabled}
            placeholder="Custom width up to 300cm, Custom drop up to 320cm"
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Colors</span>
          <textarea
            name="colors"
            rows={3}
            disabled={!actionsEnabled}
            placeholder="Ivory Sand, Smoke Ash, Deep Cocoa"
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Features</span>
          <textarea
            name="features"
            rows={3}
            disabled={!actionsEnabled}
            placeholder="Full blackout fabric, Silent chain control"
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Ideal for</span>
          <textarea
            name="idealFor"
            rows={3}
            disabled={!actionsEnabled}
            placeholder="Bedrooms, Boardrooms"
            className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none disabled:opacity-60"
          />
        </label>
        <button
          type="submit"
          disabled={!actionsEnabled}
          className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-forest)] disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-2"
        >
          Create listing
        </button>
      </form>
    </section>
  );
}
