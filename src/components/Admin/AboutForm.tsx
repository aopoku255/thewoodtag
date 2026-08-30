"use client";

import { useState, type FormEvent } from "react";
import type { AboutContent } from "@prisma/client";

type AboutFields = Omit<AboutContent, "id" | "updatedAt">;

export default function AboutForm({ initial }: { initial: AboutFields }) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const update = (key: keyof AboutFields, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/about", {
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
          About content saved. The homepage reflects this immediately.
        </div>
      )}
      {status === "error" && (
        <div className="form-status-banner form-status-banner--error" role="alert">
          Could not save. Please try again.
        </div>
      )}

      <div className="form-field">
        <label className="form-label">Eyebrow Label</label>
        <input
          className="form-input"
          value={values.eyebrow}
          onChange={(e) => update("eyebrow", e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Heading Line 1</label>
          <input
            className="form-input"
            value={values.headingLine}
            onChange={(e) => update("headingLine", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Heading Emphasis (italic)</label>
          <input
            className="form-input"
            value={values.headingEmphasis}
            onChange={(e) => update("headingEmphasis", e.target.value)}
          />
        </div>
      </div>
      <div className="form-field">
        <label className="form-label">Heading Line 3 (bold)</label>
        <input
          className="form-input"
          value={values.headingLast}
          onChange={(e) => update("headingLast", e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Paragraph 1</label>
        <textarea
          className="form-textarea"
          value={values.paragraph1}
          onChange={(e) => update("paragraph1", e.target.value)}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Paragraph 2</label>
        <textarea
          className="form-textarea"
          value={values.paragraph2}
          onChange={(e) => update("paragraph2", e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Primary CTA Label</label>
          <input
            className="form-input"
            value={values.ctaPrimaryLabel}
            onChange={(e) => update("ctaPrimaryLabel", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Primary CTA URL</label>
          <input
            className="form-input"
            value={values.ctaPrimaryUrl}
            onChange={(e) => update("ctaPrimaryUrl", e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Link CTA Label</label>
          <input
            className="form-input"
            value={values.ctaLinkLabel}
            onChange={(e) => update("ctaLinkLabel", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Link CTA URL</label>
          <input
            className="form-input"
            value={values.ctaLinkUrl}
            onChange={(e) => update("ctaLinkUrl", e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Outline CTA Label</label>
          <input
            className="form-input"
            value={values.ctaOutlineLabel}
            onChange={(e) => update("ctaOutlineLabel", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Outline CTA URL</label>
          <input
            className="form-input"
            value={values.ctaOutlineUrl}
            onChange={(e) => update("ctaOutlineUrl", e.target.value)}
          />
        </div>
      </div>

      <div className="form-submit-row">
        <button type="submit" className="btn-gold" disabled={saving} data-cursor-hover>
          <span>
            {saving && <span className="btn-spinner" aria-hidden="true" />}
            Save About Content
          </span>
        </button>
      </div>
    </form>
  );
}
