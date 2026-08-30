import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

const bulletSection = z.object({
  heading: z.string().min(1),
  subsections: z.array(
    z.object({
      label: z.string().min(1),
      bullets: z.array(z.string().min(1)),
    })
  ),
});

const schema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  sections: z.array(bulletSection),
});

export const GET = withAdmin(
  async (_admin, _request: Request, context: { params: Promise<{ slug: string }> }) => {
    const { slug } = await context.params;
    const page = await prisma.legalPage.findUnique({ where: { slug } });
    if (!page) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ page: { ...page, sections: JSON.parse(page.sectionsJson) } });
  }
);

export const PUT = withAdmin(
  async (_admin, request: Request, context: { params: Promise<{ slug: string }> }) => {
    const { slug } = await context.params;
    const json = await request.json().catch(() => null);
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    const { sections, ...rest } = parsed.data;
    const page = await prisma.legalPage.upsert({
      where: { slug },
      update: { ...rest, sectionsJson: JSON.stringify(sections) },
      create: { slug, ...rest, sectionsJson: JSON.stringify(sections) },
    });
    return NextResponse.json({ page: { ...page, sections } });
  }
);
