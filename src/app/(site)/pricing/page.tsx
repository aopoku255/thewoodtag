import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal/Reveal";
import { getPublishedPackages, getSeoSetting } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("pricing");
  return { title: seo.title, description: seo.metaDescription };
}

export default async function PricingPage() {
  const packages = await getPublishedPackages();

  return (
    <div className="page-shell">
      <Reveal as="div" className="page-panel">
        <div className="section-tag panel-eyebrow">PACKAGES</div>
        <h1 className="page-heading">
          Package, <em>Price</em> and Description
        </h1>
        <p className="page-lede">
          Studio session pricing at a glance. For weddings, editorial, and
          other custom sessions, share your vision through{" "}
          <Link href="/contact" className="link-gold" data-cursor-hover>
            the contact form
          </Link>{" "}
          for a tailored quote.
        </p>
      </Reveal>

      <Reveal as="div" delay={1} className="page-panel">
        <div className="package-grid">
          {packages.map((pkg) => (
            <div key={pkg.slug} className="package-card">
              <div className="package-card__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pkg.imageUrl} alt={pkg.imageAlt || pkg.title} />
              </div>
              <div className="package-card__body">
                <div className="form-label">{pkg.category}</div>
                <h2 className="package-card__title">{pkg.title}</h2>
                <div className="package-card__meta">
                  {pkg.duration} &middot; {pkg.price} &middot; {pkg.hourlyLabel}
                </div>
                <p className="package-card__desc">{pkg.description}</p>
                <Link
                  href={`/booking/new?package=${pkg.slug}`}
                  className="btn-gold"
                  data-cursor-hover
                >
                  <span>Book This Package</span>
                </Link>
              </div>
            </div>
          ))}
          {packages.length === 0 && (
            <p style={{ color: "var(--text-muted)" }}>No packages published yet.</p>
          )}
        </div>
      </Reveal>
    </div>
  );
}
