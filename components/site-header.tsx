// Server Component — no 'use client' directive
import Link from "next/link";
import { Suspense } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileMenuButton } from "@/components/mobile-menu-button";
import type { Locale } from "@/lib/locale";
import { withLang } from "@/lib/locale";

type SiteHeaderProps = {
  activeHref: string;
  brand: string;
  currentLocale: Locale;
  navigation: { label: string; href: string }[];
};

export function SiteHeader({ activeHref, brand, currentLocale, navigation }: SiteHeaderProps) {
  return (
    <nav
      className="sticky top-0 z-[120] border-b border-white/10 bg-[var(--brand-primary)] shadow-[0_10px_30px_rgba(0,0,0,0.14)] transition-colors duration-500"
      style={{
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        willChange: "transform",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <div className="relative flex min-h-16 items-center justify-between px-4 py-3 sm:min-h-[4.25rem] sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <Link
          href={withLang("/", currentLocale)}
          className="max-w-[11rem] truncate font-[family-name:var(--font-montserrat)] text-sm font-semibold leading-tight tracking-[-0.02em] text-white sm:max-w-[15rem] sm:text-base md:max-w-none md:text-xl lg:text-2xl"
        >
          {brand}
        </Link>

        {/* Desktop nav — fully static, zero JS */}
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
          <Suspense fallback={<div className="w-10 h-10 sm:w-12 sm:h-12" />}>
            <LanguageSwitcher currentLocale={currentLocale} />
          </Suspense>
          {/* Only interactive client island: mobile hamburger + overlay */}
          <MobileMenuButton
            navigation={navigation}
            activeHref={activeHref}
            currentLocale={currentLocale}
            brand={brand}
          />
        </div>
      </div>
    </nav>
  );
}
