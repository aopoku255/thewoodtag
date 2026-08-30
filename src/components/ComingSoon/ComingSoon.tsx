import Link from "next/link";
import Reveal from "@/components/Reveal/Reveal";

interface ComingSoonProps {
  eyebrow: string;
  title: string;
  emphasis: string;
  description: string;
}

export default function ComingSoon({
  eyebrow,
  title,
  emphasis,
  description,
}: ComingSoonProps) {
  return (
    <section className="coming-soon">
      <Reveal as="div" className="section-tag">
        {eyebrow}
      </Reveal>
      <Reveal as="h1" delay={1}>
        {title}
        <br />
        <em>{emphasis}</em>
      </Reveal>
      <Reveal as="p" delay={2} className="coming-soon-copy">
        {description}
      </Reveal>
      <Reveal as="div" delay={3}>
        <Link href="/" className="btn-gold" data-cursor-hover>
          <span>Back To Studio</span>
        </Link>
      </Reveal>
    </section>
  );
}
