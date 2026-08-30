import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal/Reveal";
import GalleryFrame from "@/components/Gallery/GalleryFrame";
import { getStudioPageContent, getPublishedAddons, getSeoSetting } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("about");
  return { title: seo.title, description: seo.metaDescription };
}

export default async function AboutPage() {
  const [page, addons] = await Promise.all([getStudioPageContent(), getPublishedAddons()]);
  const views = page.views.map((v) => ({ src: v.imageUrl, alt: v.alt, caption: v.caption }));

  return (
    <section className="about-section">
      <div className="about-section-layout">
        <div className="about-section-copy">
          <Reveal as="div" className="section-tag">
            {page.eyebrow}
          </Reveal>

          <Reveal as="h1" delay={1} className="about-section-heading">
            {page.heading} <em>{page.headingEmphasis}</em>
          </Reveal>

          <Reveal as="p" delay={2} className="about-section-prose">
            {page.description}
          </Reveal>

          <Reveal as="div" delay={4} className="about-section-cta">
            <Link href={page.ctaOutlineUrl} className="btn-outline" data-cursor-hover>
              {page.ctaOutlineLabel}
            </Link>
            <Link href={page.ctaPrimaryUrl} className="btn-gold" data-cursor-hover>
              <span>{page.ctaPrimaryLabel}</span>
            </Link>
          </Reveal>
        </div>

        <Reveal as="div" delay={2}>
          {views.length > 0 && <GalleryFrame items={views} tag="STUDIO VIEW" autoRotateMs={4000} />}
        </Reveal>
      </div>

      <div className="addon-showcase-grid">
        {addons.map((addon, i) => (
          <Reveal
            as="div"
            key={addon.id}
            delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
            className="addon-showcase-card"
          >
            <div className="addon-showcase-card__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={addon.imageUrl} alt={addon.imageAlt} />
              <span className="addon-showcase-card__tag">
                <span className="addon-showcase-card__tag-label">STUDIO VIEW</span>
                <span className="addon-showcase-card__tag-title">{addon.title}</span>
              </span>
            </div>
            <h2 className="addon-showcase-card__title">{addon.title}</h2>
            <div className="addon-showcase-card__spec">{addon.spec}</div>
            <p className="addon-showcase-card__desc">{addon.description}</p>
            <Link href="/studio" className="btn-gold" data-cursor-hover>
              <span>Book Now</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
