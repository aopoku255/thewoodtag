"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

export interface BookingPackageView {
  slug: string;
  title: string;
  duration: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

function parsePrice(price: string): number {
  const digits = price.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function buildCalendarDays(openDays: Set<number>, maxAdvanceDays: number, minNoticeHours: number) {
  const days: { date: Date; disabled: boolean }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minNoticeDays = Math.ceil(minNoticeHours / 24);
  for (let i = 1; i <= maxAdvanceDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const disabled = !openDays.has(d.getDay()) || i < minNoticeDays;
    days.push({ date: d, disabled });
  }
  return days;
}

interface BookingFlowProps {
  packages: BookingPackageView[];
  initialPackageSlug?: string;
  timeSlots: string[];
  openDays: Set<number>;
  maxAdvanceDays: number;
  minNoticeHours: number;
  addOns: { name: string; price: number }[];
}

export default function BookingFlow({
  packages,
  initialPackageSlug,
  timeSlots,
  openDays,
  maxAdvanceDays,
  minNoticeHours,
  addOns,
}: BookingFlowProps) {
  const [packageSlug, setPackageSlug] = useState(
    packages.some((p) => p.slug === initialPackageSlug) ? initialPackageSlug! : packages[0]?.slug ?? ""
  );
  const selectedPackage = packages.find((p) => p.slug === packageSlug) ?? packages[0];

  const calendarDays = useMemo(
    () => buildCalendarDays(openDays, maxAdvanceDays, minNoticeHours),
    [openDays, maxAdvanceDays, minNoticeHours]
  );
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [takenSlots, setTakenSlots] = useState<Set<string>>(new Set());
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState<FormValues>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [scheduleError, setScheduleError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [bookingRef, setBookingRef] = useState("");
  const [confirmationText, setConfirmationText] = useState("");

  const selectedDate = selectedDateIndex !== null ? calendarDays[selectedDateIndex]?.date : null;

  useEffect(() => {
    // Fetching availability for the newly-selected date is a genuine "sync
    // with an external system" effect — the case this lint rule exists to
    // allow.
    if (!selectedDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTakenSlots(new Set());
      return;
    }
    const iso = selectedDate.toISOString().slice(0, 10);
    let cancelled = false;
    fetch(`/api/bookings/availability?date=${iso}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setTakenSlots(new Set<string>(data.takenSlots ?? []));
      })
      .catch(() => {
        if (!cancelled) setTakenSlots(new Set());
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  const addonsTotal = addOns
    .filter((a) => addons[a.name])
    .reduce((sum, a) => sum + a.price, 0);
  const total = selectedPackage ? parsePrice(selectedPackage.price) + addonsTotal : 0;

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

    const scheduleOk = selectedDateIndex !== null && selectedSlot !== null;
    setScheduleError(scheduleOk ? "" : "Select a date and time slot to continue.");
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0 && scheduleOk;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate() || !selectedDate || !selectedSlot || !selectedPackage) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          packageSlug: selectedPackage.slug,
          date: selectedDate.toISOString().slice(0, 10),
          time: selectedSlot,
          addOnNames: Object.entries(addons)
            .filter(([, checked]) => checked)
            .map(([name]) => name),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Could not confirm your booking. Please try again.");
        setStatus("idle");
        return;
      }
      setBookingRef(data.reference);
      setConfirmationText(data.confirmationMessage);
      setStatus("success");
    } catch {
      setSubmitError("Could not confirm your booking. Please try again.");
      setStatus("idle");
    }
  };

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
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
        <h3>Booking request received</h3>
        <p>{confirmationText || `Your reference is ${bookingRef}.`}</p>
        <a href="/bookings" className="btn-gold" data-cursor-hover>
          <span>Look Up This Booking</span>
        </a>
      </div>
    );
  }

  if (!selectedPackage) {
    return <p className="admin-empty-state">No packages are currently available to book.</p>;
  }

  return (
    <>
      <div className="booking-summary-card">
        <div className="booking-summary-card__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selectedPackage.imageUrl} alt={selectedPackage.imageAlt || selectedPackage.title} />
        </div>
        <div>
          <h2 className="booking-summary-card__title">{selectedPackage.title}</h2>
          <div className="booking-summary-card__meta">
            {selectedPackage.duration} &middot; {selectedPackage.price}
          </div>
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="package-select">
          Package
        </label>
        <select
          id="package-select"
          className="form-select"
          value={packageSlug}
          onChange={(e) => setPackageSlug(e.target.value)}
        >
          {packages.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title} — {p.price}
            </option>
          ))}
        </select>
      </div>

      {submitError && (
        <div className="form-status-banner form-status-banner--error" role="alert">
          {submitError}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        <div className="booking-flow-grid">
          <div>
            <div className="form-field">
              <span className="form-label">Select a date</span>
              <div className="date-grid" role="listbox" aria-label="Available dates">
                {calendarDays.map((day, i) => (
                  <button
                    key={day.date.toISOString()}
                    type="button"
                    className={`date-cell${selectedDateIndex === i ? " is-selected" : ""}`}
                    disabled={day.disabled}
                    onClick={() => {
                      setSelectedDateIndex(i);
                      setSelectedSlot(null);
                      setScheduleError("");
                    }}
                    data-cursor-hover
                  >
                    {day.date.getDate()}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-field">
              <span className="form-label">Select a time slot</span>
              <div className="slot-grid" role="listbox" aria-label="Available time slots">
                {timeSlots.map((slot) => {
                  const disabled = selectedDateIndex === null || takenSlots.has(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      className={`slot-chip${selectedSlot === slot ? " is-selected" : ""}`}
                      disabled={disabled}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setScheduleError("");
                      }}
                      data-cursor-hover
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {scheduleError && <span className="form-error-text">{scheduleError}</span>}
            </div>

            <div className="form-field">
              <span className="form-label">Add-ons</span>
              <div className="addon-list">
                {addOns.map((addon) => {
                  const checked = !!addons[addon.name];
                  return (
                    <button
                      key={addon.name}
                      type="button"
                      className="addon-row"
                      aria-pressed={checked}
                      onClick={() =>
                        setAddons((prev) => ({ ...prev, [addon.name]: !prev[addon.name] }))
                      }
                      data-cursor-hover
                    >
                      <span className="addon-row__label">
                        <span
                          className={`addon-checkbox${checked ? " is-checked" : ""}`}
                          aria-hidden="true"
                        >
                          {checked && (
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                              <path
                                d="M2 6.2l2.6 2.6L10 3"
                                stroke="#080808"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        <span className="addon-row__name">{addon.name}</span>
                      </span>
                      <span className="addon-row__price">+GHS {addon.price}</span>
                    </button>
                  );
                })}
              </div>
              <div className="booking-total-row">
                <span className="booking-total-row__label">Estimated Total</span>
                <span className="booking-total-row__value">GHS {total}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="form-row">
              <div className={`form-field${errors.firstName ? " has-error" : ""}`}>
                <label className="form-label" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  className="form-input"
                  type="text"
                  placeholder="Ama"
                  value={values.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                />
                {errors.firstName && (
                  <span className="form-error-text">{errors.firstName}</span>
                )}
              </div>
              <div className={`form-field${errors.lastName ? " has-error" : ""}`}>
                <label className="form-label" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  className="form-input"
                  type="text"
                  placeholder="Mensah"
                  value={values.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                />
                {errors.lastName && (
                  <span className="form-error-text">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-field${errors.email ? " has-error" : ""}`}>
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  placeholder="hello@youremail.com"
                  value={values.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
                {errors.email && <span className="form-error-text">{errors.email}</span>}
              </div>
              <div className={`form-field${errors.phone ? " has-error" : ""}`}>
                <label className="form-label" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  className="form-input"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={values.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
                {errors.phone && <span className="form-error-text">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-submit-row">
              <button
                type="submit"
                className="btn-gold"
                disabled={status === "loading"}
                data-cursor-hover
              >
                <span>
                  {status === "loading" && (
                    <span className="btn-spinner" aria-hidden="true" />
                  )}
                  Confirm Booking
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
