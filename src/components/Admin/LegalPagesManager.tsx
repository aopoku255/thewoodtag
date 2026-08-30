"use client";

import { useState } from "react";
import type { LegalSection } from "@/lib/content";

interface LegalPageData {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
}

export default function LegalPagesManager({ initial }: { initial: LegalPageData[] }) {
  const [pages, setPages] = useState<LegalPageData[]>(initial);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ eyebrow: string; title: string; description: string; sectionsText: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const open = (page: LegalPageData) => {
    setOpenSlug(page.slug);
    setDraft({
      eyebrow: page.eyebrow,
      title: page.title,
      description: page.description,
      sectionsText: JSON.stringify(page.sections, null, 2),
    });
    setStatus("idle");
  };

  const save = async () => {
    if (!openSlug || !draft) return;
    let sections: LegalSection[];
    try {
      sections = JSON.parse(draft.sectionsText);
    } catch {
      setErrorMsg("Sections must be valid JSON.");
      setStatus("error");
      return;
    }
    setSaving(true);
    setErrorMsg("");
    const res = await fetch(`/api/admin/legal/${openSlug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eyebrow: draft.eyebrow, title: draft.title, description: draft.description, sections }),
    });
    setSaving(false);
    const data = await res.json();
    if (!res.ok) {
      setErrorMsg(data.error ?? "Could not save.");
      setStatus("error");
      return;
    }
    setPages((prev) => prev.map((p) => (p.slug === openSlug ? { ...p, ...data.page } : p)));
    setStatus("saved");
  };

  return (
    <div className="admin-list">
      {pages.map((page) => (
        <div key={page.slug} className="admin-category-card">
          <div className="admin-category-card__header" onClick={() => (openSlug === page.slug ? setOpenSlug(null) : open(page))}>
            <div className="admin-list-row__body">
              <div className="admin-list-row__title">{page.label}</div>
              <div className="admin-list-row__meta">{page.title}</div>
            </div>
          </div>
          {openSlug === page.slug && draft && (
            <div className="admin-category-card__body">
              {status === "saved" && (
                <div className="form-status-banner form-status-banner--success" role="status">
                  Saved.
                </div>
              )}
              {status === "error" && (
                <div className="form-status-banner form-status-banner--error" role="alert">
                  {errorMsg}
                </div>
              )}
              <div className="form-field" style={{ marginTop: 16 }}>
                <label className="form-label">Eyebrow</label>
                <input className="form-input" value={draft.eyebrow} onChange={(e) => setDraft((d) => d && { ...d, eyebrow: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Title</label>
                <input className="form-input" value={draft.title} onChange={(e) => setDraft((d) => d && { ...d, title: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={draft.description} onChange={(e) => setDraft((d) => d && { ...d, description: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Sections (JSON)</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: 260, fontFamily: "monospace", fontSize: 12.5 }}
                  value={draft.sectionsText}
                  onChange={(e) => setDraft((d) => d && { ...d, sectionsText: e.target.value })}
                />
                <span className="form-error-text" style={{ color: "var(--text-muted)" }}>
                  Array of {"{ heading, subsections: [{ label, bullets: [...] }] }"}.
                </span>
              </div>
              <button type="button" className="btn-gold" onClick={save} disabled={saving} data-cursor-hover>
                <span>
                  {saving && <span className="btn-spinner" aria-hidden="true" />}
                  Save
                </span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
