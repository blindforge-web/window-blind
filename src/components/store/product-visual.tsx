/* eslint-disable @next/next/no-img-element */
import type { Product } from "@/lib/types";
import { InteractiveMedia } from "@/components/media/interactive-media";

export function ProductVisual({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const hasImage = Boolean(product.imageUrl);

  return (
    <InteractiveMedia
      label={product.name}
      mediaUrl={product.imageUrl}
      mediaKind="image"
      alt={product.name}
      previewHint="Open product image"
      className={`relative overflow-hidden rounded-[2rem] border border-white/40 ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background: hasImage
            ? undefined
            : `linear-gradient(145deg, ${product.visual.from}, ${product.visual.to})`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.32),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(15,23,42,0.1)_62%,rgba(15,23,42,0.48)_100%)]" />
      <div className="absolute -right-10 top-8 h-32 w-32 rounded-full bg-white/14 blur-3xl" />
      <div className="pointer-events-none absolute bottom-5 left-5 right-5 rounded-[1.6rem] border border-white/24 bg-white/10 px-4 py-4 text-white backdrop-blur-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/70">
          {product.visual.label}
        </p>
        <p className="mt-2 text-2xl font-extrabold tracking-[-0.04em]">{product.name}</p>
      </div>
    </InteractiveMedia>
  );
}
