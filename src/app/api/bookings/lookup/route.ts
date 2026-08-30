import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref")?.trim();
  if (!ref) {
    return NextResponse.json({ error: "Provide a booking reference." }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { reference: ref.toUpperCase() },
  });

  if (!booking) {
    return NextResponse.json({ error: "No booking found for that reference." }, { status: 404 });
  }

  return NextResponse.json({ booking });
}
