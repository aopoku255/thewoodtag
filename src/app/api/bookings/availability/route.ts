import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "Provide a date." }, { status: 400 });
  }

  const bookings = await prisma.booking.findMany({
    where: { date, status: { not: "cancelled" } },
    select: { time: true },
  });

  return NextResponse.json({ takenSlots: bookings.map((b) => b.time) });
}
