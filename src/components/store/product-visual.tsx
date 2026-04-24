import type { Product } from "@/lib/types";

export function ProductVisual({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const hasImage = Boolean(product.imageUrl);

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/50 ${className}`}
      style={{
        background: hasImage
          ? undefined
          : `linear-gradient(145deg, ${product.visual.from}, ${product.visual.to})`,
      }}
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_34%)]" />
      <div className="absolute inset-y-0 left-[12%] w-[18%] bg-white/12 blur-3xl" />
      <div className="absolute inset-y-0 left-[44%] w-px bg-white/30" />
      <div className="absolute inset-y-0 left-[56%] w-px bg-black/10" />
      <div className="absolute bottom-5 left-5 right-5 rounded-[1.6rem] border border-white/30 bg-[rgba(17,15,13,0.22)] px-4 py-3 text-white backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-[0.26em] text-white/75">
          {product.visual.label}
        </p>
        <p className="font-display text-2xl leading-none">{product.name}</p>
      </div>
    </div>
  );
}
