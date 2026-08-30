import Reveal from "@/components/Reveal/Reveal";
import type { LegalSection } from "@/lib/content";

interface LegalPageViewProps {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
}

export default function LegalPageView({ eyebrow, title, description, sections }: LegalPageViewProps) {
  return (
    <div className="page-shell page-shell--narrow">
      <Reveal as="div" className="page-panel">
        <div className="section-tag panel-eyebrow">{eyebrow}</div>
        <h1 className="page-heading">{title}</h1>
        <p className="page-lede">{description}</p>
      </Reveal>

      <Reveal as="div" delay={1} className="page-panel">
        {sections.map((section) => (
          <div key={section.heading} className="legal-section">
            <h3>{section.heading}</h3>
            {section.subsections.map((sub) => (
              <div key={sub.label} className="legal-subsection">
                <h4>{sub.label}</h4>
                <ul>
                  {sub.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </Reveal>
    </div>
  );
}
