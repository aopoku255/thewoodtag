import { getCurrentAdmin } from "@/lib/auth";
import ProfileForm from "@/components/Admin/ProfileForm";

export default async function ProfileAdminPage() {
  const admin = await getCurrentAdmin();

  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">SETTINGS</div>
          <h1 className="admin-section-title">Admin Profile</h1>
        </div>
      </div>

      <div className="admin-panel">
        <ProfileForm initial={{ name: admin!.name, email: admin!.email }} />
      </div>
    </>
  );
}
