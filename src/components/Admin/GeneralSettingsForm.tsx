"use client";

import { useState, type FormEvent } from "react";
import type { SiteSettings } from "@prisma/client";

export default function GeneralSettingsForm({ initial }: { initial: SiteSettings }) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErrorMsg(data.error ?? "Could not save settings.");
      setStatus("error");
      return;
    }
    const data = await res.json();
    setValues(data.settings);
    setStatus("saved");
  };

  return (
    <form onSubmit={onSubmit}>
      {status === "saved" && (
        <div className="form-status-banner form-status-banner--success" role="status">
          Settings saved. Changes are live on the public site now.
        </div>
      )}
      {status === "error" && (
        <div className="form-status-banner form-status-banner--error" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="siteName">
            Site Name
          </label>
          <input
            id="siteName"
            className="form-input"
            value={values.siteName}
            onChange={(e) => update("siteName", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="logoWordmark">
            Logo Wordmark
          </label>
          <input
            id="logoWordmark"
            className="form-input"
            value={values.logoWordmark}
            onChange={(e) => update("logoWordmark", e.target.value)}
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="siteTagline">
          Site Tagline
        </label>
        <input
          id="siteTagline"
          className="form-input"
          value={values.siteTagline}
          onChange={(e) => update("siteTagline", e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="primaryEmail">
            Primary Email
          </label>
          <input
            id="primaryEmail"
            className="form-input"
            type="email"
            value={values.primaryEmail}
            onChange={(e) => update("primaryEmail", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            className="form-input"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="address">
          Address
        </label>
        <input
          id="address"
          className="form-input"
          value={values.address}
          onChange={(e) => update("address", e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="businessHours">
            Business Hours
          </label>
          <input
            id="businessHours"
            className="form-input"
            value={values.businessHours}
            onChange={(e) => update("businessHours", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="whatsappUrl">
            WhatsApp Link (optional)
          </label>
          <input
            id="whatsappUrl"
            className="form-input"
            placeholder="https://wa.me/..."
            value={values.whatsappUrl}
            onChange={(e) => update("whatsappUrl", e.target.value)}
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="footerQuote">
          Footer Quote
        </label>
        <input
          id="footerQuote"
          className="form-input"
          value={values.footerQuote}
          onChange={(e) => update("footerQuote", e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="copyrightText">
            Copyright Text
          </label>
          <input
            id="copyrightText"
            className="form-input"
            value={values.copyrightText}
            onChange={(e) => update("copyrightText", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="footerCredit">
            Footer Credit
          </label>
          <input
            id="footerCredit"
            className="form-input"
            value={values.footerCredit}
            onChange={(e) => update("footerCredit", e.target.value)}
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="faviconEmoji">
          Favicon Emoji
        </label>
        <input
          id="faviconEmoji"
          className="form-input"
          style={{ maxWidth: 120 }}
          value={values.faviconEmoji}
          onChange={(e) => update("faviconEmoji", e.target.value)}
        />
      </div>

      <div className="form-submit-row">
        <button type="submit" className="btn-gold" disabled={saving} data-cursor-hover>
          <span>
            {saving && <span className="btn-spinner" aria-hidden="true" />}
            Save Settings
          </span>
        </button>
      </div>
    </form>
  );
}
