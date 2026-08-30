"use client";

import { useMemo, useState } from "react";
import type { Booking } from "@prisma/client";
import { statusLabels, type BookingStatus } from "@/lib/bookingLabels";
import BookingDetailModal from "./BookingDetailModal";

const STATUS_FILTERS: { key: "all" | BookingStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildMonthCells(bookings: Booking[], year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay();

  const countsByDay = new Map<number, number>();
  bookings.forEach((b) => {
    const d = new Date(b.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      countsByDay.set(d.getDate(), (countsByDay.get(d.getDate()) ?? 0) + 1);
    }
  });

  const cells: { day: number | null; count: number }[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push({ day: null, count: 0 });
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, count: countsByDay.get(day) ?? 0 });
  }
  return cells;
}

export default function BookingsManager({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [view, setView] = useState<"table" | "calendar">("table");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        b.clientName.toLowerCase().includes(q) ||
        b.reference.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  const now = useMemo(() => new Date(), []);
  const monthCells = useMemo(
    () => buildMonthCells(bookings, now.getFullYear(), now.getMonth()),
    [bookings, now]
  );
  const selected = bookings.find((b) => b.id === selectedId) ?? null;

  const updateStatus = async (id: string, status: BookingStatus) => {
    setError("");
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setError("Could not update booking status.");
      return;
    }
    const data = await res.json();
    setBookings((prev) => prev.map((b) => (b.id === id ? data.booking : b)));
    setSelectedId(null);
  };

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">SESSIONS</div>
          <h1 className="admin-section-title">Bookings</h1>
        </div>
        <div className="admin-section-header__actions">
          <button
            type="button"
            className={`admin-filter-chip${view === "table" ? " is-active" : ""}`}
            onClick={() => setView("table")}
            data-cursor-hover
          >
            Table
          </button>
          <button
            type="button"
            className={`admin-filter-chip${view === "calendar" ? " is-active" : ""}`}
            onClick={() => setView("calendar")}
            data-cursor-hover
          >
            Calendar
          </button>
        </div>
      </div>

      {error && (
        <div className="form-status-banner form-status-banner--error" role="alert">
          {error}
        </div>
      )}

      <div className="admin-panel">
        <div className="admin-filter-toolbar">
          <input
            className="form-input"
            type="text"
            placeholder="Search by client, reference, or email&hellip;"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="admin-filter-toolbar__actions">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`admin-filter-chip${statusFilter === f.key ? " is-active" : ""}`}
                onClick={() => setStatusFilter(f.key)}
                data-cursor-hover
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {bookings.length === 0 ? (
          <p className="admin-empty-state">
            No bookings yet. They&apos;ll appear here as clients book sessions from the
            public Studio page.
          </p>
        ) : view === "table" ? (
          <div className="admin-record-table-scroll">
            <table className="admin-record-table admin-record-table--wide">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Client</th>
                  <th>Package</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Balance</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.reference}</td>
                    <td>{booking.clientName}</td>
                    <td>{booking.packageTitle}</td>
                    <td>
                      {booking.date} &middot; {booking.time}
                    </td>
                    <td>
                      <span className={`status-pill status-pill--${booking.status}`}>
                        {statusLabels[booking.status as BookingStatus]}
                      </span>
                    </td>
                    <td>GHS {booking.balanceDue}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-row-action"
                        onClick={() => setSelectedId(booking.id)}
                        data-cursor-hover
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ color: "var(--text-muted)" }}>
                      No bookings match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-bookings-month-shell">
            <div className="admin-bookings-month">
              {WEEKDAYS.map((dow) => (
                <div key={dow} className="admin-bookings-month-weekday">
                  {dow}
                </div>
              ))}
              {monthCells.map((cell, i) => (
                <div
                  key={i}
                  className={`admin-bookings-month-cell${cell.day === null ? " is-empty" : ""}`}
                >
                  {cell.day !== null && (
                    <>
                      <span className="admin-bookings-month-cell__date">{cell.day}</span>
                      {cell.count > 0 && (
                        <span className="admin-bookings-month-cell__dot">
                          {cell.count} booking{cell.count > 1 ? "s" : ""}
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <BookingDetailModal
          booking={selected}
          onClose={() => setSelectedId(null)}
          onStatusChange={updateStatus}
        />
      )}
    </>
  );
}
