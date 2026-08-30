import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

const schema = z.object({
  imageUrl: z.string().min(1),
  alt: z.string().default(""),
  caption: z.string().default(""),
});

export const POST = withAdmin(async (_admin, request: Request) => {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  await prisma.aboutContent.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  const count = await prisma.aboutGalleryImage.count({ where: { aboutId: 1 } });
  const image = await prisma.aboutGalleryImage.create({
    data: { aboutId: 1, ...parsed.data, sortOrder: count },
  });
  return NextResponse.json({ image }, { status: 201 });
});
