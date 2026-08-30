import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { withAdmin } from "@/lib/auth";

const schema = z.object({
  categoryId: z.string().min(1),
  imageUrl: z.string().min(1),
  alt: z.string().default(""),
});

export const POST = withAdmin(async (_admin, request: Request) => {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const category = await prisma.catalogueCategory.findUnique({ where: { id: parsed.data.categoryId } });
  if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });

  const count = await prisma.catalogueImage.count({ where: { categoryId: parsed.data.categoryId } });
  const image = await prisma.catalogueImage.create({
    data: {
      categoryId: parsed.data.categoryId,
      imageUrl: parsed.data.imageUrl,
      alt: parsed.data.alt,
      sortOrder: count,
    },
  });
  return NextResponse.json({ image }, { status: 201 });
});
