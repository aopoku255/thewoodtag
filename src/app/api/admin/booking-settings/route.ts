import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async () => {
  const settings = await prisma.bookingSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  return NextResponse.json({ settings });
});

const csvSchema = z.string().min(1);

const schema = z.object({
  openDays: csvSchema, // "0,1,2,3,4,5,6"
  timeSlots: csvSchema, // "9:00 AM,11:00 AM,..."
  minNoticeHours: z.number().int().min(0),
  maxAdvanceDays: z.number().int().min(1),
  confirmationMessage: z.string().min(1),
  cancellationMessage: z.string().min(1),
  lookupHeading: z.string().min(1),
  lookupDescription: z.string().min(1),
  addOns: csvSchema, // "Name:price,Name:price"
});

export const PUT = withAdmin(async (_admin, request: Request) => {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const settings = await prisma.bookingSettings.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });
  return NextResponse.json({ settings });
});
