"use client";

import { useState, type FormEvent } from "react";

export default function ProfileForm({ initial }: { initial: { name: string; email: string } }) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    const data = await res.json();
    if (!res.ok) {
      setErrorMsg(data.error ?? "Could not save.");
      setStatus("error");
      return;
    }
    setValues(data.admin);
    setStatus("saved");
  };

  return (
    <form onSubmit={onSubmit}>
      {status === "saved" && (
        <div className="form-status-banner form-status-banner--success" role="status">
          Profile updated.
        </div>
      )}
      {status === "error" && (
        <div className="form-status-banner form-status-banner--error" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="form-field">
        <label className="form-label">Name</label>
        <input
          className="form-input"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Email</label>
        <input
          className="form-input"
          type="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        />
      </div>

      <div className="form-submit-row">
        <button type="submit" className="btn-gold" disabled={saving} data-cursor-hover>
          <span>
            {saving && <span className="btn-spinner" aria-hidden="true" />}
            Save Profile
          </span>
        </button>
      </div>
    </form>
  );
}
