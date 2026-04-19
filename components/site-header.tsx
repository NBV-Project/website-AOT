"use client";

import Link from "next/link";
import { useState } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import type { Locale } from "@/lib/locale";
import { withLang } from "@/lib/locale";

type SiteHeaderProps = {
  activeHref: string;
  brand: string;
  currentLocale: Locale;
  navigation: { label: string; href: string }[];
};

export function SiteHeader({ activeHref, brand, currentLocale, navigation }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[var(--brand-primary)]/92 backdrop-blur-xl transition-colors duration-500">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <Link
          href={withLang("/", currentLocale)}
          className="max-w-[11rem] font-[family-name:var(--font-montserrat)] text-sm font-semibold leading-tight tracking-[-0.02em] text-white sm:max-w-[15rem] sm:text-base md:max-w-none md:text-xl lg:text-2xl"
          onClick={() => setIsOpen(false)}
        >
          {brand}
        </Link>

        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={withLang(item.href, currentLocale)}
              className={
                item.href === activeHref
                  ? "border-b-2 border-[#95bb72] pb-1 font-[family-name:var(--font-montserrat)] text-base font-bold tracking-tight text-white"
                  : "font-[family-name:var(--font-montserrat)] text-base font-medium tracking-tight text-white/72 transition-colors duration-300 hover:text-white"
              }
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSwitcher />
          <LanguageSwitcher currentLocale={currentLocale} />
          <button
            type="button"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white transition hover:bg-white/14 lg:hidden"
            onClick={() => setIsOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 flex flex-col bg-[var(--brand-primary)]/98 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] lg:hidden ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-1 flex-col justify-center px-8 space-y-8">
          {navigation.map((item, index) => (
            <Link
              key={item.label}
              href={withLang(item.href, currentLocale)}
              className={`block text-center font-[family-name:var(--font-montserrat)] text-3xl font-bold tracking-tight transition-all duration-500 delay-[${index * 50}ms] ${
                item.href === activeHref
                  ? "text-[#D4AF37] scale-110"
                  : "text-white/70 hover:text-white"
              } ${isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="p-12 text-center border-t border-white/5">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">
            Asian Overseas Trading &copy; 2024
          </p>
        </div>
      </div>
    </nav>
  );
}
