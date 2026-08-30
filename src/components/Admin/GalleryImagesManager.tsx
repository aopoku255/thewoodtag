"use client";

import { useState } from "react";
import ImageField from "./ImageField";
import ConfirmDialog from "./ConfirmDialog";

interface GalleryImage {
  id: string;
  imageUrl: string;
  alt: string;
  caption?: string;
  sortOrder: number;
}

interface GalleryImagesManagerProps {
  apiBase: string; // e.g. "/api/admin/hero/slides" or "/api/admin/about/gallery"
  initial: GalleryImage[];
  showCaption?: boolean;
  itemLabel?: string;
}

export default function GalleryImagesManager({
  apiBase,
  initial,
  showCaption = false,
  itemLabel = "image",
}: GalleryImagesManagerProps) {
  const [items, setItems] = useState<GalleryImage[]>(initial);
  const [pendingDelete, setPendingDelete] = useState<GalleryImage | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [addingImage, setAddingImage] = useState({ imageUrl: "", alt: "" });
  const [addingCaption, setAddingCaption] = useState("");
  const [adding, setAdding] = useState(false);

  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  const patch = async (id: string, data: Partial<GalleryImage>) => {
    setBusyId(id);
    const res = await fetch(`${apiBase}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setBusyId(null);
    if (res.ok) {
      const json = await res.json();
      const updated = json.slide ?? json.image;
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = sorted[index + direction];
    const current = sorted[index];
    if (!target) return;
    patch(current.id, { sortOrder: target.sortOrder });
    patch(target.id, { sortOrder: current.sortOrder });
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    const res = await fetch(`${apiBase}/${pendingDelete.id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) setItems((prev) => prev.filter((it) => it.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  const addItem = async () => {
    if (!addingImage.imageUrl) return;
    setBusyId("new");
    const res = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...addingImage, ...(showCaption ? { caption: addingCaption } : {}) }),
    });
    setBusyId(null);
    if (res.ok) {
      const json = await res.json();
      const created = json.slide ?? json.image;
      setItems((prev) => [...prev, created]);
      setAddingImage({ imageUrl: "", alt: "" });
      setAddingCaption("");
      setAdding(false);
    }
  };

  return (
    <>
      <div className="admin-list">
        {sorted.map((item, index) => (
          <div key={item.id} className="admin-list-row">
            <div className="admin-list-row__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.alt} />
            </div>
            <div className="admin-list-row__body">
              <div className="admin-list-row__title">
                {showCaption ? item.caption || "(no caption)" : item.alt || "(no alt text)"}
              </div>
              <div className="admin-list-row__meta">{item.imageUrl}</div>
            </div>
            <div className="admin-list-row__actions">
              <button
                type="button"
                className="admin-icon-btn"
                aria-label="Move up"
                onClick={() => move(index, -1)}
                disabled={index === 0 || busyId !== null}
                data-cursor-hover
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-icon-btn"
                aria-label="Move down"
                onClick={() => move(index, 1)}
                disabled={index === sorted.length - 1 || busyId !== null}
                data-cursor-hover
              >
                ↓
              </button>
              <button
                type="button"
                className="admin-icon-btn"
                aria-label="Delete"
                onClick={() => setPendingDelete(item)}
                disabled={busyId !== null}
                data-cursor-hover
              >
                🗑
              </button>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <p className="admin-empty-state">No {itemLabel}s yet.</p>}
      </div>

      {adding ? (
        <div className="admin-form-panel">
          <ImageField
            label={`New ${itemLabel}`}
            imageUrl={addingImage.imageUrl}
            imageAlt={addingImage.alt}
            onChange={({ imageUrl, imageAlt }) => setAddingImage({ imageUrl, alt: imageAlt })}
          />
          {showCaption && (
            <div className="form-field">
              <label className="form-label">Caption</label>
              <input
                className="form-input"
                value={addingCaption}
                onChange={(e) => setAddingCaption(e.target.value)}
              />
            </div>
          )}
          <div className="admin-section-header__actions">
            <button type="button" className="btn-outline" onClick={() => setAdding(false)} data-cursor-hover>
              Cancel
            </button>
            <button
              type="button"
              className="btn-gold"
              onClick={addItem}
              disabled={busyId === "new" || !addingImage.imageUrl}
              data-cursor-hover
            >
              <span>
                {busyId === "new" && <span className="btn-spinner" aria-hidden="true" />}
                Add {itemLabel}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-form-panel">
          <button type="button" className="btn-outline" onClick={() => setAdding(true)} data-cursor-hover>
            + Add {itemLabel}
          </button>
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={`Delete this ${itemLabel}?`}
          description="This removes it from the public site immediately."
          onConfirm={remove}
          onCancel={() => setPendingDelete(null)}
          busy={busyId === pendingDelete.id}
        />
      )}
    </>
  );
}
