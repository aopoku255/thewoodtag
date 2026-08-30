"use client";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = "Delete",
  danger = true,
  onConfirm,
  onCancel,
  busy = false,
}: ConfirmDialogProps) {
  return (
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="admin-modal-panel" style={{ maxWidth: 420 }}>
        <div className="admin-modal-header-row">
          <h2 className="panel-subheading" style={{ margin: 0 }}>
            {title}
          </h2>
          <button
            type="button"
            className="admin-modal-close"
            aria-label="Cancel"
            onClick={onCancel}
            data-cursor-hover
          >
            &times;
          </button>
        </div>
        <p className="panel-helper" style={{ marginBottom: 24 }}>
          {description}
        </p>
        <div className="admin-section-header__actions">
          <button type="button" className="btn-outline" onClick={onCancel} data-cursor-hover>
            Cancel
          </button>
          <button
            type="button"
            className="btn-gold"
            onClick={onConfirm}
            disabled={busy}
            data-cursor-hover
            style={danger ? { background: "var(--error)" } : undefined}
          >
            <span>
              {busy && <span className="btn-spinner" aria-hidden="true" />}
              {confirmLabel}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
