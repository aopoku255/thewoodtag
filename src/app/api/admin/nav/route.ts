import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async () => {
  const items = await prisma.navigationItem.findMany({ orderBy: [{ location: "asc" }, { sortOrder: "asc" }] });
  return NextResponse.json({ items });
});

const LOCATIONS = ["header", "footer-explore", "footer-sessions", "footer-legal"] as const;

// Only allow internal paths or a small set of external protocols — an admin
// typing a raw URL should never be able to inject a `javascript:` link.
const urlSchema = z
  .string()
  .min(1)
  .refine(
    (v) => v.startsWith("/") || v.startsWith("#") || /^(https?:|mailto:|tel:)/.test(v),
    "URL must start with /, #, https://, mailto:, or tel:."
  );

const schema = z.object({
  label: z.string().min(1),
  url: urlSchema,
  location: z.enum(LOCATIONS),
  visible: z.boolean().default(true),
});

export const POST = withAdmin(async (_admin, request: Request) => {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const count = await prisma.navigationItem.count({ where: { location: parsed.data.location } });
  const item = await prisma.navigationItem.create({ data: { ...parsed.data, sortOrder: count } });
  return NextResponse.json({ item }, { status: 201 });
});
