export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export const statusLabels: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};
