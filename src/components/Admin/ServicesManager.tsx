"use client";

import { useState } from "react";
import type { Service } from "@prisma/client";
import ImageField from "./ImageField";
import ConfirmDialog from "./ConfirmDialog";

type Draft = Pick<Service, "slug" | "title" | "description" | "imageUrl" | "imageAlt" | "published" | "featured">;

const EMPTY_DRAFT: Draft = {
  slug: "",
  title: "",
  description: "",
  imageUrl: "",
  imageAlt: "",
  published: true,
  featured: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ServicesManager({ initial }: { initial: Service[] }) {
  const [services, setServices] = useState<Service[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Service | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const sorted = [...services].sort((a, b) => a.sortOrder - b.sortOrder);

  const startCreate = () => {
    setDraft(EMPTY_DRAFT);
    setCreating(true);
    setEditingId(null);
    setError("");
  };

  const startEdit = (service: Service) => {
    setDraft({
      slug: service.slug,
      title: service.title,
      description: service.description,
      imageUrl: service.imageUrl,
      imageAlt: service.imageAlt,
      published: service.published,
      featured: service.featured,
    });
    setEditingId(service.id);
    setCreating(false);
    setError("");
  };

  const cancel = () => {
    setCreating(false);
    setEditingId(null);
    setError("");
  };

  const save = async () => {
    if (!draft.title.trim() || !draft.description.trim() || !draft.imageUrl) {
      setError("Title, description, and image are required.");
      return;
    }
    const slug = draft.slug.trim() || slugify(draft.title);
    setSaving(true);
    setError("");

    const res = creating
      ? await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...draft, slug }),
        })
      : await fetch(`/api/admin/services/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...draft, slug }),
        });

    setSaving(false);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not save service.");
      return;
    }

    if (creating) {
      setServices((prev) => [...prev, data.service]);
    } else {
      setServices((prev) => prev.map((s) => (s.id === editingId ? data.service : s)));
    }
    cancel();
  };

  const togglePublished = async (service: Service) => {
    setBusyId(service.id);
    const res = await fetch(`/api/admin/services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !service.published }),
    });
    setBusyId(null);
    if (res.ok) {
      const data = await res.json();
      setServices((prev) => prev.map((s) => (s.id === service.id ? data.service : s)));
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = sorted[index + direction];
    const current = sorted[index];
    if (!target) return;
    await Promise.all([
      fetch(`/api/admin/services/${current.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: target.sortOrder }),
      }),
      fetch(`/api/admin/services/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: current.sortOrder }),
      }),
    ]);
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === current.id) return { ...s, sortOrder: target.sortOrder };
        if (s.id === target.id) return { ...s, sortOrder: current.sortOrder };
        return s;
      })
    );
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    const res = await fetch(`/api/admin/services/${pendingDelete.id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) setServices((prev) => prev.filter((s) => s.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  const formOpen = creating || editingId !== null;

  return (
    <>
      <div className="admin-list">
        {sorted.map((service, index) => (
          <div key={service.id} className="admin-list-row">
            <div className="admin-list-row__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={service.imageUrl} alt={service.imageAlt} />
            </div>
            <div className="admin-list-row__body">
              <div className="admin-list-row__title">
                {service.title}
                <span className={`admin-badge admin-badge--${service.published ? "published" : "draft"}`}>
                  {service.published ? "Published" : "Draft"}
                </span>
                {service.featured && <span className="admin-badge admin-badge--published">Featured</span>}
              </div>
              <div className="admin-list-row__meta">{service.description}</div>
            </div>
            <div className="admin-list-row__actions">
              <button
                type="button"
                className="admin-icon-btn"
                aria-label="Move up"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                data-cursor-hover
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-icon-btn"
                aria-label="Move down"
                onClick={() => move(index, 1)}
                disabled={index === sorted.length - 1}
                data-cursor-hover
              >
                ↓
              </button>
              <button
                type="button"
                className="admin-icon-btn"
                aria-label={service.published ? "Unpublish" : "Publish"}
                onClick={() => togglePublished(service)}
                disabled={busyId === service.id}
                data-cursor-hover
              >
                {service.published ? "🙈" : "👁"}
              </button>
              <button
                type="button"
                className="admin-icon-btn"
                aria-label="Edit"
                onClick={() => startEdit(service)}
                data-cursor-hover
              >
                ✎
              </button>
              <button
                type="button"
                className="admin-icon-btn"
                aria-label="Delete"
                onClick={() => setPendingDelete(service)}
                data-cursor-hover
              >
                🗑
              </button>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <p className="admin-empty-state">No services yet.</p>}
      </div>

      {formOpen ? (
        <div className="admin-form-panel">
          {error && (
            <div className="form-status-banner form-status-banner--error" role="alert">
              {error}
            </div>
          )}
          <div className="form-field">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Slug</label>
            <input
              className="form-input"
              placeholder={slugify(draft.title) || "auto-generated-from-title"}
              value={draft.slug}
              onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            />
          </div>
          <ImageField
            label="Image"
            imageUrl={draft.imageUrl}
            imageAlt={draft.imageAlt}
            onChange={({ imageUrl, imageAlt }) => setDraft((d) => ({ ...d, imageUrl, imageAlt }))}
          />
          <div className="form-row">
            <label className="admin-list-row__title" style={{ fontSize: 14 }}>
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))}
              />{" "}
              Published
            </label>
            <label className="admin-list-row__title" style={{ fontSize: 14 }}>
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))}
              />{" "}
              Featured
            </label>
          </div>
          <div className="admin-section-header__actions">
            <button type="button" className="btn-outline" onClick={cancel} data-cursor-hover>
              Cancel
            </button>
            <button type="button" className="btn-gold" onClick={save} disabled={saving} data-cursor-hover>
              <span>
                {saving && <span className="btn-spinner" aria-hidden="true" />}
                {creating ? "Create Service" : "Save Changes"}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-form-panel">
          <button type="button" className="btn-gold" onClick={startCreate} data-cursor-hover>
            <span>+ Add Service</span>
          </button>
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this service?"
          description={`"${pendingDelete.title}" will be removed from the public Services page.`}
          onConfirm={remove}
          onCancel={() => setPendingDelete(null)}
          busy={busyId === pendingDelete.id}
        />
      )}
    </>
  );
}
