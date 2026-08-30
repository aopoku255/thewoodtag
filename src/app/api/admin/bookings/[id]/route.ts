import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

const schema = z.object({
  status: z.enum(STATUSES).optional(),
  balanceDue: z.number().int().min(0).optional(),
});

export const PATCH = withAdmin(
  async (_admin, request: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const json = await request.json().catch(() => null);
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    const booking = await prisma.booking.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ booking });
  }
);

export const DELETE = withAdmin(
  async (_admin, _request: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
);
