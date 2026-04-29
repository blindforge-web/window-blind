import type { Product } from "@/lib/types";
import { InteractiveMedia } from "@/components/media/interactive-media";

export function ProductVisual({
  product,
  className = "",
  mediaClassName = "h-full w-full object-cover",
}: {
  product: Product;
  className?: string;
  mediaClassName?: string;
}) {
  const hasImage = Boolean(product.imageUrl);

  return (
    <InteractiveMedia
      label={product.name}
      mediaUrl={product.imageUrl}
      mediaKind="image"
      alt={product.name}
      previewHint="Open product image"
      className={`relative overflow-hidden rounded-[1.8rem] border border-white/60 ${className}`}
      mediaClassName={mediaClassName}
    >
      <div
        className="absolute inset-0"
        style={{
          background: hasImage
            ? undefined
            : `linear-gradient(145deg, ${product.visual.from}, ${product.visual.to})`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.9),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,42,71,0)_0%,rgba(14,42,71,0.08)_46%,rgba(14,42,71,0.76)_100%)]" />
      <div className="absolute right-5 top-5 rounded-full bg-white/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)] shadow-[0_12px_24px_-20px_rgba(14,42,71,0.42)]">
        {product.collection}
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 rounded-[1.25rem] border border-white/18 bg-[rgba(14,42,71,0.68)] px-4 py-4 text-white backdrop-blur-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/72">
          {product.visual.label}
        </p>
        <p className="mt-2 text-2xl font-extrabold tracking-[-0.04em]">{product.name}</p>
      </div>
    </InteractiveMedia>
  );
}
