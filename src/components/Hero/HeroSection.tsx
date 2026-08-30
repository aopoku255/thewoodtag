"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal/Reveal";

const AUTO_ROTATE_MS = 5500;

interface HeroSlideData {
  imageUrl: string;
  alt: string;
}

interface HeroSectionProps {
  eyebrow: string;
  headingLine: string;
  headingEmphasis: string;
  description: string;
  ctaLabel: string;
  ctaSubLabel: string;
  ctaUrl: string;
  stat1Number: string;
  stat1Suffix: string;
  stat1Label: string;
  stat2Number: string;
  stat2Suffix: string;
  stat2Label: string;
  logoWordmark: string;
  slides: HeroSlideData[];
}

export default function HeroSection({
  eyebrow,
  headingLine,
  headingEmphasis,
  description,
  ctaLabel,
  ctaSubLabel,
  ctaUrl,
  stat1Number,
  stat1Suffix,
  stat1Label,
  stat2Number,
  stat2Suffix,
  stat2Label,
  logoWordmark,
  slides,
}: HeroSectionProps) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideCount = slides.length || 1;

  useEffect(() => {
    if (slideCount <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % slideCount);
    }, AUTO_ROTATE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slideCount]);

  const goTo = (index: number) => {
    setActive(index);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % slideCount);
    }, AUTO_ROTATE_MS);
  };

  return (
    <section className="hero-section">
      <div className="hero-bg-layer">
        {slides.map((slide, i) => (
          <div
            key={slide.imageUrl + i}
            className={`hero-bg-slide${i === active ? " is-active" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.imageUrl} alt={slide.alt} />
          </div>
        ))}
      </div>

      <div className="hero-theme-gradient" aria-hidden="true" />

      <div className="hero-deco-layer" aria-hidden="true">
        <div className="hero-deco-frame hero-deco-frame--back">
          {slides.map((slide, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={slide.imageUrl + i}
              src={slide.imageUrl}
              alt=""
              className={i === active ? "is-active" : ""}
            />
          ))}
        </div>
        <div className="hero-deco-frame hero-deco-frame--front">
          {slides.map((slide, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={slide.imageUrl + i}
              src={slide.imageUrl}
              alt=""
              className={i === active ? "is-active" : ""}
            />
          ))}
          <span className="hero-deco-frame__tag">{logoWordmark} STUDIO</span>
        </div>
      </div>

      <div className="hero-content">
        <Reveal as="div" className="hero-eyebrow section-tag">
          {eyebrow}
        </Reveal>

        <Reveal as="h1" delay={1}>
          {headingLine}
          <br />
          <em>{headingEmphasis}</em>
        </Reveal>

        <Reveal as="div" delay={2}>
          <p>{description}</p>
        </Reveal>

        <Reveal as="div" delay={3}>
          <a href={ctaUrl} className="btn-gold" data-cursor-hover>
            <span>
              {ctaLabel}
              <br />
              {ctaSubLabel}
            </span>
          </a>
        </Reveal>

        <Reveal as="div" delay={3} className="stats-duo">
          <div className="stats-duo__item">
            <span className="stats-duo__index">01</span>
            <span className="stats-duo__figure">
              <span className="stats-duo__number">{stat1Number}</span>
              <span className="stats-duo__suffix">{stat1Suffix}</span>
            </span>
            <span className="stats-duo__label">{stat1Label}</span>
          </div>
          <span className="stats-duo__divider" />
          <div className="stats-duo__item">
            <span className="stats-duo__index">02</span>
            <span className="stats-duo__figure">
              <span className="stats-duo__number">{stat2Number}</span>
              <span className="stats-duo__suffix">{stat2Suffix}</span>
            </span>
            <span className="stats-duo__label">{stat2Label}</span>
          </div>
        </Reveal>
      </div>

      <div className="hero-controls">
        <div className="hero-scroll-indicator">
          <span className="hero-scroll-indicator__line" />
          SCROLL
        </div>

        <div className="hero-carousel-dots">
          {slides.map((slide, i) => (
            <button
              key={slide.imageUrl + i}
              type="button"
              className={`hero-carousel-dot${i === active ? " is-active" : ""}`}
              aria-label={`Show background ${i + 1}`}
              onClick={() => goTo(i)}
              data-cursor-hover
            />
          ))}
        </div>

        <div className="hero-bg-index">
          0{active + 1} / 0{slideCount}
        </div>
      </div>
    </section>
  );
}
