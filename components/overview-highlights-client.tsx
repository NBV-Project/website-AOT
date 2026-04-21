"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { type Locale } from "@/lib/locale";

const HighlightModal = dynamic(
  () => import("./highlight-modal").then((m) => m.HighlightModal),
  { ssr: false }
);

type OverviewHighlightsClientProps = {
  locale: Locale;
  highlights: string[];
  overviewDetails?: Array<{
    id: string;
    title: string;
    description: string;
    points: string[];
    icon?: string;
    image: string;
  }>;
};

const highlightIds = ["sourcing", "logistics", "market"];

export function OverviewHighlightsClient({ locale, highlights, overviewDetails }: OverviewHighlightsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);

  const handleHighlightClick = (id: string) => {
    setSelectedHighlightId(id);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {highlights.map((item, index) => (
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

      {/* Modal: loaded only after user interaction */}
      <HighlightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        highlightId={selectedHighlightId}
        locale={locale}
        details={overviewDetails}
      />
    </>
  );
}
