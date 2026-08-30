import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Portal — The Wood Tag" };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
