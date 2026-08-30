"use client";

import { useState } from "react";
import type { NavigationItem } from "@prisma/client";
import ConfirmDialog from "./ConfirmDialog";

const LOCATIONS: { key: NavigationItem["location"]; label: string }[] = [
  { key: "header", label: "Header Navigation" },
  { key: "footer-explore", label: "Footer — Explore" },
  { key: "footer-sessions", label: "Footer — Sessions" },
  { key: "footer-legal", label: "Footer — Legal" },
];

export default function NavigationManager({ initial }: { initial: NavigationItem[] }) {
  const [items, setItems] = useState<NavigationItem[]>(initial);
  const [pendingDelete, setPendingDelete] = useState<NavigationItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [addingFor, setAddingFor] = useState<NavigationItem["location"] | null>(null);
  const [draft, setDraft] = useState({ label: "", url: "" });
  const [error, setError] = useState("");

  const patch = async (id: string, data: Partial<NavigationItem>) => {
    setBusyId(id);
    setError("");
    const res = await fetch(`/api/admin/nav/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setBusyId(null);
    if (res.ok) {
      const json = await res.json();
      setItems((prev) => prev.map((it) => (it.id === id ? json.item : it)));
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Could not update link.");
    }
  };

  const move = (location: NavigationItem["location"], index: number, direction: -1 | 1) => {
    const group = items.filter((it) => it.location === location).sort((a, b) => a.sortOrder - b.sortOrder);
    const current = group[index];
    const target = group[index + direction];
    if (!current || !target) return;
    patch(current.id, { sortOrder: target.sortOrder });
    patch(target.id, { sortOrder: current.sortOrder });
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    const res = await fetch(`/api/admin/nav/${pendingDelete.id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) setItems((prev) => prev.filter((it) => it.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  const addItem = async (location: NavigationItem["location"]) => {
    if (!draft.label.trim() || !draft.url.trim()) return;
    setError("");
    setBusyId("new");
    const res = await fetch("/api/admin/nav", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, location }),
    });
    setBusyId(null);
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Could not add link.");
      return;
    }
    setItems((prev) => [...prev, json.item]);
    setDraft({ label: "", url: "" });
    setAddingFor(null);
  };

  return (
    <>
      {error && (
        <div className="form-status-banner form-status-banner--error" role="alert">
          {error}
        </div>
      )}

      {LOCATIONS.map(({ key, label }) => {
        const group = items.filter((it) => it.location === key).sort((a, b) => a.sortOrder - b.sortOrder);
        return (
          <div key={key} className="admin-panel" style={{ marginBottom: 20 }}>
            <h2 className="admin-subsection-title">{label}</h2>
            <div className="admin-list">
              {group.map((item, index) => (
                <div key={item.id} className="admin-list-row">
                  <div className="admin-list-row__body">
                    <div className="admin-list-row__title">
                      {item.label}
                      {!item.visible && <span className="admin-badge admin-badge--draft">Hidden</span>}
                    </div>
                    <div className="admin-list-row__meta">{item.url}</div>
                  </div>
                  <div className="admin-list-row__actions">
                    <button type="button" className="admin-icon-btn" aria-label="Move up" onClick={() => move(key, index, -1)} disabled={index === 0} data-cursor-hover>↑</button>
                    <button type="button" className="admin-icon-btn" aria-label="Move down" onClick={() => move(key, index, 1)} disabled={index === group.length - 1} data-cursor-hover>↓</button>
                    <button type="button" className="admin-icon-btn" aria-label={item.visible ? "Hide" : "Show"} onClick={() => patch(item.id, { visible: !item.visible })} disabled={busyId === item.id} data-cursor-hover>
                      {item.visible ? "👁" : "🚫"}
                    </button>
                    <button type="button" className="admin-icon-btn" aria-label="Delete" onClick={() => setPendingDelete(item)} disabled={busyId === item.id} data-cursor-hover>🗑</button>
                  </div>
                </div>
              ))}
              {group.length === 0 && <p className="admin-empty-state">No links yet.</p>}
            </div>

            {addingFor === key ? (
              <div className="admin-form-panel">
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Label</label>
                    <input className="form-input" value={draft.label} onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">URL</label>
                    <input className="form-input" placeholder="/services" value={draft.url} onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))} />
                  </div>
                </div>
                <div className="admin-section-header__actions">
                  <button type="button" className="btn-outline" onClick={() => setAddingFor(null)} data-cursor-hover>Cancel</button>
                  <button type="button" className="btn-gold" onClick={() => addItem(key)} disabled={busyId === "new"} data-cursor-hover>
                    <span>
                      {busyId === "new" && <span className="btn-spinner" aria-hidden="true" />}
                      Add Link
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="admin-form-panel">
                <button type="button" className="btn-outline" onClick={() => setAddingFor(key)} data-cursor-hover>
                  + Add Link
                </button>
              </div>
            )}
          </div>
        );
      })}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this link?"
          description={`"${pendingDelete.label}" will be removed from the site.`}
          onConfirm={remove}
          onCancel={() => setPendingDelete(null)}
          busy={busyId === pendingDelete.id}
        />
      )}
    </>
  );
}
