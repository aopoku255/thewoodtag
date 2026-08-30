"use client";

import { useEffect, useRef, useState } from "react";

interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  alt: string;
  mimeType: string;
  size: number;
}

interface ImageFieldProps {
  label: string;
  imageUrl: string;
  imageAlt: string;
  onChange: (next: { imageUrl: string; imageAlt: string }) => void;
}

export default function ImageField({ label, imageUrl, imageAlt, onChange }: ImageFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    // Fetching the library when the modal opens is a genuine "sync with an
    // external system" effect — the case this lint rule exists to allow.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch("/api/admin/media")
      .then((res) => res.json())
      .then((data) => setAssets(data.assets ?? []))
      .catch(() => setError("Could not load media library."))
      .finally(() => setLoading(false));
  }, [pickerOpen]);

  const handleUpload = async (file: File) => {
    setError("");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", "");
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      setAssets((prev) => [data.asset, ...prev]);
      onChange({ imageUrl: data.asset.url, imageAlt: data.asset.alt });
      setPickerOpen(false);
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <div className="image-field">
        <div className="image-field__preview">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={imageAlt} />
          ) : (
            <span className="image-field__placeholder">No image</span>
          )}
        </div>
        <div className="image-field__actions">
          <button
            type="button"
            className="btn-outline"
            onClick={() => setPickerOpen(true)}
            data-cursor-hover
          >
            Choose Image
          </button>
          <input
            className="form-input"
            type="text"
            placeholder="Alt text (for accessibility)"
            value={imageAlt}
            onChange={(e) => onChange({ imageUrl, imageAlt: e.target.value })}
          />
        </div>
      </div>

      {pickerOpen && (
        <div
          className="admin-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Choose an image"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPickerOpen(false);
          }}
        >
          <div className="admin-modal-panel" style={{ maxWidth: 640 }}>
            <div className="admin-modal-header-row">
              <h2 className="panel-subheading" style={{ margin: 0 }}>
                Choose an image
              </h2>
              <button
                type="button"
                className="admin-modal-close"
                aria-label="Close"
                onClick={() => setPickerOpen(false)}
                data-cursor-hover
              >
                &times;
              </button>
            </div>

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
              style={{ marginBottom: 18 }}
            >
              <span>
                {uploading && <span className="btn-spinner" aria-hidden="true" />}
                Upload New Image
              </span>
            </button>

            {loading ? (
              <p className="panel-helper">Loading media library&hellip;</p>
            ) : assets.length === 0 ? (
              <p className="panel-helper">No uploads yet. Upload your first image above.</p>
            ) : (
              <div className="media-grid">
                {assets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    className="media-grid__item"
                    onClick={() => {
                      onChange({ imageUrl: asset.url, imageAlt: asset.alt || imageAlt });
                      setPickerOpen(false);
                    }}
                    data-cursor-hover
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset.url} alt={asset.alt} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
