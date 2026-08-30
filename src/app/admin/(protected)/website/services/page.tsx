import { prisma } from "@/lib/db";
import ServicesManager from "@/components/Admin/ServicesManager";

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">WEBSITE</div>
          <h1 className="admin-section-title">Services</h1>
        </div>
      </div>

      <div className="admin-panel">
        <p className="panel-helper">
          These appear as the &ldquo;Our Craft&rdquo; grid on the public
          Services page, in the order shown below.
        </p>
        <ServicesManager initial={services} />
      </div>
    </>
  );
}
