"use client";

import { useMemo, useState } from "react";
import { Play } from "lucide-react";
import { InteractiveMedia } from "@/components/media/interactive-media";
import type { Product } from "@/lib/types";

function buildGallery(product: Product) {
  if (product.mediaGallery.length) {
    return [...product.mediaGallery].sort((left, right) => {
      if (left.isFeatured !== right.isFeatured) {
        return left.isFeatured ? -1 : 1;
      }

      return left.sortOrder - right.sortOrder;
    });
  }

  return [];
}

export function ProductMediaGallery({ product }: { product: Product }) {
  const gallery = useMemo(() => buildGallery(product), [product]);
  const [selectedId, setSelectedId] = useState(gallery[0]?.id ?? null);
  const selected = gallery.find((item) => item.id === selectedId) ?? gallery[0] ?? null;
  const detailShots = gallery.filter((item) => item.isDetail);

  if (!selected) {
    return null;
  }

  return (
    <div className="space-y-5">
      <InteractiveMedia
        label={selected.title || product.name}
        mediaUrl={selected.mediaUrl}
        mediaKind={selected.mediaKind}
        alt={selected.altText || product.name}
        previewHint={selected.mediaKind === "video" ? "Open product video" : "Open product image"}
        className="min-h-[36rem] rounded-[2.2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_84%,white_16%)] shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]"
        mediaClassName="h-full w-full object-cover"
      />

      {gallery.length > 1 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {gallery.map((item) => {
            const isActive = item.id === selected.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`group relative overflow-hidden rounded-[1.6rem] border text-left transition ${
                  isActive
                    ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_8%,white_92%)]"
                    : "border-[var(--color-line)] bg-white/80"
                }`}
              >
                {item.mediaKind === "video" ? (
                  <video
                    src={item.mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-32 w-full object-cover"
                  />
                ) : (
                  <img
                    src={item.mediaUrl}
                    alt={item.altText || item.title || product.name}
                    className="h-32 w-full object-cover"
                  />
                )}
                <div className="p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {item.mediaKind === "video" ? "Video" : item.isDetail ? "Detail shot" : "Gallery image"}
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[var(--color-ink)]">
                      {item.title || product.name}
                    </p>
                    {item.mediaKind === "video" ? <Play size={14} className="text-[var(--color-ink)]" /> : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : null}

      {detailShots.length ? (
        <section className="rounded-[2rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,white_18%)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
            Fabric and finish details
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {detailShots.map((item) => (
              <InteractiveMedia
                key={item.id}
                label={item.title || product.name}
                mediaUrl={item.mediaUrl}
                mediaKind={item.mediaKind}
                alt={item.altText || product.name}
                previewHint="Zoom into detail"
                className="aspect-square rounded-[1.6rem] border border-[var(--color-line)] bg-white"
                mediaClassName="h-full w-full object-cover"
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
