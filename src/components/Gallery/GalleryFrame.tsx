"use client";

import { useEffect, useRef, useState } from "react";

interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
}

interface GalleryFrameProps {
  items: GalleryItem[];
  tag: string;
  autoRotateMs?: number;
}

export default function GalleryFrame({ items, tag, autoRotateMs = 4200 }: GalleryFrameProps) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, autoRotateMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items.length, autoRotateMs]);

  const goTo = (index: number) => {
    setActive(index);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, autoRotateMs);
  };

  return (
    <div className="about-gallery-frame">
      <span className="about-gallery-frame__border-top" aria-hidden="true" />
      <span className="about-gallery-frame__border-right" aria-hidden="true" />
      <span className="about-gallery-frame__border-bottom" aria-hidden="true" />
      <span className="about-gallery-frame__border-left" aria-hidden="true" />

      <div className="about-gallery-frame__inner img-reveal">
        {items.map((item, i) => (
          <div
            key={item.src}
            className={`about-gallery-frame__slide${i === active ? " is-active" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.alt} />
          </div>
        ))}

        <span className="about-gallery-frame__tag">{tag}</span>
        <span className="about-gallery-frame__caption">{items[active].caption}</span>

        <div className="about-gallery-frame__dots">
          {items.map((item, i) => (
            <button
              key={item.src}
              type="button"
              className={`about-gallery-frame__dot${i === active ? " is-active" : ""}`}
              aria-label={`Show ${item.caption} image`}
              onClick={() => goTo(i)}
              data-cursor-hover
            />
          ))}
        </div>
      </div>
    </div>
  );
}
