"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LOCALE_COOKIE, switchLocalePath, type Locale } from "@/lib/locale";

const locales = [
  { code: "th", label: "TH", icon: "/images/locale-th.png" },
  { code: "en", label: "EN", icon: "/images/locale-en.png" },
  { code: "zh", label: "CN", icon: "/images/locale-zh.png" },
] as const;

type LanguageSwitcherProps = {
  currentLocale: Locale;
};

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const current = currentLocale;
  const currentOption = locales.find((locale) => locale.code === current) ?? locales[0];
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 bg-transparent font-[family-name:var(--font-montserrat)] text-sm font-semibold text-white transition-colors duration-300 hover:text-white/80"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Switch language"
      >
        <span className="relative h-6 w-6 overflow-hidden rounded-full ring-1 ring-white/30">
          <Image
            src={currentOption.icon}
            alt={currentOption.label}
            fill
            sizes="24px"
            className="object-cover"
          />
        </span>
        <span
          aria-hidden="true"
          className={open ? "rotate-180 transition-transform duration-300" : "transition-transform duration-300"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      <div
        className={
          open
            ? "pointer-events-auto absolute right-0 top-full z-50 mt-3 min-w-24 translate-y-0 rounded-md border border-gray-100 bg-white p-1.5 opacity-100 shadow-lg transition-all duration-300"
            : "pointer-events-none absolute right-0 top-full z-50 mt-3 min-w-24 translate-y-2 rounded-md border border-gray-100 bg-white p-1.5 opacity-0 shadow-lg transition-all duration-300"
        }
      >
        {locales.map((locale) => {
          const active = locale.code === current;
          const href = switchLocalePath(pathname, locale.code);

          return (
            <Link
              key={locale.code}
              href={href}
              scroll={false}
              onClick={() => {
                document.cookie = `${LOCALE_COOKIE}=${locale.code}; path=/; max-age=31536000; samesite=lax`;
                setOpen(false);
              }}
              className={
                active
                  ? "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-[#003366]"
                  : "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-[#003366]"
              }
            >
              <span className="relative h-6 w-6 overflow-hidden rounded-full ring-1 ring-black/10">
                <Image
                  src={locale.icon}
                  alt={locale.label}
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </span>
              <span>{locale.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
