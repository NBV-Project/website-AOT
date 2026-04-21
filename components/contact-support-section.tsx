// Server Component — no 'use client' directive
import { type Locale } from "@/lib/locale";
import { ContactSupportButtons } from "./contact-support-buttons";

type ContactSupportSectionProps = {
  locale: Locale;
  copy: {
    introTitle: string;
    introBody: string;
    supportPoints: { id: string; text: string }[];
  };
};

export function ContactSupportSection({ locale, copy }: ContactSupportSectionProps) {
  return (
    <section className="bg-white px-4 py-12 md:py-24 sm:px-6 md:px-8 lg:px-10 lg:py-24 xl:px-12">
      <div className="mx-auto max-w-screen-2xl reveal">
        <div className="max-w-4xl">
          <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold leading-[1.04] tracking-[-0.02em] text-[var(--brand-primary)] md:text-5xl">
            {copy.introTitle}
          </h2>
          <p className="mt-6 text-base leading-[1.7] text-slate-600 md:text-lg">{copy.introBody}</p>
        </div>

        {/* Only the interactive cards + modal are a Client Component */}
        <ContactSupportButtons locale={locale} supportPoints={copy.supportPoints} />
      </div>
    </section>
  );
}
