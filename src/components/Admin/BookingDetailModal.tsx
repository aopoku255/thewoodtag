"use client";

import { useEffect, useState } from "react";
import type { Booking } from "@prisma/client";
import { statusLabels, type BookingStatus } from "@/lib/bookingLabels";

interface Props {
  booking: Booking;
  onClose: () => void;
  onStatusChange: (id: string, status: BookingStatus) => Promise<void>;
}

const STATUS_ACTIONS: { status: BookingStatus; label: string }[] = [
  { status: "confirmed", label: "Mark Confirmed" },
  { status: "completed", label: "Mark Completed" },
  { status: "cancelled", label: "Cancel Booking" },
];

export default function BookingDetailModal({ booking, onClose, onStatusChange }: Props) {
  const [busyStatus, setBusyStatus] = useState<BookingStatus | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleAction = async (status: BookingStatus) => {
    setBusyStatus(status);
    await onStatusChange(booking.id, status);
    setBusyStatus(null);
  };

  return (
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Booking ${booking.reference}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="admin-modal-panel">
        <div className="admin-modal-header-row">
          <div>
            <div className="section-tag panel-eyebrow">{booking.reference}</div>
            <h2 className="panel-subheading" style={{ marginTop: 10 }}>
              {booking.clientName}
            </h2>
          </div>
          <button
            type="button"
            className="admin-modal-close"
            aria-label="Close"
            onClick={onClose}
            data-cursor-hover
          >
            &times;
          </button>
        </div>

        <dl className="lookup-result">
          <div className="lookup-result__row">
            <dt>Email</dt>
            <dd>{booking.email}</dd>
          </div>
          <div className="lookup-result__row">
            <dt>Phone</dt>
            <dd>{booking.phone}</dd>
          </div>
          <div className="lookup-result__row">
            <dt>Package</dt>
            <dd>{booking.packageTitle}</dd>
          </div>
          <div className="lookup-result__row">
            <dt>Date &amp; time</dt>
            <dd>
              {booking.date} &middot; {booking.time}
            </dd>
          </div>
          <div className="lookup-result__row">
            <dt>Total</dt>
            <dd>GHS {booking.total}</dd>
          </div>
          <div className="lookup-result__row">
            <dt>Balance due</dt>
            <dd>GHS {booking.balanceDue}</dd>
          </div>
          <div className="lookup-result__row">
            <dt>Status</dt>
            <dd>
              <span className={`status-pill status-pill--${booking.status}`}>
                {statusLabels[booking.status as BookingStatus]}
              </span>
            </dd>
          </div>
        </dl>

        <div className="admin-section-header__actions" style={{ marginTop: 22 }}>
          {STATUS_ACTIONS.filter((a) => a.status !== booking.status).map((action) => (
            <button
              key={action.status}
              type="button"
              className="btn-outline"
              onClick={() => handleAction(action.status)}
              disabled={busyStatus !== null}
              data-cursor-hover
            >
              {busyStatus === action.status && <span className="btn-spinner" aria-hidden="true" />}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
