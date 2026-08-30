"use client";

import { useState, type FormEvent } from "react";
import type { HeroContent } from "@prisma/client";

type HeroFields = Omit<HeroContent, "id" | "updatedAt">;

export default function HeroForm({ initial }: { initial: HeroFields }) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const update = (key: keyof HeroFields, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/hero", {
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
          Hero content saved. The homepage reflects this immediately.
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
          <label className="form-label">Heading Line</label>
          <input
            className="form-input"
            value={values.headingLine}
            onChange={(e) => update("headingLine", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Heading Emphasis (italic word)</label>
          <input
            className="form-input"
            value={values.headingEmphasis}
            onChange={(e) => update("headingEmphasis", e.target.value)}
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label">CTA Label</label>
          <input
            className="form-input"
            value={values.ctaLabel}
            onChange={(e) => update("ctaLabel", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">CTA Sub Label</label>
          <input
            className="form-input"
            value={values.ctaSubLabel}
            onChange={(e) => update("ctaSubLabel", e.target.value)}
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">CTA URL</label>
        <input
          className="form-input"
          value={values.ctaUrl}
          onChange={(e) => update("ctaUrl", e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Stat 1 Number</label>
          <input
            className="form-input"
            value={values.stat1Number}
            onChange={(e) => update("stat1Number", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Stat 1 Suffix</label>
          <input
            className="form-input"
            value={values.stat1Suffix}
            onChange={(e) => update("stat1Suffix", e.target.value)}
          />
        </div>
      </div>
      <div className="form-field">
        <label className="form-label">Stat 1 Label</label>
        <input
          className="form-input"
          value={values.stat1Label}
          onChange={(e) => update("stat1Label", e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Stat 2 Number</label>
          <input
            className="form-input"
            value={values.stat2Number}
            onChange={(e) => update("stat2Number", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Stat 2 Suffix</label>
          <input
            className="form-input"
            value={values.stat2Suffix}
            onChange={(e) => update("stat2Suffix", e.target.value)}
          />
        </div>
      </div>
      <div className="form-field">
        <label className="form-label">Stat 2 Label</label>
        <input
          className="form-input"
          value={values.stat2Label}
          onChange={(e) => update("stat2Label", e.target.value)}
        />
      </div>

      <div className="form-submit-row">
        <button type="submit" className="btn-gold" disabled={saving} data-cursor-hover>
          <span>
            {saving && <span className="btn-spinner" aria-hidden="true" />}
            Save Hero Content
          </span>
        </button>
      </div>
    </form>
  );
}
