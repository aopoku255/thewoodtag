"use client";

import { useState } from "react";
import type { StudioAddon } from "@prisma/client";
import ImageField from "./ImageField";
import ConfirmDialog from "./ConfirmDialog";

type Draft = Pick<StudioAddon, "slug" | "title" | "spec" | "description" | "imageUrl" | "imageAlt" | "published">;

const EMPTY_DRAFT: Draft = {
  slug: "",
  title: "",
  spec: "",
  description: "",
  imageUrl: "",
  imageAlt: "",
  published: true,
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AddonsManager({ initial }: { initial: StudioAddon[] }) {
  const [addons, setAddons] = useState<StudioAddon[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<StudioAddon | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const sorted = [...addons].sort((a, b) => a.sortOrder - b.sortOrder);

  const startCreate = () => {
    setDraft(EMPTY_DRAFT);
    setCreating(true);
    setEditingId(null);
    setError("");
  };

  const startEdit = (addon: StudioAddon) => {
    setDraft({
      slug: addon.slug,
      title: addon.title,
      spec: addon.spec,
      description: addon.description,
      imageUrl: addon.imageUrl,
      imageAlt: addon.imageAlt,
      published: addon.published,
    });
    setEditingId(addon.id);
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
      ? await fetch("/api/admin/addons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...draft, slug }),
        })
      : await fetch(`/api/admin/addons/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...draft, slug }),
        });

    setSaving(false);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not save add-on.");
      return;
    }
    if (creating) {
      setAddons((prev) => [...prev, data.addon]);
    } else {
      setAddons((prev) => prev.map((a) => (a.id === editingId ? data.addon : a)));
    }
    cancel();
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    const res = await fetch(`/api/admin/addons/${pendingDelete.id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) setAddons((prev) => prev.filter((a) => a.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  const formOpen = creating || editingId !== null;

  return (
    <>
      <div className="admin-list">
        {sorted.map((addon) => (
          <div key={addon.id} className="admin-list-row">
            <div className="admin-list-row__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={addon.imageUrl} alt={addon.imageAlt} />
            </div>
            <div className="admin-list-row__body">
              <div className="admin-list-row__title">{addon.title}</div>
              <div className="admin-list-row__meta">{addon.spec}</div>
            </div>
            <div className="admin-list-row__actions">
              <button type="button" className="admin-icon-btn" aria-label="Edit" onClick={() => startEdit(addon)} data-cursor-hover>✎</button>
              <button type="button" className="admin-icon-btn" aria-label="Delete" onClick={() => setPendingDelete(addon)} data-cursor-hover>🗑</button>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <p className="admin-empty-state">No add-ons yet.</p>}
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
            <label className="form-label">Spec Line</label>
            <input className="form-input" value={draft.spec} onChange={(e) => setDraft((d) => ({ ...d, spec: e.target.value }))} />
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
          <div className="admin-section-header__actions">
            <button type="button" className="btn-outline" onClick={cancel} data-cursor-hover>Cancel</button>
            <button type="button" className="btn-gold" onClick={save} disabled={saving} data-cursor-hover>
              <span>
                {saving && <span className="btn-spinner" aria-hidden="true" />}
                {creating ? "Create Add-on" : "Save Changes"}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-form-panel">
          <button type="button" className="btn-gold" onClick={startCreate} data-cursor-hover>
            <span>+ Add Add-on</span>
          </button>
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this add-on?"
          description={`"${pendingDelete.title}" will be removed from the About page.`}
          onConfirm={remove}
          onCancel={() => setPendingDelete(null)}
          busy={busyId === pendingDelete.id}
        />
      )}
    </>
  );
}
