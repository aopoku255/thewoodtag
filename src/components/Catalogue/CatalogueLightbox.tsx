"use client";

import { useEffect, useCallback } from "react";
import type { CatalogueCategoryView } from "@/lib/catalogueTypes";

interface CatalogueLightboxProps {
  category: CatalogueCategoryView;
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function CatalogueLightbox({
  category,
  index,
  onClose,
  onNavigate,
}: CatalogueLightboxProps) {
  const total = category.images.length;

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + total) % total);
  }, [index, total, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((index + 1) % total);
  }, [index, total, onNavigate]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, goPrev, goNext]);

  const active = category.images[index];

  return (
    <div
      className="lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${category.title} gallery`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="lightbox-toolbar">
        <div className="lightbox-title-group">
          <span className="lightbox-title">{category.title}</span>
          <span className="lightbox-counter">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <button
          type="button"
          className="lightbox-close"
          aria-label="Close gallery"
          onClick={onClose}
          data-cursor-hover
        >
          &times;
        </button>
      </div>

      <div className="lightbox-stage">
        <button
          type="button"
          className="lightbox-nav"
          aria-label="Previous image"
          onClick={goPrev}
          data-cursor-hover
        >
          &#8249;
        </button>

        <figure className="lightbox-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active.src} alt={active.alt} />
        </figure>

        <button
          type="button"
          className="lightbox-nav"
          aria-label="Next image"
          onClick={goNext}
          data-cursor-hover
        >
          &#8250;
        </button>
      </div>

      <div className="lightbox-thumbs">
        {category.images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            className={`lightbox-thumb${i === index ? " is-active" : ""}`}
            aria-label={`Show image ${i + 1}`}
            onClick={() => onNavigate(i)}
            data-cursor-hover
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
