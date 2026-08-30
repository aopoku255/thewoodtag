import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async () => {
  const hero = await prisma.heroContent.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
    include: { slides: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json({ hero });
});

const schema = z.object({
  eyebrow: z.string().min(1),
  headingLine: z.string().min(1),
  headingEmphasis: z.string().min(1),
  description: z.string().min(1),
  ctaLabel: z.string().min(1),
  ctaSubLabel: z.string().min(1),
  ctaUrl: z.string().min(1),
  stat1Number: z.string().min(1),
  stat1Suffix: z.string(),
  stat1Label: z.string().min(1),
  stat2Number: z.string().min(1),
  stat2Suffix: z.string(),
  stat2Label: z.string().min(1),
});

export const PUT = withAdmin(async (_admin, request: Request) => {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const hero = await prisma.heroContent.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });
  return NextResponse.json({ hero });
});
