import Reveal from "@/components/Reveal/Reveal";
import GalleryFrame from "@/components/Gallery/GalleryFrame";

interface AboutSectionProps {
  eyebrow: string;
  headingLine: string;
  headingEmphasis: string;
  headingLast: string;
  paragraph1: string;
  paragraph2: string;
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  ctaLinkLabel: string;
  ctaLinkUrl: string;
  ctaOutlineLabel: string;
  ctaOutlineUrl: string;
  galleryImages: { imageUrl: string; alt: string; caption: string }[];
}

export default function AboutSection({
  eyebrow,
  headingLine,
  headingEmphasis,
  headingLast,
  paragraph1,
  paragraph2,
  ctaPrimaryLabel,
  ctaPrimaryUrl,
  ctaLinkLabel,
  ctaLinkUrl,
  ctaOutlineLabel,
  ctaOutlineUrl,
  galleryImages,
}: AboutSectionProps) {
  const items = galleryImages.map((img) => ({ src: img.imageUrl, alt: img.alt, caption: img.caption }));

  return (
    <section className="about-section" id="about">
      <Reveal as="div" className="section-tag">
        {eyebrow}
      </Reveal>

      <div className="about-section-layout">
        <div className="about-section-copy">
          <Reveal as="h2" className="about-section-heading">
            {headingLine}
            <br />
            <em>{headingEmphasis}</em>
            <br />
            <strong className="about-section-heading-last">{headingLast}</strong>
          </Reveal>

          <Reveal as="p" delay={1} className="about-section-prose">
            {paragraph1}
          </Reveal>

          <Reveal as="p" delay={2} className="about-section-prose">
            {paragraph2}
          </Reveal>

          <Reveal as="div" delay={4} className="about-section-cta">
            <a href={ctaPrimaryUrl} className="btn-gold" data-cursor-hover>
              <span>{ctaPrimaryLabel}</span>
            </a>
            <a href={ctaLinkUrl} className="link-gold" data-cursor-hover>
              {ctaLinkLabel}
            </a>
            <a href={ctaOutlineUrl} className="btn-outline" data-cursor-hover>
              {ctaOutlineLabel}
            </a>
          </Reveal>
        </div>

        <Reveal as="div" delay={2}>
          {items.length > 0 && (
            <GalleryFrame items={items} tag="ABOUT GALLERY" autoRotateMs={4200} />
          )}
        </Reveal>
      </div>
    </section>
  );
}
