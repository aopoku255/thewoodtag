import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async () => {
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  return NextResponse.json({ settings });
});

const schema = z.object({
  siteName: z.string().min(1),
  siteTagline: z.string().min(1),
  logoWordmark: z.string().min(1),
  faviconEmoji: z.string().min(1),
  primaryEmail: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  businessHours: z.string().min(1),
  whatsappUrl: z.string(),
  copyrightText: z.string().min(1),
  footerQuote: z.string().min(1),
  footerCredit: z.string().min(1),
});

export const PUT = withAdmin(async (_admin, request: Request) => {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });
  return NextResponse.json({ settings });
});
