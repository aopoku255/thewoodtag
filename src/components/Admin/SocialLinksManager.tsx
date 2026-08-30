"use client";

import { useState } from "react";
import type { SocialLink } from "@prisma/client";
import ConfirmDialog from "./ConfirmDialog";

const ICONS = ["camera", "play", "linkedin", "sparkle"] as const;

export default function SocialLinksManager({ initial }: { initial: SocialLink[] }) {
  const [links, setLinks] = useState<SocialLink[]>(initial);
  const [pendingDelete, setPendingDelete] = useState<SocialLink | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ platform: "", url: "", icon: "camera" as (typeof ICONS)[number] });

  const patch = async (id: string, data: Partial<SocialLink>) => {
    setBusyId(id);
    const res = await fetch(`/api/admin/social/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setBusyId(null);
    if (res.ok) {
      const json = await res.json();
      setLinks((prev) => prev.map((l) => (l.id === id ? json.link : l)));
    }
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    const res = await fetch(`/api/admin/social/${pendingDelete.id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) {
      setLinks((prev) => prev.filter((l) => l.id !== pendingDelete.id));
    }
    setPendingDelete(null);
  };

  const addLink = async () => {
    if (!draft.platform.trim() || !draft.url.trim()) return;
    setBusyId("new");
    const res = await fetch("/api/admin/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setBusyId(null);
    if (res.ok) {
      const json = await res.json();
      setLinks((prev) => [...prev, json.link]);
      setDraft({ platform: "", url: "", icon: "camera" });
      setAdding(false);
    }
  };

  return (
    <>
      <div className="admin-list">
        {links.map((link) => (
          <div key={link.id} className="admin-list-row">
            <div className="admin-list-row__body">
              <div className="admin-list-row__title">
                {link.platform}
                {!link.visible && <span className="admin-badge admin-badge--draft">Hidden</span>}
              </div>
              <div className="admin-list-row__meta">{link.url}</div>
            </div>
            <div className="admin-list-row__actions">
              <button
                type="button"
                className="admin-icon-btn"
                aria-label={link.visible ? "Hide" : "Show"}
                onClick={() => patch(link.id, { visible: !link.visible })}
                disabled={busyId === link.id}
                data-cursor-hover
              >
                {link.visible ? "👁" : "🚫"}
              </button>
              <button
                type="button"
                className="admin-icon-btn"
                aria-label="Delete"
                onClick={() => setPendingDelete(link)}
                disabled={busyId === link.id}
                data-cursor-hover
              >
                🗑
              </button>
            </div>
          </div>
        ))}
        {links.length === 0 && <p className="admin-empty-state">No social links yet.</p>}
      </div>

      {adding ? (
        <div className="admin-form-panel">
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Platform</label>
              <input
                className="form-input"
                value={draft.platform}
                onChange={(e) => setDraft((d) => ({ ...d, platform: e.target.value }))}
                placeholder="Instagram"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Icon</label>
              <select
                className="form-select"
                value={draft.icon}
                onChange={(e) => setDraft((d) => ({ ...d, icon: e.target.value as (typeof ICONS)[number] }))}
              >
                {ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">URL</label>
            <input
              className="form-input"
              value={draft.url}
              onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
              placeholder="https://instagram.com/thewoodtag"
            />
          </div>
          <div className="admin-section-header__actions">
            <button type="button" className="btn-outline" onClick={() => setAdding(false)} data-cursor-hover>
              Cancel
            </button>
            <button
              type="button"
              className="btn-gold"
              onClick={addLink}
              disabled={busyId === "new"}
              data-cursor-hover
            >
              <span>
                {busyId === "new" && <span className="btn-spinner" aria-hidden="true" />}
                Add Link
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-form-panel">
          <button type="button" className="btn-outline" onClick={() => setAdding(true)} data-cursor-hover>
            + Add Social Link
          </button>
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete social link?"
          description={`This removes "${pendingDelete.platform}" from the footer.`}
          onConfirm={remove}
          onCancel={() => setPendingDelete(null)}
          busy={busyId === pendingDelete.id}
        />
      )}
    </>
  );
}
