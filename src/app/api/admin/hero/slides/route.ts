import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

const schema = z.object({
  imageUrl: z.string().min(1),
  alt: z.string().default(""),
});

export const POST = withAdmin(async (_admin, request: Request) => {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  await prisma.heroContent.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  const count = await prisma.heroSlide.count({ where: { heroId: 1 } });
  const slide = await prisma.heroSlide.create({
    data: { heroId: 1, imageUrl: parsed.data.imageUrl, alt: parsed.data.alt, sortOrder: count },
  });
  return NextResponse.json({ slide }, { status: 201 });
});
