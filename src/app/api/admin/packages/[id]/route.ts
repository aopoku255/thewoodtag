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
  duration: z.string().min(1).optional(),
  price: z.string().min(1).optional(),
  hourlyLabel: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  imageUrl: z.string().min(1).optional(),
  imageAlt: z.string().optional(),
  category: z.string().optional(),
  published: z.boolean().optional(),
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
      const existing = await prisma.studioPackage.findUnique({ where: { slug: parsed.data.slug } });
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: "A package with that slug already exists." }, { status: 409 });
      }
    }
    const studioPackage = await prisma.studioPackage.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ package: studioPackage });
  }
);

export const DELETE = withAdmin(
  async (_admin, _request: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    await prisma.studioPackage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
);
