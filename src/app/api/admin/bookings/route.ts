import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async () => {
  const bookings = await prisma.booking.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json({ bookings });
});
