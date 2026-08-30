import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

const LOCATIONS = ["header", "footer-explore", "footer-sessions", "footer-legal"] as const;

const urlSchema = z
  .string()
  .min(1)
  .refine(
    (v) => v.startsWith("/") || v.startsWith("#") || /^(https?:|mailto:|tel:)/.test(v),
    "URL must start with /, #, https://, mailto:, or tel:."
  );

const schema = z.object({
  label: z.string().min(1).optional(),
  url: urlSchema.optional(),
  location: z.enum(LOCATIONS).optional(),
  visible: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const PATCH = withAdmin(
  async (_admin, request: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const json = await request.json().catch(() => null);
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    const item = await prisma.navigationItem.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ item });
  }
);

export const DELETE = withAdmin(
  async (_admin, _request: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    await prisma.navigationItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
);
