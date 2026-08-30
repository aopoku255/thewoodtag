"use client";

import { useState, type FormEvent } from "react";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  vision: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  service: "",
  vision: "",
};

interface ContactFormProps {
  services: { slug: string; title: string }[];
  successHeading: string;
  successMessage: string;
}

export default function ContactForm({ services, successHeading, successMessage }: ContactFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!values.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!values.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!values.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!values.service) nextErrors.service = "Select a service.";
    if (!values.vision.trim()) nextErrors.vision = "Tell us a little about your project.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Something went wrong sending your enquiry. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Something went wrong sending your enquiry. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="form-success-state">
        <div className="form-success-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4.5 4.5L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3>{successHeading}</h3>
        <p>
          {successMessage
            .replace("{firstName}", values.firstName)
            .replace("{email}", values.email)}
        </p>
        <button
          type="button"
          className="btn-outline"
          onClick={() => {
            setValues(initialValues);
            setStatus("idle");
          }}
          data-cursor-hover
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {status === "error" && (
        <div className="form-status-banner form-status-banner--error" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="form-row">
        <div className={`form-field${errors.firstName ? " has-error" : ""}`}>
          <label className="form-label" htmlFor="c-firstName">
            First Name
          </label>
          <input
            id="c-firstName"
            className="form-input"
            type="text"
            placeholder="Ama"
            value={values.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
          />
          {errors.firstName && <span className="form-error-text">{errors.firstName}</span>}
        </div>
        <div className={`form-field${errors.lastName ? " has-error" : ""}`}>
          <label className="form-label" htmlFor="c-lastName">
            Last Name
          </label>
          <input
            id="c-lastName"
            className="form-input"
            type="text"
            placeholder="Mensah"
            value={values.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
          />
          {errors.lastName && <span className="form-error-text">{errors.lastName}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className={`form-field${errors.email ? " has-error" : ""}`}>
          <label className="form-label" htmlFor="c-email">
            Email
          </label>
          <input
            id="c-email"
            className="form-input"
            type="email"
            placeholder="hello@youremail.com"
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
          {errors.email && <span className="form-error-text">{errors.email}</span>}
        </div>
        <div className={`form-field${errors.phone ? " has-error" : ""}`}>
          <label className="form-label" htmlFor="c-phone">
            Phone
          </label>
          <input
            id="c-phone"
            className="form-input"
            type="tel"
            placeholder="+1 555 000 0000"
            value={values.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
          {errors.phone && <span className="form-error-text">{errors.phone}</span>}
        </div>
      </div>

      <div className={`form-field${errors.service ? " has-error" : ""}`}>
        <label className="form-label" htmlFor="c-service">
          Service
        </label>
        <select
          id="c-service"
          className="form-select"
          value={values.service}
          onChange={(e) => updateField("service", e.target.value)}
        >
          <option value="">Select a service&hellip;</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>
        {errors.service && <span className="form-error-text">{errors.service}</span>}
      </div>

      <div className={`form-field${errors.vision ? " has-error" : ""}`}>
        <label className="form-label" htmlFor="c-vision">
          Your Vision
        </label>
        <textarea
          id="c-vision"
          className="form-textarea"
          placeholder="Tell us about your project, event date, location preferences, and any inspiration you have in mind..."
          value={values.vision}
          onChange={(e) => updateField("vision", e.target.value)}
        />
        {errors.vision && <span className="form-error-text">{errors.vision}</span>}
      </div>

      <div className="form-submit-row">
        <button type="submit" className="btn-gold" disabled={status === "loading"} data-cursor-hover>
          <span>
            {status === "loading" && <span className="btn-spinner" aria-hidden="true" />}
            Send Enquiry &rarr;
          </span>
        </button>
      </div>
    </form>
  );
}
