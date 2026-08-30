import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async () => {
  const links = await prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ links });
});

const ICONS = ["camera", "play", "linkedin", "sparkle"] as const;

const schema = z.object({
  platform: z.string().min(1),
  url: z.string().min(1),
  icon: z.enum(ICONS).default("camera"),
  visible: z.boolean().default(true),
});

export const POST = withAdmin(async (_admin, request: Request) => {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const count = await prisma.socialLink.count();
  const link = await prisma.socialLink.create({ data: { ...parsed.data, sortOrder: count } });
  return NextResponse.json({ link }, { status: 201 });
});
