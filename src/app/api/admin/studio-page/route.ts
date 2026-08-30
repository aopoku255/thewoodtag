import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async () => {
  const page = await prisma.studioPageContent.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
    include: { views: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json({ page });
});

const schema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  headingEmphasis: z.string().min(1),
  description: z.string().min(1),
  ctaOutlineLabel: z.string().min(1),
  ctaOutlineUrl: z.string().min(1),
  ctaPrimaryLabel: z.string().min(1),
  ctaPrimaryUrl: z.string().min(1),
});

export const PUT = withAdmin(async (_admin, request: Request) => {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const page = await prisma.studioPageContent.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });
  return NextResponse.json({ page });
});
