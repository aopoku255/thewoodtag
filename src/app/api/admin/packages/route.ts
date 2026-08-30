import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async () => {
  const packages = await prisma.studioPackage.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ packages });
});

const schema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  title: z.string().min(1),
  duration: z.string().min(1),
  price: z.string().min(1),
  hourlyLabel: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().min(1),
  imageAlt: z.string().default(""),
  category: z.string().default("Studio"),
  published: z.boolean().default(true),
});

export const POST = withAdmin(async (_admin, request: Request) => {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const existing = await prisma.studioPackage.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A package with that slug already exists." }, { status: 409 });
  }
  const count = await prisma.studioPackage.count();
  const studioPackage = await prisma.studioPackage.create({ data: { ...parsed.data, sortOrder: count } });
  return NextResponse.json({ package: studioPackage }, { status: 201 });
});
