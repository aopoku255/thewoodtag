import { prisma } from "@/lib/db";
import SeoManager from "@/components/Admin/SeoManager";

export default async function SeoAdminPage() {
  const pages = await prisma.seoSetting.findMany({ orderBy: { page: "asc" } });

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">WEBSITE</div>
          <h1 className="admin-section-title">SEO</h1>
        </div>
      </div>

      <div className="admin-panel">
        <p className="panel-helper">
          Click a page to edit its search and social-sharing metadata.
        </p>
        <SeoManager initial={pages} />
      </div>
    </>
  );
}
