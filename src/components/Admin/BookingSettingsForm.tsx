"use client";

import { useState, type FormEvent } from "react";
import type { BookingSettings } from "@prisma/client";

const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Fields = Omit<BookingSettings, "id" | "updatedAt">;

export default function BookingSettingsForm({ initial }: { initial: Fields }) {
  const [openDays, setOpenDays] = useState<Set<number>>(
    new Set(initial.openDays.split(",").map((d) => parseInt(d, 10)).filter((n) => !Number.isNaN(n)))
  );
  const [timeSlots, setTimeSlots] = useState<string[]>(initial.timeSlots.split(",").map((s) => s.trim()));
  const [newSlot, setNewSlot] = useState("");
  const [addOns, setAddOns] = useState<{ name: string; price: string }[]>(
    initial.addOns
      .split(",")
      .map((entry) => entry.split(":"))
      .filter((pair) => pair.length === 2)
      .map(([name, price]) => ({ name: name.trim(), price: price.trim() }))
  );
  const [newAddon, setNewAddon] = useState({ name: "", price: "" });
  const [values, setValues] = useState({
    minNoticeHours: initial.minNoticeHours,
    maxAdvanceDays: initial.maxAdvanceDays,
    confirmationMessage: initial.confirmationMessage,
    cancellationMessage: initial.cancellationMessage,
    lookupHeading: initial.lookupHeading,
    lookupDescription: initial.lookupDescription,
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const toggleDay = (day: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
    setStatus("idle");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...values,
      openDays: [...openDays].sort().join(","),
      timeSlots: timeSlots.join(","),
      addOns: addOns.map((a) => `${a.name}:${a.price}`).join(","),
    };
    const res = await fetch("/api/admin/booking-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setStatus(res.ok ? "saved" : "error");
  };

  return (
    <form onSubmit={onSubmit}>
      {status === "saved" && (
        <div className="form-status-banner form-status-banner--success" role="status">
          Booking settings saved. The public booking flow reflects this immediately.
        </div>
      )}
      {status === "error" && (
        <div className="form-status-banner form-status-banner--error" role="alert">
          Could not save. Please try again.
        </div>
      )}

      <div className="form-field">
        <label className="form-label">Open Days</label>
        <div className="admin-section-header__actions">
          {DOW_LABELS.map((label, i) => (
            <button
              key={label}
              type="button"
              className={`admin-filter-chip${openDays.has(i) ? " is-active" : ""}`}
              onClick={() => toggleDay(i)}
              data-cursor-hover
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Time Slots</label>
        <div className="admin-section-header__actions" style={{ marginBottom: 10 }}>
          {timeSlots.map((slot, i) => (
            <span key={slot + i} className="admin-badge admin-badge--draft" style={{ padding: "6px 12px" }}>
              {slot}{" "}
              <button
                type="button"
                onClick={() => setTimeSlots((prev) => prev.filter((_, idx) => idx !== i))}
                style={{ marginLeft: 6, background: "none", border: "none", color: "inherit", cursor: "pointer" }}
                aria-label={`Remove ${slot}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="form-input"
            placeholder="e.g. 9:00 AM"
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
          />
          <button
            type="button"
            className="btn-outline"
            onClick={() => {
              if (newSlot.trim()) {
                setTimeSlots((prev) => [...prev, newSlot.trim()]);
                setNewSlot("");
              }
            }}
            data-cursor-hover
          >
            Add
          </button>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Minimum Notice (hours)</label>
          <input
            className="form-input"
            type="number"
            min={0}
            value={values.minNoticeHours}
            onChange={(e) => setValues((v) => ({ ...v, minNoticeHours: parseInt(e.target.value, 10) || 0 }))}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Max Advance Booking (days)</label>
          <input
            className="form-input"
            type="number"
            min={1}
            value={values.maxAdvanceDays}
            onChange={(e) => setValues((v) => ({ ...v, maxAdvanceDays: parseInt(e.target.value, 10) || 1 }))}
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Add-ons</label>
        <div className="admin-list" style={{ marginBottom: 10 }}>
          {addOns.map((addon, i) => (
            <div key={addon.name + i} className="admin-list-row">
              <div className="admin-list-row__body">
                <div className="admin-list-row__title">{addon.name}</div>
                <div className="admin-list-row__meta">+GHS {addon.price}</div>
              </div>
              <button
                type="button"
                className="admin-icon-btn"
                aria-label={`Remove ${addon.name}`}
                onClick={() => setAddOns((prev) => prev.filter((_, idx) => idx !== i))}
                data-cursor-hover
              >
                🗑
              </button>
            </div>
          ))}
        </div>
        <div className="form-row">
          <input
            className="form-input"
            placeholder="Add-on name"
            value={newAddon.name}
            onChange={(e) => setNewAddon((a) => ({ ...a, name: e.target.value }))}
          />
          <input
            className="form-input"
            placeholder="Price (GHS)"
            type="number"
            value={newAddon.price}
            onChange={(e) => setNewAddon((a) => ({ ...a, price: e.target.value }))}
          />
        </div>
        <button
          type="button"
          className="btn-outline"
          style={{ marginTop: 8 }}
          onClick={() => {
            if (newAddon.name.trim() && newAddon.price.trim()) {
              setAddOns((prev) => [...prev, newAddon]);
              setNewAddon({ name: "", price: "" });
            }
          }}
          data-cursor-hover
        >
          Add
        </button>
      </div>

      <div className="form-field">
        <label className="form-label">Booking Lookup Heading</label>
        <input
          className="form-input"
          value={values.lookupHeading}
          onChange={(e) => setValues((v) => ({ ...v, lookupHeading: e.target.value }))}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Booking Lookup Description</label>
        <textarea
          className="form-textarea"
          value={values.lookupDescription}
          onChange={(e) => setValues((v) => ({ ...v, lookupDescription: e.target.value }))}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Confirmation Message</label>
        <textarea
          className="form-textarea"
          value={values.confirmationMessage}
          onChange={(e) => setValues((v) => ({ ...v, confirmationMessage: e.target.value }))}
        />
        <span className="form-error-text" style={{ color: "var(--text-muted)" }}>
          Use {"{email}"} and {"{reference}"} as placeholders.
        </span>
      </div>
      <div className="form-field">
        <label className="form-label">Cancellation Message</label>
        <textarea
          className="form-textarea"
          value={values.cancellationMessage}
          onChange={(e) => setValues((v) => ({ ...v, cancellationMessage: e.target.value }))}
        />
      </div>

      <div className="form-submit-row">
        <button type="submit" className="btn-gold" disabled={saving} data-cursor-hover>
          <span>
            {saving && <span className="btn-spinner" aria-hidden="true" />}
            Save Booking Settings
          </span>
        </button>
      </div>
    </form>
  );
}
