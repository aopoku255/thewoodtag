import PasswordForm from "@/components/Admin/PasswordForm";

export default function PasswordAdminPage() {
  return (
    <>
      <div className="admin-section-header">
        <div>
          <div className="section-tag panel-eyebrow">SETTINGS</div>
          <h1 className="admin-section-title">Password</h1>
        </div>
      </div>

      <div className="admin-panel">
        <PasswordForm />
      </div>
    </>
  );
}
