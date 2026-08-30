import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  packageSlug: z.string().min(1),
  date: z.string().min(1), // yyyy-mm-dd
  time: z.string().min(1),
  addOnNames: z.array(z.string()).default([]),
});

function parsePrice(price: string): number {
  const digits = price.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." },
      { status: 400 }
    );
  }

  const { firstName, lastName, email, phone, packageSlug, date, time, addOnNames } = parsed.data;

  const studioPackage = await prisma.studioPackage.findUnique({ where: { slug: packageSlug } });
  if (!studioPackage || !studioPackage.published) {
    return NextResponse.json({ error: "That package is no longer available." }, { status: 404 });
  }

  const bookingSettings = await prisma.bookingSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  const addOnCatalog = new Map(
    bookingSettings.addOns
      .split(",")
      .map((entry) => entry.split(":"))
      .filter((pair) => pair.length === 2)
      .map(([name, price]) => [name.trim(), parseInt(price, 10) || 0])
  );
  const addOnsTotal = addOnNames.reduce((sum, name) => sum + (addOnCatalog.get(name) ?? 0), 0);
  const total = parsePrice(studioPackage.price) + addOnsTotal;

  const reference = `WOODTAG-${studioPackage.slug.slice(0, 3).toUpperCase()}-${randomInt(1000, 9999)}`;

  const booking = await prisma.booking.create({
    data: {
      reference,
      clientName: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      packageTitle: studioPackage.title,
      date,
      time,
      status: "pending",
      total,
      balanceDue: total,
    },
  });

  return NextResponse.json(
    {
      reference: booking.reference,
      confirmationMessage: bookingSettings.confirmationMessage
        .replace("{email}", email)
        .replace("{reference}", booking.reference),
    },
    { status: 201 }
  );
}
