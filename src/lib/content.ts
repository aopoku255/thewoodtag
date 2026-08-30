import { prisma } from "@/lib/db";

/**
 * Server-only content-fetching layer. Every public page reads through here
 * instead of touching Prisma directly, so there is exactly one place that
 * knows the shape of "site content" and one place to change if the schema
 * moves. All functions read live data — pages that call these must opt out
 * of static rendering (see `export const dynamic = "force-dynamic"` at the
 * top of each page) or admin edits would never show up on the public site.
 */

export async function getSiteSettings() {
  return prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
}

export async function getSocialLinks() {
  return prisma.socialLink.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } });
}

export async function getNavItems(location: "header" | "footer-explore" | "footer-sessions" | "footer-legal") {
  return prisma.navigationItem.findMany({
    where: { location, visible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getHeroContent() {
  return prisma.heroContent.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
    include: { slides: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getAboutContent() {
  return prisma.aboutContent.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
    include: { galleryImages: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getPublishedServices() {
  return prisma.service.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
}

export async function getPublishedCatalogueCategories() {
  return prisma.catalogueCategory.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getPublishedPackages() {
  return prisma.studioPackage.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
}

export async function getPackageBySlug(slug: string) {
  return prisma.studioPackage.findUnique({ where: { slug } });
}

export async function getStudioPageContent() {
  return prisma.studioPageContent.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
    include: { views: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getPublishedAddons() {
  return prisma.studioAddon.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
}

export async function getContactPageContent() {
  return prisma.contactPageContent.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
}

export async function getBookingSettings() {
  return prisma.bookingSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
}

export interface LegalSection {
  heading: string;
  subsections: { label: string; bullets: string[] }[];
}

export async function getLegalPage(slug: string) {
  const page = await prisma.legalPage.findUnique({ where: { slug } });
  if (!page) return null;
  return { ...page, sections: JSON.parse(page.sectionsJson) as LegalSection[] };
}

const SEO_FALLBACK = {
  title: "The Wood Tag — Photography Studio",
  metaDescription: "Where light becomes story.",
};

export async function getSeoSetting(page: string) {
  const setting = await prisma.seoSetting.findUnique({ where: { page } });
  if (!setting) return SEO_FALLBACK;
  return setting;
}

/** Parses BookingSettings.addOns ("Name:price,Name:price") into a typed list. */
export function parseAddOnCatalog(csv: string): { name: string; price: number }[] {
  return csv
    .split(",")
    .map((entry) => entry.split(":"))
    .filter((pair) => pair.length === 2)
    .map(([name, price]) => ({ name: name.trim(), price: parseInt(price, 10) || 0 }));
}

/** Parses BookingSettings.openDays ("1,2,3,4,5,6") into a Set of day-of-week numbers (0=Sun). */
export function parseOpenDays(csv: string): Set<number> {
  return new Set(csv.split(",").map((d) => parseInt(d.trim(), 10)).filter((n) => !Number.isNaN(n)));
}
