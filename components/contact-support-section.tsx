"use client";

import { useState } from "react";
import { type Locale } from "@/lib/locale";
import { ContactSupportModal } from "./contact-support-modal";

type ContactSupportSectionProps = {
  locale: Locale;
  copy: {
    introTitle: string;
    introBody: string;
    supportPoints: { id: string; text: string }[];
  };
};

export function ContactSupportSection({ locale, copy }: ContactSupportSectionProps) {
  const [activeSupportId, setActiveSupportId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (id: string) => {
    setActiveSupportId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="bg-white px-4 py-12 md:py-24 sm:px-6 md:px-8 lg:px-10 lg:py-24 xl:px-12">
      <div className="mx-auto max-w-screen-2xl reveal">
        <div className="max-w-4xl">
          <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold leading-[1.04] tracking-[-0.02em] text-[var(--brand-primary)] md:text-5xl">
            {copy.introTitle}
          </h2>
          <p className="mt-6 text-base leading-[1.7] text-slate-600 md:text-lg">{copy.introBody}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {copy.supportPoints.map((point) => (
            <button
              key={point.id}
              onClick={() => handleOpenModal(point.id)}
              className="group flex flex-col items-start text-left rounded-[1.5rem] border border-[#d8dfce] bg-[#f7f8f2] p-7 shadow-[0_10px_26px_rgba(0,37,72,0.05)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl active:scale-[0.98]"
            >
              <div className="mb-4 h-1 w-14 bg-[#95bb72] transition-all duration-300 group-hover:w-20" />
              <p className="text-base leading-[1.7] text-slate-600 group-hover:text-[var(--brand-primary)] font-medium transition-colors">
                {point.text}
              </p>
              <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-bold text-[#6f9152] opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                {locale === "th" ? "ดูรายละเอียด" : locale === "zh" ? "查看详情" : "View Details"}
                <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <ContactSupportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        supportId={activeSupportId}
        locale={locale}
      />
    </section>
  );
}
