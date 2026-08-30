import type { Metadata } from "next";
import HeroSection from "@/components/Hero/HeroSection";
import AboutSection from "@/components/About/AboutSection";
import { getHeroContent, getAboutContent, getSiteSettings, getSeoSetting } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSetting("home");
  return { title: seo.title, description: seo.metaDescription };
}

export default async function Home() {
  const [hero, about, settings] = await Promise.all([
    getHeroContent(),
    getAboutContent(),
    getSiteSettings(),
  ]);

  return (
    <>
      <HeroSection
        eyebrow={hero.eyebrow}
        headingLine={hero.headingLine}
        headingEmphasis={hero.headingEmphasis}
        description={hero.description}
        ctaLabel={hero.ctaLabel}
        ctaSubLabel={hero.ctaSubLabel}
        ctaUrl={hero.ctaUrl}
        stat1Number={hero.stat1Number}
        stat1Suffix={hero.stat1Suffix}
        stat1Label={hero.stat1Label}
        stat2Number={hero.stat2Number}
        stat2Suffix={hero.stat2Suffix}
        stat2Label={hero.stat2Label}
        logoWordmark={settings.logoWordmark}
        slides={hero.slides.map((s) => ({ imageUrl: s.imageUrl, alt: s.alt }))}
      />
      <AboutSection
        eyebrow={about.eyebrow}
        headingLine={about.headingLine}
        headingEmphasis={about.headingEmphasis}
        headingLast={about.headingLast}
        paragraph1={about.paragraph1}
        paragraph2={about.paragraph2}
        ctaPrimaryLabel={about.ctaPrimaryLabel}
        ctaPrimaryUrl={about.ctaPrimaryUrl}
        ctaLinkLabel={about.ctaLinkLabel}
        ctaLinkUrl={about.ctaLinkUrl}
        ctaOutlineLabel={about.ctaOutlineLabel}
        ctaOutlineUrl={about.ctaOutlineUrl}
        galleryImages={about.galleryImages}
      />
    </>
  );
}
