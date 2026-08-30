import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async () => {
  const categories = await prisma.catalogueCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json({ categories });
});

const schema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  title: z.string().min(1),
  description: z.string().min(1),
  coverImageUrl: z.string().min(1),
  coverImageAlt: z.string().default(""),
  published: z.boolean().default(true),
});

export const POST = withAdmin(async (_admin, request: Request) => {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const existing = await prisma.catalogueCategory.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A category with that slug already exists." }, { status: 409 });
  }
  const count = await prisma.catalogueCategory.count();
  const category = await prisma.catalogueCategory.create({
    data: { ...parsed.data, sortOrder: count },
  });
  return NextResponse.json({ category }, { status: 201 });
});
