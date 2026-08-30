import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async () => {
  const addons = await prisma.studioAddon.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ addons });
});

const schema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  title: z.string().min(1),
  spec: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().min(1),
  imageAlt: z.string().default(""),
  published: z.boolean().default(true),
});

export const POST = withAdmin(async (_admin, request: Request) => {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const existing = await prisma.studioAddon.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "An add-on with that slug already exists." }, { status: 409 });
  }
  const count = await prisma.studioAddon.count();
  const addon = await prisma.studioAddon.create({ data: { ...parsed.data, sortOrder: count } });
  return NextResponse.json({ addon }, { status: 201 });
});
