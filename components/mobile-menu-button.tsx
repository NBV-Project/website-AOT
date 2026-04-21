"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { withLang } from "@/lib/locale";
import type { Locale } from "@/lib/locale";

type MobileMenuProps = {
  navigation: { label: string; href: string }[];
  activeHref: string;
  currentLocale: Locale;
  brand: string;
};

export function MobileMenuButton({ navigation, activeHref, currentLocale, brand }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Avoid synchronous setState in effect for React 19
    requestAnimationFrame(() => {
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white transition hover:bg-white/14 lg:hidden"
        onClick={() => setIsOpen((v) => !v)}
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

      {isMounted && isOpen
        ? createPortal(
            <div className="fixed inset-0 z-[200] lg:hidden" role="dialog" aria-modal="true">
              <div
                className="absolute inset-0 backdrop-blur-2xl"
                style={{ backgroundColor: "var(--brand-primary)", opacity: 0.98 }}
              />

              <div className="relative flex min-h-screen flex-col">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
                  <span className="max-w-[11rem] font-[family-name:var(--font-montserrat)] text-sm font-semibold leading-tight tracking-[-0.02em] text-white sm:max-w-[15rem] sm:text-base">
                    {brand}
                  </span>

                  <button
                    type="button"
                    aria-label="Close navigation"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/16"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-1 flex-col justify-center px-8 py-10">
                  <div className="space-y-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.label}
                        href={withLang(item.href, currentLocale)}
                        className={`block text-center font-[family-name:var(--font-montserrat)] text-3xl font-bold tracking-tight transition-colors duration-300 ${
                          item.href === activeHref ? "text-[#D4AF37]" : "text-white/78 hover:text-white"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 p-8 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
                    {brand} &copy; 2024
                  </p>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
