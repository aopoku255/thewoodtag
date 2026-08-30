import type { Metadata } from "next";
import Reveal from "@/components/Reveal/Reveal";
import PackageGrid from "@/components/Studio/PackageGrid";
import { getPublishedPackages, getSeoSetting } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("studio");
  return { title: seo.title, description: seo.metaDescription };
}

export default async function StudioPage() {
  const packages = await getPublishedPackages();

  return (
    <div className="page-shell">
      <Reveal as="div" className="page-panel">
        <div className="section-tag panel-eyebrow">STUDIO</div>
        <h1 className="page-heading">Book the studio by package.</h1>
        <p className="page-lede">
          Browse live studio packages below, then open the booking flow to
          pick a date, an available slot, add-ons, and your contact details.
        </p>
      </Reveal>

      <Reveal as="div" delay={1} className="page-panel">
        <PackageGrid packages={packages} />
      </Reveal>
    </div>
  );
}
