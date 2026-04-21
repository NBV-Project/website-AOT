// Server Component — no 'use client' directive
import Image from "next/image";
import { type Locale } from "@/lib/locale";
import { OverviewHighlightsClient } from "./overview-highlights-client";

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
  return (
    <section className="bg-[var(--brand-section-bg)] px-4 py-20 sm:px-6 md:px-8 lg:px-10 lg:py-28 xl:px-12">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div className="reveal overflow-hidden rounded-[2.5rem] border border-[#d9dfce] bg-white shadow-[0_24px_56px_-12px_rgba(0,37,72,0.1)]">
          <div className="relative aspect-[4/5] lg:aspect-square">
            <Image
              src={introImage}
              alt={copy?.overviewTitle || "Company Overview"}
              fill
              sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 45vw, 680px"
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

          {/* Only the interactive cards + modal are a Client Component */}
          <OverviewHighlightsClient
            locale={locale}
            highlights={copy.overviewHighlights || []}
            overviewDetails={copy.overviewDetails}
          />
        </div>
      </div>
    </section>
  );
}
