"use client";

import { useState } from "react";
import type { StudioPackage } from "@prisma/client";
import ImageField from "./ImageField";
import ConfirmDialog from "./ConfirmDialog";

type Draft = Pick<
  StudioPackage,
  "slug" | "title" | "duration" | "price" | "hourlyLabel" | "description" | "imageUrl" | "imageAlt" | "published"
>;

const EMPTY_DRAFT: Draft = {
  slug: "",
  title: "",
  duration: "60 min",
  price: "GHS 0",
  hourlyLabel: "Hourly GHS 0",
  description: "",
  imageUrl: "",
  imageAlt: "",
  published: true,
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function PackagesManager({ initial }: { initial: StudioPackage[] }) {
  const [packages, setPackages] = useState<StudioPackage[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<StudioPackage | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const sorted = [...packages].sort((a, b) => a.sortOrder - b.sortOrder);

  const startCreate = () => {
    setDraft(EMPTY_DRAFT);
    setCreating(true);
    setEditingId(null);
    setError("");
  };

  const startEdit = (pkg: StudioPackage) => {
    setDraft({
      slug: pkg.slug,
      title: pkg.title,
      duration: pkg.duration,
      price: pkg.price,
      hourlyLabel: pkg.hourlyLabel,
      description: pkg.description,
      imageUrl: pkg.imageUrl,
      imageAlt: pkg.imageAlt,
      published: pkg.published,
    });
    setEditingId(pkg.id);
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
      ? await fetch("/api/admin/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...draft, slug }),
        })
      : await fetch(`/api/admin/packages/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...draft, slug }),
        });

    setSaving(false);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not save package.");
      return;
    }

    if (creating) {
      setPackages((prev) => [...prev, data.package]);
    } else {
      setPackages((prev) => prev.map((p) => (p.id === editingId ? data.package : p)));
    }
    cancel();
  };

  const togglePublished = async (pkg: StudioPackage) => {
    setBusyId(pkg.id);
    const res = await fetch(`/api/admin/packages/${pkg.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !pkg.published }),
    });
    setBusyId(null);
    if (res.ok) {
      const data = await res.json();
      setPackages((prev) => prev.map((p) => (p.id === pkg.id ? data.package : p)));
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = sorted[index + direction];
    const current = sorted[index];
    if (!target) return;
    await Promise.all([
      fetch(`/api/admin/packages/${current.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: target.sortOrder }),
      }),
      fetch(`/api/admin/packages/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: current.sortOrder }),
      }),
    ]);
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id === current.id) return { ...p, sortOrder: target.sortOrder };
        if (p.id === target.id) return { ...p, sortOrder: current.sortOrder };
        return p;
      })
    );
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    const res = await fetch(`/api/admin/packages/${pendingDelete.id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) setPackages((prev) => prev.filter((p) => p.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  const formOpen = creating || editingId !== null;

  return (
    <>
      <div className="admin-list">
        {sorted.map((pkg, index) => (
          <div key={pkg.id} className="admin-list-row">
            <div className="admin-list-row__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pkg.imageUrl} alt={pkg.imageAlt} />
            </div>
            <div className="admin-list-row__body">
              <div className="admin-list-row__title">
                {pkg.title}
                <span className={`admin-badge admin-badge--${pkg.published ? "published" : "draft"}`}>
                  {pkg.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="admin-list-row__meta">
                {pkg.duration} &middot; {pkg.price} &middot; {pkg.hourlyLabel}
              </div>
            </div>
            <div className="admin-list-row__actions">
              <button type="button" className="admin-icon-btn" aria-label="Move up" onClick={() => move(index, -1)} disabled={index === 0} data-cursor-hover>↑</button>
              <button type="button" className="admin-icon-btn" aria-label="Move down" onClick={() => move(index, 1)} disabled={index === sorted.length - 1} data-cursor-hover>↓</button>
              <button type="button" className="admin-icon-btn" aria-label={pkg.published ? "Unpublish" : "Publish"} onClick={() => togglePublished(pkg)} disabled={busyId === pkg.id} data-cursor-hover>
                {pkg.published ? "🙈" : "👁"}
              </button>
              <button type="button" className="admin-icon-btn" aria-label="Edit" onClick={() => startEdit(pkg)} data-cursor-hover>✎</button>
              <button type="button" className="admin-icon-btn" aria-label="Delete" onClick={() => setPendingDelete(pkg)} data-cursor-hover>🗑</button>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <p className="admin-empty-state">No packages yet.</p>}
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
            <input className="form-input" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
          </div>
          <div className="form-field">
            <label className="form-label">Slug</label>
            <input className="form-input" placeholder={slugify(draft.title) || "auto-generated-from-title"} value={draft.slug} onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Duration</label>
              <input className="form-input" value={draft.duration} onChange={(e) => setDraft((d) => ({ ...d, duration: e.target.value }))} />
            </div>
            <div className="form-field">
              <label className="form-label">Price</label>
              <input className="form-input" value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))} />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Hourly Label</label>
            <input className="form-input" value={draft.hourlyLabel} onChange={(e) => setDraft((d) => ({ ...d, hourlyLabel: e.target.value }))} />
          </div>
          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
          </div>
          <ImageField
            label="Image"
            imageUrl={draft.imageUrl}
            imageAlt={draft.imageAlt}
            onChange={({ imageUrl, imageAlt }) => setDraft((d) => ({ ...d, imageUrl, imageAlt }))}
          />
          <label className="admin-list-row__title" style={{ fontSize: 14 }}>
            <input type="checkbox" checked={draft.published} onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))} /> Published
          </label>
          <div className="admin-section-header__actions">
            <button type="button" className="btn-outline" onClick={cancel} data-cursor-hover>Cancel</button>
            <button type="button" className="btn-gold" onClick={save} disabled={saving} data-cursor-hover>
              <span>
                {saving && <span className="btn-spinner" aria-hidden="true" />}
                {creating ? "Create Package" : "Save Changes"}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-form-panel">
          <button type="button" className="btn-gold" onClick={startCreate} data-cursor-hover>
            <span>+ Add Package</span>
          </button>
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this package?"
          description={`"${pendingDelete.title}" will be removed from the public Studio page and can no longer be booked.`}
          onConfirm={remove}
          onCancel={() => setPendingDelete(null)}
          busy={busyId === pendingDelete.id}
        />
      )}
    </>
  );
}
