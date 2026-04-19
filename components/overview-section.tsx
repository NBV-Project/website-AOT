"use client";

import { useState } from "react";
import Image from "next/image";
import { type Locale } from "@/lib/locale";
import { HighlightModal } from "./highlight-modal";

type OverviewSectionProps = {
  locale: Locale;
  copy: {
    overviewKicker: string;
    overviewTitle: string;
    overviewBody: string;
    overviewHighlights: string[];
    overviewDetails?: Array<{
      id: string;
      title: string;
      description: string;
      points: string[];
      icon?: string;
      image: string;
    }>;
  };
  introImage: string;
};

export function OverviewSection({ locale, copy, introImage }: OverviewSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);

  const highlightIds = ["sourcing", "logistics", "market"];

  const handleHighlightClick = (id: string) => {
    setSelectedHighlightId(id);
    setIsModalOpen(true);
  };

  return (
    <section className="bg-[var(--brand-section-bg)] px-4 py-20 sm:px-6 md:px-8 lg:px-10 lg:py-28 xl:px-12">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div className="reveal overflow-hidden rounded-[2.5rem] border border-[#d9dfce] bg-white shadow-[0_24px_56px_-12px_rgba(0,37,72,0.1)]">
          <div className="relative aspect-[4/5] lg:aspect-square">
            <Image
              src={introImage}
              alt={copy?.overviewTitle || "Company Overview"}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover transition duration-700 hover:scale-[1.05]"
            />
          </div>
        </div>

        <div>
          <span className="inline-flex bg-[var(--brand-bg)] px-4 py-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#6f9152] rounded-md mb-2">
            {copy.overviewKicker}
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-montserrat)] text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--brand-primary)] md:text-5xl">
            {copy.overviewTitle}
          </h2>
          <p className="mt-8 max-w-3xl text-base leading-[1.7] text-slate-600 md:text-lg">
            {copy.overviewBody}
          </p>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {(copy.overviewHighlights || []).map((item, index) => (
              <button
                key={item || index}
                onClick={() => handleHighlightClick(highlightIds[index])}
                className="group text-left block rounded-[2rem] border border-[var(--brand-border)] bg-white p-7 transition-all duration-500 hover:shadow-[0_24px_48px_-12px_rgba(0,37,72,0.12)] hover:border-[#95bb72] hover:-translate-y-2 active:scale-[0.96]"
              >
                <span className="mb-5 block h-1.5 w-14 rounded-full bg-[#95bb72] transition-all duration-500 group-hover:w-full group-hover:bg-[var(--brand-primary)]" />
                <p className="font-[family-name:var(--font-montserrat)] text-base font-bold leading-tight text-[var(--brand-primary)] group-hover:text-[#6f9152] transition-colors duration-300">
                  {item}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-[var(--brand-primary)] transition-colors duration-300">
                  {locale === "th" ? "ดูข้อมูลเชิงลึก" : locale === "zh" ? "查看详情" : "See Insights"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <HighlightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        highlightId={selectedHighlightId}
        locale={locale}
        details={copy.overviewDetails}
      />
    </section>
  );
}
