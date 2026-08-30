"use client";

import { useState } from "react";
import type { CatalogueCategory, CatalogueImage } from "@prisma/client";
import ImageField from "./ImageField";
import ConfirmDialog from "./ConfirmDialog";
import CatalogueImagesManager from "./CatalogueImagesManager";

type CategoryWithImages = CatalogueCategory & { images: CatalogueImage[] };

type Draft = Pick<CatalogueCategory, "slug" | "title" | "description" | "coverImageUrl" | "coverImageAlt" | "published">;

const EMPTY_DRAFT: Draft = {
  slug: "",
  title: "",
  description: "",
  coverImageUrl: "",
  coverImageAlt: "",
  published: true,
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CatalogueManager({ initial }: { initial: CategoryWithImages[] }) {
  const [categories, setCategories] = useState<CategoryWithImages[]>(initial);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<CategoryWithImages | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  const startCreate = () => {
    setDraft(EMPTY_DRAFT);
    setCreating(true);
    setEditingId(null);
    setError("");
  };

  const startEdit = (category: CategoryWithImages) => {
    setDraft({
      slug: category.slug,
      title: category.title,
      description: category.description,
      coverImageUrl: category.coverImageUrl,
      coverImageAlt: category.coverImageAlt,
      published: category.published,
    });
    setEditingId(category.id);
    setCreating(false);
    setError("");
  };

  const cancel = () => {
    setCreating(false);
    setEditingId(null);
    setError("");
  };

  const save = async () => {
    if (!draft.title.trim() || !draft.description.trim() || !draft.coverImageUrl) {
      setError("Title, description, and cover image are required.");
      return;
    }
    const slug = draft.slug.trim() || slugify(draft.title);
    setSaving(true);
    setError("");

    const res = creating
      ? await fetch("/api/admin/catalogue/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...draft, slug }),
        })
      : await fetch(`/api/admin/catalogue/categories/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...draft, slug }),
        });

    setSaving(false);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not save category.");
      return;
    }
    if (creating) {
      setCategories((prev) => [...prev, { ...data.category, images: [] }]);
    } else {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? { ...data.category, images: c.images } : c))
      );
    }
    cancel();
  };

  const togglePublished = async (category: CategoryWithImages) => {
    setBusyId(category.id);
    const res = await fetch(`/api/admin/catalogue/categories/${category.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !category.published }),
    });
    setBusyId(null);
    if (res.ok) {
      const data = await res.json();
      setCategories((prev) => prev.map((c) => (c.id === category.id ? { ...data.category, images: c.images } : c)));
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = sorted[index + direction];
    const current = sorted[index];
    if (!target) return;
    await Promise.all([
      fetch(`/api/admin/catalogue/categories/${current.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: target.sortOrder }),
      }),
      fetch(`/api/admin/catalogue/categories/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: current.sortOrder }),
      }),
    ]);
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === current.id) return { ...c, sortOrder: target.sortOrder };
        if (c.id === target.id) return { ...c, sortOrder: current.sortOrder };
        return c;
      })
    );
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    const res = await fetch(`/api/admin/catalogue/categories/${pendingDelete.id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) setCategories((prev) => prev.filter((c) => c.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  const formOpen = creating || editingId !== null;

  return (
    <>
      {sorted.map((category, index) => (
        <div key={category.id} className="admin-category-card">
          <div
            className="admin-category-card__header"
            onClick={() => setExpandedId(expandedId === category.id ? null : category.id)}
          >
            <div className="admin-list-row__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={category.coverImageUrl} alt={category.coverImageAlt} />
            </div>
            <div className="admin-list-row__body">
              <div className="admin-list-row__title">
                {category.title}
                <span className={`admin-badge admin-badge--${category.published ? "published" : "draft"}`}>
                  {category.published ? "Published" : "Draft"}
                </span>
                <span className="admin-badge admin-badge--draft">{category.images.length} images</span>
              </div>
              <div className="admin-list-row__meta">{category.description}</div>
            </div>
            <div className="admin-list-row__actions" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="admin-icon-btn" aria-label="Move up" onClick={() => move(index, -1)} disabled={index === 0} data-cursor-hover>↑</button>
              <button type="button" className="admin-icon-btn" aria-label="Move down" onClick={() => move(index, 1)} disabled={index === sorted.length - 1} data-cursor-hover>↓</button>
              <button type="button" className="admin-icon-btn" aria-label={category.published ? "Unpublish" : "Publish"} onClick={() => togglePublished(category)} disabled={busyId === category.id} data-cursor-hover>
                {category.published ? "🙈" : "👁"}
              </button>
              <button type="button" className="admin-icon-btn" aria-label="Edit" onClick={() => startEdit(category)} data-cursor-hover>✎</button>
              <button type="button" className="admin-icon-btn" aria-label="Delete" onClick={() => setPendingDelete(category)} data-cursor-hover>🗑</button>
            </div>
          </div>

          {expandedId === category.id && (
            <div className="admin-category-card__body">
              <h3 className="admin-subsection-title" style={{ marginTop: 18 }}>
                Gallery Images
              </h3>
              <CatalogueImagesManager categoryId={category.id} initial={category.images} />
            </div>
          )}
        </div>
      ))}
      {sorted.length === 0 && <p className="admin-empty-state">No catalogue categories yet.</p>}

      {formOpen ? (
        <div className="admin-form-panel">
          {error && (
            <div className="form-status-banner form-status-banner--error" role="alert">
              {error}
            </div>
          )}
          <div className="form-field">
            <label className="form-label">Title</label>
            <input className="form-input" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
          </div>
          <div className="form-field">
            <label className="form-label">Slug</label>
            <input className="form-input" placeholder={slugify(draft.title) || "auto-generated-from-title"} value={draft.slug} onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))} />
          </div>
          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
          </div>
          <ImageField
            label="Cover Image"
            imageUrl={draft.coverImageUrl}
            imageAlt={draft.coverImageAlt}
            onChange={({ imageUrl, imageAlt }) => setDraft((d) => ({ ...d, coverImageUrl: imageUrl, coverImageAlt: imageAlt }))}
          />
          <label className="admin-list-row__title" style={{ fontSize: 14 }}>
            <input type="checkbox" checked={draft.published} onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))} /> Published
          </label>
          <div className="admin-section-header__actions">
            <button type="button" className="btn-outline" onClick={cancel} data-cursor-hover>Cancel</button>
            <button type="button" className="btn-gold" onClick={save} disabled={saving} data-cursor-hover>
              <span>
                {saving && <span className="btn-spinner" aria-hidden="true" />}
                {creating ? "Create Category" : "Save Changes"}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-form-panel">
          <button type="button" className="btn-gold" onClick={startCreate} data-cursor-hover>
            <span>+ Add Category</span>
          </button>
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this category?"
          description={`"${pendingDelete.title}" and all ${pendingDelete.images.length} of its images will be removed from the public Catalogue.`}
          onConfirm={remove}
          onCancel={() => setPendingDelete(null)}
          busy={busyId === pendingDelete.id}
        />
      )}
    </>
  );
}
