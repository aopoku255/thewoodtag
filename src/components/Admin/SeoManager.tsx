"use client";

import { useState } from "react";
import type { SeoSetting } from "@prisma/client";

const PAGE_LABELS: Record<string, string> = {
  home: "Home",
  services: "Services",
  catalogue: "Catalogue",
  studio: "Studio",
  about: "About",
  contact: "Contact",
  pricing: "Pricing",
  bookings: "My Booking",
};

export default function SeoManager({ initial }: { initial: SeoSetting[] }) {
  const [pages, setPages] = useState<SeoSetting[]>(initial);
  const [openPage, setOpenPage] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<SeoSetting, "id" | "page"> | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const open = (setting: SeoSetting) => {
    setOpenPage(setting.page);
    setDraft({
      title: setting.title,
      metaDescription: setting.metaDescription,
      ogTitle: setting.ogTitle,
      ogDescription: setting.ogDescription,
      ogImageUrl: setting.ogImageUrl,
    });
    setStatus("idle");
  };

  const save = async () => {
    if (!openPage || !draft) return;
    setSaving(true);
    const res = await fetch(`/api/admin/seo/${openPage}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setSaving(false);
    if (!res.ok) {
      setStatus("error");
      return;
    }
    const data = await res.json();
    setPages((prev) => prev.map((p) => (p.page === openPage ? data.setting : p)));
    setStatus("saved");
  };

  return (
    <div className="admin-list">
      {pages.map((setting) => (
        <div key={setting.id} className="admin-category-card">
          <div className="admin-category-card__header" onClick={() => (openPage === setting.page ? setOpenPage(null) : open(setting))}>
            <div className="admin-list-row__body">
              <div className="admin-list-row__title">{PAGE_LABELS[setting.page] ?? setting.page}</div>
              <div className="admin-list-row__meta">{setting.title}</div>
            </div>
          </div>
          {openPage === setting.page && draft && (
            <div className="admin-category-card__body">
              {status === "saved" && (
                <div className="form-status-banner form-status-banner--success" role="status">
                  Saved.
                </div>
              )}
              {status === "error" && (
                <div className="form-status-banner form-status-banner--error" role="alert">
                  Could not save.
                </div>
              )}
              <div className="form-field" style={{ marginTop: 16 }}>
                <label className="form-label">Page Title</label>
                <input className="form-input" value={draft.title} onChange={(e) => setDraft((d) => d && { ...d, title: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Meta Description</label>
                <textarea className="form-textarea" value={draft.metaDescription} onChange={(e) => setDraft((d) => d && { ...d, metaDescription: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Open Graph Title</label>
                <input className="form-input" value={draft.ogTitle} onChange={(e) => setDraft((d) => d && { ...d, ogTitle: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Open Graph Description</label>
                <textarea className="form-textarea" value={draft.ogDescription} onChange={(e) => setDraft((d) => d && { ...d, ogDescription: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Open Graph Image URL</label>
                <input className="form-input" value={draft.ogImageUrl} onChange={(e) => setDraft((d) => d && { ...d, ogImageUrl: e.target.value })} />
              </div>
              <button type="button" className="btn-gold" onClick={save} disabled={saving} data-cursor-hover>
                <span>
                  {saving && <span className="btn-spinner" aria-hidden="true" />}
                  Save SEO
                </span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
