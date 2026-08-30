import { prisma } from "@/lib/db";
import LegalPagesManager from "@/components/Admin/LegalPagesManager";
import type { LegalSection } from "@/lib/content";

const LABELS: Record<string, string> = {
  privacy: "Privacy Policy",
  "refund-cancellation": "Refund & Cancellation",
  "portrait-terms": "Portrait Sessions Terms",
};

export default async function LegalAdminPage() {
  const pages = await prisma.legalPage.findMany();
  const view = pages.map((p) => ({
    slug: p.slug,
    label: LABELS[p.slug] ?? p.slug,
    eyebrow: p.eyebrow,
    title: p.title,
    description: p.description,
    sections: JSON.parse(p.sectionsJson) as LegalSection[],
  }));

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">WEBSITE</div>
          <h1 className="admin-section-title">Legal Pages</h1>
        </div>
      </div>

      <div className="admin-panel">
        <p className="panel-helper">
          Privacy, refund, and terms pages. Sections are edited as structured
          JSON to keep formatting consistent — see the hint under each field.
        </p>
        <LegalPagesManager initial={view} />
      </div>
    </>
  );
}
