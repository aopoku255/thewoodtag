"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal/Reveal";
import type { CatalogueCategoryView } from "@/lib/catalogueTypes";
import CatalogueLightbox from "./CatalogueLightbox";

export default function CatalogueGrid({ categories }: { categories: CatalogueCategoryView[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [index, setIndex] = useState(0);

  const openCategory = categories.find((c) => c.slug === openSlug) ?? null;

  return (
    <>
      <div className="catalogue-grid">
        {categories.map((category, i) => (
          <Reveal
            as="button"
            key={category.slug}
            delay={((i % 3) + 1) as 1 | 2 | 3}
            className="catalogue-card"
            type="button"
            aria-label={`View ${category.title} gallery, ${category.images.length} images`}
            onClick={() => {
              setOpenSlug(category.slug);
              setIndex(0);
            }}
            data-cursor-hover
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={category.cover.src} alt={category.cover.alt} />
            <span className="catalogue-card__shade" aria-hidden="true" />
            <span className="catalogue-card__badge">View Gallery</span>
            <span className="catalogue-card__meta">
              <span className="catalogue-card__count">
                {category.images.length} Images
              </span>
              <span className="catalogue-card__title">{category.title}</span>
            </span>
          </Reveal>
        ))}
        {categories.length === 0 && (
          <p style={{ padding: "40px", color: "var(--text-muted)" }}>
            No catalogue categories published yet.
          </p>
        )}
      </div>

      {openCategory && (
        <CatalogueLightbox
          category={openCategory}
          index={index}
          onClose={() => setOpenSlug(null)}
          onNavigate={setIndex}
        />
      )}
    </>
  );
}
