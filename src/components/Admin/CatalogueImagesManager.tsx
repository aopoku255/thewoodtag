"use client";

import { useState } from "react";
import type { CatalogueImage } from "@prisma/client";
import ImageField from "./ImageField";
import ConfirmDialog from "./ConfirmDialog";

export default function CatalogueImagesManager({
  categoryId,
  initial,
}: {
  categoryId: string;
  initial: CatalogueImage[];
}) {
  const [images, setImages] = useState<CatalogueImage[]>(initial);
  const [pendingDelete, setPendingDelete] = useState<CatalogueImage | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ imageUrl: "", alt: "" });

  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  const move = async (index: number, direction: -1 | 1) => {
    const target = sorted[index + direction];
    const current = sorted[index];
    if (!target) return;
    await Promise.all([
      fetch(`/api/admin/catalogue/images/${current.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: target.sortOrder }),
      }),
      fetch(`/api/admin/catalogue/images/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: current.sortOrder }),
      }),
    ]);
    setImages((prev) =>
      prev.map((it) => {
        if (it.id === current.id) return { ...it, sortOrder: target.sortOrder };
        if (it.id === target.id) return { ...it, sortOrder: current.sortOrder };
        return it;
      })
    );
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    const res = await fetch(`/api/admin/catalogue/images/${pendingDelete.id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) setImages((prev) => prev.filter((it) => it.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  const addImage = async () => {
    if (!draft.imageUrl) return;
    setBusyId("new");
    const res = await fetch("/api/admin/catalogue/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, ...draft }),
    });
    setBusyId(null);
    if (res.ok) {
      const json = await res.json();
      setImages((prev) => [...prev, json.image]);
      setDraft({ imageUrl: "", alt: "" });
      setAdding(false);
    }
  };

  return (
    <div className="catalogue-images-manager">
      <div className="media-grid">
        {sorted.map((img, index) => (
          <div key={img.id} className="catalogue-image-cell">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.imageUrl} alt={img.alt} />
            <div className="catalogue-image-cell__actions">
              <button type="button" className="admin-icon-btn" aria-label="Move left" onClick={() => move(index, -1)} disabled={index === 0} data-cursor-hover>←</button>
              <button type="button" className="admin-icon-btn" aria-label="Move right" onClick={() => move(index, 1)} disabled={index === sorted.length - 1} data-cursor-hover>→</button>
              <button type="button" className="admin-icon-btn" aria-label="Delete" onClick={() => setPendingDelete(img)} disabled={busyId === img.id} data-cursor-hover>🗑</button>
            </div>
          </div>
        ))}
      </div>

      {adding ? (
        <div className="admin-form-panel">
          <ImageField
            label="New gallery image"
            imageUrl={draft.imageUrl}
            imageAlt={draft.alt}
            onChange={({ imageUrl, imageAlt }) => setDraft({ imageUrl, alt: imageAlt })}
          />
          <div className="admin-section-header__actions">
            <button type="button" className="btn-outline" onClick={() => setAdding(false)} data-cursor-hover>Cancel</button>
            <button type="button" className="btn-gold" onClick={addImage} disabled={busyId === "new"} data-cursor-hover>
              <span>
                {busyId === "new" && <span className="btn-spinner" aria-hidden="true" />}
                Add Image
              </span>
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="btn-outline" onClick={() => setAdding(true)} data-cursor-hover style={{ marginTop: 12 }}>
          + Add Image
        </button>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this image?"
          description="This removes it from the catalogue gallery and lightbox."
          onConfirm={remove}
          onCancel={() => setPendingDelete(null)}
          busy={busyId === pendingDelete.id}
        />
      )}
    </div>
  );
}
