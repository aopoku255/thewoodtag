import { prisma } from "@/lib/db";
import BookingsManager from "@/components/Admin/BookingsManager";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({ orderBy: { date: "asc" } });
  return <BookingsManager initialBookings={bookings} />;
}
