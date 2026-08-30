import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [
    upcomingCount,
    pendingCount,
    bookings,
    serviceCount,
    packageCount,
    unreadMessageCount,
    recentBookings,
    packages,
  ] = await Promise.all([
    prisma.booking.count({ where: { status: { in: ["pending", "confirmed"] } } }),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.booking.findMany({ where: { status: { not: "cancelled" } } }),
    prisma.service.count({ where: { published: true } }),
    prisma.studioPackage.count({ where: { published: true } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.booking.findMany({ orderBy: { date: "asc" }, take: 5 }),
    prisma.studioPackage.findMany({ orderBy: { sortOrder: "asc" }, take: 4 }),
  ]);

  const revenue = bookings.reduce((sum, b) => sum + b.total, 0);
  const balanceDue = bookings.reduce((sum, b) => sum + b.balanceDue, 0);

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">OVERVIEW</div>
          <h1 className="admin-section-title">Dashboard</h1>
        </div>
        <div className="admin-section-header__actions">
          <Link href="/admin/bookings" className="btn-outline" data-cursor-hover>
            View All Bookings
          </Link>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-eyebrow">Upcoming</div>
          <div className="admin-stat-value">{upcomingCount}</div>
          <div className="admin-stat-helper">Bookings pending or confirmed</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-eyebrow">Awaiting Action</div>
          <div className="admin-stat-value">{pendingCount}</div>
          <div className="admin-stat-helper">New requests need review</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-eyebrow">Unread Messages</div>
          <div className="admin-stat-value">{unreadMessageCount}</div>
          <div className="admin-stat-helper">Contact enquiries awaiting reply</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-eyebrow">Balance Due</div>
          <div className="admin-stat-value">GHS {balanceDue}</div>
          <div className="admin-stat-helper">Outstanding across all bookings</div>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-eyebrow">Booked Revenue</div>
          <div className="admin-stat-value">GHS {revenue}</div>
          <div className="admin-stat-helper">Excludes cancelled sessions</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-eyebrow">Published Services</div>
          <div className="admin-stat-value">{serviceCount}</div>
          <div className="admin-stat-helper">Visible on the public Services page</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-eyebrow">Bookable Packages</div>
          <div className="admin-stat-value">{packageCount}</div>
          <div className="admin-stat-helper">Visible on the public Studio page</div>
        </div>
      </div>

      <div className="admin-dashboard-split">
        <div className="admin-panel">
          <h2 className="admin-subsection-title">Upcoming Sessions</h2>
          <div className="admin-record-table-scroll">
            <table className="admin-record-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Package</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ color: "var(--text-muted)" }}>
                      No bookings yet.
                    </td>
                  </tr>
                )}
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.clientName}</td>
                    <td>{booking.packageTitle}</td>
                    <td>
                      <span className={`status-pill status-pill--${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel">
          <h2 className="admin-subsection-title">Package Snapshot</h2>
          <div className="admin-package-list">
            {packages.length === 0 && <p className="admin-empty-state">No packages yet.</p>}
            {packages.map((pkg) => (
              <div key={pkg.id} className="admin-package-row">
                <div className="admin-package-row__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pkg.imageUrl} alt={pkg.imageAlt} />
                </div>
                <div>
                  <div className="admin-package-row__title">{pkg.title}</div>
                  <div className="admin-package-row__meta">{pkg.duration}</div>
                </div>
                <div className="admin-package-row__price">{pkg.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
