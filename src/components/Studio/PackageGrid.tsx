"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Reveal from "@/components/Reveal/Reveal";

export interface PackageView {
  slug: string;
  title: string;
  duration: string;
  price: string;
  hourlyLabel: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export default function PackageGrid({ packages }: { packages: PackageView[] }) {
  const router = useRouter();
  const [refreshing, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      <div className="package-toolbar">
        <button
          type="button"
          className={`refresh-btn${refreshing ? " is-loading" : ""}`}
          onClick={handleRefresh}
          data-cursor-hover
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2v3.5H10"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Refresh
        </button>
      </div>

      <div className="package-grid">
        {packages.map((pkg, i) => (
          <Reveal
            as="div"
            key={pkg.slug}
            delay={((i % 3) + 1) as 1 | 2 | 3}
            className="package-card"
          >
            <div className="package-card__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pkg.imageUrl} alt={pkg.imageAlt || pkg.title} />
            </div>
            <div className="package-card__body">
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
          </Reveal>
        ))}
        {packages.length === 0 && (
          <p style={{ padding: "40px", color: "var(--text-muted)" }}>
            No packages published yet.
          </p>
        )}
      </div>
    </>
  );
}
