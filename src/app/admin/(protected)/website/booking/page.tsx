import { prisma } from "@/lib/db";
import BookingSettingsForm from "@/components/Admin/BookingSettingsForm";

export default async function BookingAdminPage() {
  const settings = await prisma.bookingSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">WEBSITE</div>
          <h1 className="admin-section-title">Booking</h1>
        </div>
      </div>

      <div className="admin-panel">
        <p className="panel-helper">
          Controls availability, add-ons, and messaging across the public
          booking flow and the &ldquo;My Booking&rdquo; lookup page.
        </p>
        <BookingSettingsForm initial={settings} />
      </div>
    </>
  );
}
