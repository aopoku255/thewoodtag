import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

const schema = z.object({
  imageUrl: z.string().min(1).optional(),
  alt: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const PATCH = withAdmin(
  async (_admin, request: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const json = await request.json().catch(() => null);
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    const image = await prisma.catalogueImage.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ image });
  }
);

export const DELETE = withAdmin(
  async (_admin, _request: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    await prisma.catalogueImage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
);
