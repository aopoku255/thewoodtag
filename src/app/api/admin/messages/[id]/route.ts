import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

const schema = z.object({ read: z.boolean() });

export const PATCH = withAdmin(
  async (_admin, request: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const json = await request.json().catch(() => null);
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    const message = await prisma.contactMessage.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ message });
  }
);

export const DELETE = withAdmin(
  async (_admin, _request: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
);
