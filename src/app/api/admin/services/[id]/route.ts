import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

const schema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only.")
    .optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  imageUrl: z.string().min(1).optional(),
  imageAlt: z.string().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
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
    if (parsed.data.slug) {
      const existing = await prisma.service.findUnique({ where: { slug: parsed.data.slug } });
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: "A service with that slug already exists." }, { status: 409 });
      }
    }
    const service = await prisma.service.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ service });
  }
);

export const DELETE = withAdmin(
  async (_admin, _request: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
);
