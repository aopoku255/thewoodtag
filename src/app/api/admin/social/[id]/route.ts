import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

const ICONS = ["camera", "play", "linkedin", "sparkle"] as const;

const schema = z.object({
  platform: z.string().min(1).optional(),
  url: z.string().min(1).optional(),
  icon: z.enum(ICONS).optional(),
  visible: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const PATCH = withAdmin(
  async (_admin, request: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const json = await request.json().catch(() => null);
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    const link = await prisma.socialLink.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ link });
  }
);

export const DELETE = withAdmin(
  async (_admin, _request: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    await prisma.socialLink.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
);
