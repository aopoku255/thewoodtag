"use client";

import { useState, type FormEvent } from "react";
import { statusLabels, type BookingStatus } from "@/lib/bookingLabels";

type LookupState = "idle" | "loading" | "not-found" | "found";

interface BookingResult {
  reference: string;
  packageTitle: string;
  date: string;
  time: string;
  total: number;
  balanceDue: number;
  status: BookingStatus;
}

export default function BookingLookup() {
  const [value, setValue] = useState("");
  const [state, setState] = useState<LookupState>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<BookingResult | null>(null);

  const runLookup = async (ref: string) => {
    const trimmed = ref.trim();
    if (!trimmed) {
      setError("Enter a booking reference to continue.");
      setState("idle");
      return;
    }
    setError("");
    setState("loading");
    try {
      const res = await fetch(`/api/bookings/lookup?ref=${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        setState("not-found");
        return;
      }
      const data = await res.json();
      setResult(data.booking);
      setState("found");
    } catch {
      setState("not-found");
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    runLookup(value);
  };

  return (
    <>
      <p className="panel-helper">
        Paste or type your ID, then open your booking page. Try{" "}
        <strong>WOODTAG-DEMO-2026</strong> to see a sample result.
      </p>

      <form onSubmit={onSubmit} noValidate>
        <div className={`form-field${error ? " has-error" : ""}`}>
          <label className="form-label visually-hidden" htmlFor="booking-reference">
            Booking reference
          </label>
          <input
            id="booking-reference"
            className="form-input"
            type="text"
            placeholder="e.g. booking reference from email"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError("");
            }}
          />
          {error && <span className="form-error-text">{error}</span>}
        </div>

        <div className="form-submit-row">
          <button
            type="submit"
            className="btn-gold"
            disabled={state === "loading"}
            data-cursor-hover
          >
            <span>
              {state === "loading" && <span className="btn-spinner" aria-hidden="true" />}
              View Booking
            </span>
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => runLookup(value)}
            disabled={state === "loading"}
            data-cursor-hover
          >
            Jump to receipt
          </button>
        </div>
      </form>

      {state === "not-found" && (
        <div className="form-status-banner form-status-banner--error" role="alert">
          <span>
            We couldn&apos;t find a booking matching that reference. Double-check the
            ID from your confirmation email, or try the demo reference above.
          </span>
        </div>
      )}

      {state === "found" && result && (
        <dl className="lookup-result">
          <div className="lookup-result__row">
            <dt>Reference</dt>
            <dd>{result.reference}</dd>
          </div>
          <div className="lookup-result__row">
            <dt>Package</dt>
            <dd>{result.packageTitle}</dd>
          </div>
          <div className="lookup-result__row">
            <dt>Date &amp; time</dt>
            <dd>
              {result.date} &middot; {result.time}
            </dd>
          </div>
          <div className="lookup-result__row">
            <dt>Total</dt>
            <dd>GHS {result.total}</dd>
          </div>
          <div className="lookup-result__row">
            <dt>Balance due</dt>
            <dd>GHS {result.balanceDue}</dd>
          </div>
          <div className="lookup-result__row">
            <dt>Status</dt>
            <dd>
              <span className={`status-pill status-pill--${result.status}`}>
                {statusLabels[result.status]}
                {result.balanceDue === 0 ? " · Receipt Ready" : ""}
              </span>
            </dd>
          </div>
        </dl>
      )}
    </>
  );
}
