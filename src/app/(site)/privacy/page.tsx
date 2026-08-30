import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPageView from "@/components/Legal/LegalPageView";
import { getLegalPage } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage("privacy");
  return { title: page ? `${page.title} — The Wood Tag` : "Privacy Policy — The Wood Tag" };
}

export default async function PrivacyPage() {
  const page = await getLegalPage("privacy");
  if (!page) notFound();

  return (
    <LegalPageView
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      sections={page.sections}
    />
  );
}
