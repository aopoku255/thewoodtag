"use client";

import { useState, type FormEvent } from "react";
import type { ContactPageContent } from "@prisma/client";

type Fields = Omit<ContactPageContent, "id" | "updatedAt">;

export default function ContactPageForm({ initial }: { initial: Fields }) {
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
    const res = await fetch("/api/admin/contact", {
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
          Contact page content saved.
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
          <label className="form-label">Heading Line</label>
          <input className="form-input" value={values.headingLine} onChange={(e) => update("headingLine", e.target.value)} />
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
      <div className="form-field">
        <label className="form-label">Success Heading</label>
        <input className="form-input" value={values.successHeading} onChange={(e) => update("successHeading", e.target.value)} />
      </div>
      <div className="form-field">
        <label className="form-label">Success Message</label>
        <textarea className="form-textarea" value={values.successMessage} onChange={(e) => update("successMessage", e.target.value)} />
        <span className="form-error-text" style={{ color: "var(--text-muted)" }}>
          Use {"{firstName}"} and {"{email}"} as placeholders.
        </span>
      </div>

      <div className="form-submit-row">
        <button type="submit" className="btn-gold" disabled={saving} data-cursor-hover>
          <span>
            {saving && <span className="btn-spinner" aria-hidden="true" />}
            Save Contact Page
          </span>
        </button>
      </div>
    </form>
  );
}
