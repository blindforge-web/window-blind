"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Play, X, ZoomIn } from "lucide-react";

type InteractiveMediaProps = {
  label: string;
  mediaUrl?: string | null;
  mediaKind?: "image" | "video";
  alt?: string | null;
  className?: string;
  mediaClassName?: string;
  previewHint?: string;
  children?: ReactNode;
};

function MediaContent({
  mediaUrl,
  mediaKind,
  alt,
  mediaClassName,
  full,
}: {
  mediaUrl?: string | null;
  mediaKind?: "image" | "video";
  alt?: string | null;
  mediaClassName?: string;
  full?: boolean;
}) {
  if (mediaUrl && mediaKind === "video") {
    return full ? (
      <video
        src={mediaUrl}
        controls
        playsInline
        preload="metadata"
        className={mediaClassName}
      />
    ) : (
      <video
        src={mediaUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className={mediaClassName}
      />
    );
  }

  if (mediaUrl) {
    return <img src={mediaUrl} alt={alt || ""} className={mediaClassName} loading="lazy" />;
  }

  return null;
}

export function InteractiveMedia({
  label,
  mediaUrl,
  mediaKind = "image",
  alt,
  className = "",
  mediaClassName = "h-full w-full object-cover",
  previewHint = "Click to preview",
  children,
}: InteractiveMediaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const canPreview = Boolean(mediaUrl);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  if (!canPreview) {
    return <div className={className}>{children}</div>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group relative block overflow-hidden text-left ${className}`}
        aria-label={`Preview ${label}`}
      >
        <MediaContent
          mediaUrl={mediaUrl}
          mediaKind={mediaKind}
          alt={alt}
          mediaClassName={mediaClassName}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_40%,rgba(15,23,42,0.52)_100%)]" />
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-[1.2rem] border border-white/16 bg-[rgba(15,23,42,0.48)] px-4 py-3 text-white backdrop-blur-xl">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/66">
              {mediaKind === "video" ? "Video preview" : "Image preview"}
            </p>
            <p className="mt-1 text-sm font-semibold text-white">{previewHint}</p>
          </div>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/10">
            {mediaKind === "video" ? <Play size={18} /> : <ZoomIn size={18} />}
          </span>
        </div>
        {children ? <div className="absolute inset-0">{children}</div> : null}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(2,6,23,0.88)] px-4 py-6"
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            aria-label="Close preview"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/14 bg-white/10 text-white backdrop-blur-xl"
          >
            <X size={20} />
          </button>

          <div
            className="relative flex max-h-[92vh] w-full max-w-6xl items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(15,23,42,0.78)] p-3 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.9)]"
            onClick={(event) => event.stopPropagation()}
          >
            <MediaContent
              mediaUrl={mediaUrl}
              mediaKind={mediaKind}
              alt={alt}
              full
              mediaClassName="max-h-[86vh] w-auto max-w-full rounded-[1.4rem] object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
