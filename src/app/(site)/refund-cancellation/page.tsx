import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPageView from "@/components/Legal/LegalPageView";
import { getLegalPage } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage("refund-cancellation");
  return { title: page ? `${page.title} — The Wood Tag` : "Refund & Cancellation — The Wood Tag" };
}

export default async function RefundCancellationPage() {
  const page = await getLegalPage("refund-cancellation");
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
