"use client";

import { useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  alt: string;
  mimeType: string;
  size: number;
  createdAt: string | Date;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryManager({ initial }: { initial: MediaAsset[] }) {
  const [assets, setAssets] = useState<MediaAsset[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<MediaAsset | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setError("");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      setAssets((prev) => [data.asset, ...prev]);
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    const res = await fetch(`/api/admin/media/${pendingDelete.id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) setAssets((prev) => prev.filter((a) => a.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  return (
    <>
      {error && (
        <div className="form-status-banner form-status-banner--error" role="alert">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        className="btn-gold"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        data-cursor-hover
        style={{ marginBottom: 20 }}
      >
        <span>
          {uploading && <span className="btn-spinner" aria-hidden="true" />}
          Upload Image
        </span>
      </button>

      {assets.length === 0 ? (
        <p className="admin-empty-state">
          No uploads yet. Images you upload from any content form also appear
          here.
        </p>
      ) : (
        <div className="media-grid" style={{ maxHeight: "none" }}>
          {assets.map((asset) => (
            <div key={asset.id} className="catalogue-image-cell">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset.url} alt={asset.alt} />
              <div className="catalogue-image-cell__actions">
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="Delete"
                  onClick={() => setPendingDelete(asset)}
                  disabled={busyId === asset.id}
                  data-cursor-hover
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this file?"
          description={`${pendingDelete.filename} (${formatSize(
            pendingDelete.size
          )}) will be permanently removed. If it's used anywhere on the site, that image will break — replace it first if needed.`}
          onConfirm={remove}
          onCancel={() => setPendingDelete(null)}
          busy={busyId === pendingDelete.id}
        />
      )}
    </>
  );
}
