"use client";

import { useState, type FormEvent } from "react";
import type { StudioPageContent } from "@prisma/client";

type Fields = Omit<StudioPageContent, "id" | "updatedAt">;

export default function StudioPageForm({ initial }: { initial: Fields }) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const update = (key: keyof Fields, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/studio-page", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    setStatus(res.ok ? "saved" : "error");
  };

  return (
    <form onSubmit={onSubmit}>
      {status === "saved" && (
        <div className="form-status-banner form-status-banner--success" role="status">
          Saved. The public About page reflects this immediately.
        </div>
      )}
      {status === "error" && (
        <div className="form-status-banner form-status-banner--error" role="alert">
          Could not save. Please try again.
        </div>
      )}

      <div className="form-field">
        <label className="form-label">Eyebrow Label</label>
        <input className="form-input" value={values.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Heading</label>
          <input className="form-input" value={values.heading} onChange={(e) => update("heading", e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Heading Emphasis (italic)</label>
          <input className="form-input" value={values.headingEmphasis} onChange={(e) => update("headingEmphasis", e.target.value)} />
        </div>
      </div>
      <div className="form-field">
        <label className="form-label">Description</label>
        <textarea className="form-textarea" value={values.description} onChange={(e) => update("description", e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Outline CTA Label</label>
          <input className="form-input" value={values.ctaOutlineLabel} onChange={(e) => update("ctaOutlineLabel", e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Outline CTA URL</label>
          <input className="form-input" value={values.ctaOutlineUrl} onChange={(e) => update("ctaOutlineUrl", e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Primary CTA Label</label>
          <input className="form-input" value={values.ctaPrimaryLabel} onChange={(e) => update("ctaPrimaryLabel", e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Primary CTA URL</label>
          <input className="form-input" value={values.ctaPrimaryUrl} onChange={(e) => update("ctaPrimaryUrl", e.target.value)} />
        </div>
      </div>

      <div className="form-submit-row">
        <button type="submit" className="btn-gold" disabled={saving} data-cursor-hover>
          <span>
            {saving && <span className="btn-spinner" aria-hidden="true" />}
            Save
          </span>
        </button>
      </div>
    </form>
  );
}
