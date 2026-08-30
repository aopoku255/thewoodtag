import { prisma } from "@/lib/db";
import GeneralSettingsForm from "@/components/Admin/GeneralSettingsForm";
import SocialLinksManager from "@/components/Admin/SocialLinksManager";

export default async function GeneralSettingsPage() {
  const [settings, socialLinks] = await Promise.all([
    prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">WEBSITE</div>
          <h1 className="admin-section-title">General Settings</h1>
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <p className="panel-helper">
          Site name, contact details, business hours, and footer text used
          across the public website.
        </p>
        <GeneralSettingsForm initial={settings} />
      </div>

      <div className="admin-panel">
        <h2 className="admin-subsection-title">Social Links</h2>
        <SocialLinksManager initial={socialLinks} />
      </div>
    </>
  );
}
