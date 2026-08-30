import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(1),
  metaDescription: z.string().min(1),
  ogTitle: z.string().default(""),
  ogDescription: z.string().default(""),
  ogImageUrl: z.string().default(""),
});

export const PUT = withAdmin(
  async (_admin, request: Request, context: { params: Promise<{ page: string }> }) => {
    const { page } = await context.params;
    const json = await request.json().catch(() => null);
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    const setting = await prisma.seoSetting.upsert({
      where: { page },
      update: parsed.data,
      create: { page, ...parsed.data },
    });
    return NextResponse.json({ setting });
  }
);
