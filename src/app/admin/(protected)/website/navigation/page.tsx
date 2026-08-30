import { prisma } from "@/lib/db";
import NavigationManager from "@/components/Admin/NavigationManager";

export default async function NavigationAdminPage() {
  const items = await prisma.navigationItem.findMany({ orderBy: [{ location: "asc" }, { sortOrder: "asc" }] });

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">WEBSITE</div>
          <h1 className="admin-section-title">Navigation</h1>
        </div>
      </div>
      <NavigationManager initial={items} />
    </>
  );
}
