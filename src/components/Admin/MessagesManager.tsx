"use client";

import { useState } from "react";
import type { ContactMessage } from "@prisma/client";
import ConfirmDialog from "./ConfirmDialog";

// An explicit locale (rather than the runtime default) keeps this identical
// between the server render and the browser, whatever locale either is
// configured with — using the default would risk a hydration mismatch.
function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date));
}

export default function MessagesManager({ initial }: { initial: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initial);
  const [openId, setOpenId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ContactMessage | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const open = async (message: ContactMessage) => {
    setOpenId(openId === message.id ? null : message.id);
    if (!message.read) {
      const res = await fetch(`/api/admin/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => prev.map((m) => (m.id === message.id ? data.message : m)));
      }
    }
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    const res = await fetch(`/api/admin/messages/${pendingDelete.id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) setMessages((prev) => prev.filter((m) => m.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  return (
    <>
      <div className="admin-list">
        {messages.map((message) => (
          <div key={message.id} className="admin-category-card">
            <div className="admin-category-card__header" onClick={() => open(message)}>
              <div className="admin-list-row__body">
                <div className="admin-list-row__title">
                  {message.firstName} {message.lastName}
                  {!message.read && <span className="admin-badge admin-badge--published">New</span>}
                </div>
                <div className="admin-list-row__meta">
                  {message.email} &middot; {message.service} &middot;{" "}
                  {formatDate(message.createdAt)}
                </div>
              </div>
              <div className="admin-list-row__actions" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="Delete"
                  onClick={() => setPendingDelete(message)}
                  disabled={busyId === message.id}
                  data-cursor-hover
                >
                  🗑
                </button>
              </div>
            </div>
            {openId === message.id && (
              <div className="admin-category-card__body">
                <p className="panel-helper" style={{ marginTop: 16 }}>
                  <strong>Phone:</strong> {message.phone}
                </p>
                <p className="panel-helper">{message.vision}</p>
                <a href={`mailto:${message.email}`} className="btn-outline" data-cursor-hover>
                  Reply by Email
                </a>
              </div>
            )}
          </div>
        ))}
        {messages.length === 0 && (
          <p className="admin-empty-state">
            No messages yet. Enquiries submitted through the public Contact
            form will appear here.
          </p>
        )}
      </div>

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this message?"
          description={`The enquiry from ${pendingDelete.firstName} ${pendingDelete.lastName} will be permanently removed.`}
          onConfirm={remove}
          onCancel={() => setPendingDelete(null)}
          busy={busyId === pendingDelete.id}
        />
      )}
    </>
  );
}
