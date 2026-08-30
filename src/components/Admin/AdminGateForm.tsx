"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminGateForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: { email?: string; password?: string } = {};
    if (!email.trim()) nextErrors.email = "Email is required.";
    if (!password.trim()) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFormError(data.error ?? "Sign in failed. Please try again.");
        setLoading(false);
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setFormError("Sign in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      {formError && (
        <div className="form-status-banner form-status-banner--error" role="alert">
          {formError}
        </div>
      )}

      <div className={`form-field${errors.email ? " has-error" : ""}`}>
        <label className="form-label" htmlFor="admin-email">
          Email
        </label>
        <input
          id="admin-email"
          className="form-input"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
        />
        {errors.email && <span className="form-error-text">{errors.email}</span>}
      </div>

      <div className={`form-field${errors.password ? " has-error" : ""}`}>
        <label className="form-label" htmlFor="admin-password">
          Password
        </label>
        <input
          id="admin-password"
          className="form-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
        />
        {errors.password && <span className="form-error-text">{errors.password}</span>}
      </div>

      <div className="form-submit-row">
        <button type="submit" className="btn-gold" disabled={loading} data-cursor-hover>
          <span>
            {loading && <span className="btn-spinner" aria-hidden="true" />}
            Sign In
          </span>
        </button>
      </div>

      <div className="admin-gate-form-footer">
        <button type="button" data-cursor-hover>
          Forgot password?
        </button>
        <Link href="/" data-cursor-hover>
          Back to website
        </Link>
      </div>

      <p className="admin-gate-demo-note">
        Demo workspace — sign in with the seeded admin account:{" "}
        <strong>admin@thewoodtag.com</strong> / <strong>woodtag-admin-2026</strong>. Change
        this password from Settings once you&apos;re in.
      </p>
    </form>
  );
}
