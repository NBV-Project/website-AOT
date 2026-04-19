export type Locale = "th" | "en" | "zh";
export const LOCALE_COOKIE = "preferred-locale";
export const locales: Locale[] = ["th", "en", "zh"];
export const defaultLocale: Locale = "th";

export function isLocale(value?: string): value is Locale {
  return value === "th" || value === "en" || value === "zh";
}

export function getLocale(value?: string): Locale {
  if (isLocale(value)) {
    return value;
  }
  return defaultLocale;
}

export const navigationByLocale: Record<Locale, { label: string; href: string }[]> = {
  th: [
    { label: "หน้าแรก", href: "/" },
    { label: "เกี่ยวกับเรา", href: "/about" },
    { label: "สินค้า", href: "/products" },
    { label: "โลจิสติกส์", href: "/logistics" },
    { label: "ติดต่อเรา", href: "/contact" },
  ],
  en: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Transportation", href: "/logistics" },
    { label: "Contact", href: "/contact" },
  ],
  zh: [
    { label: "首页", href: "/" },
    { label: "关于我们", href: "/about" },
    { label: "产品", href: "/products" },
    { label: "运输", href: "/logistics" },
    { label: "联系我们", href: "/contact" },
  ],
};

export const brandByLocale: Record<Locale, string> = {
  th: "เอเชียน โอเวอร์ซี เทรดดิ้ง",
  en: "Asian Overseas Trading",
  zh: "亚洲海外贸易",
};

export function withLang(href: string, locale: Locale) {
  const cleanHref = href.split("?")[0];
  if (cleanHref === "/") {
    return `/${locale}`;
  }

  const normalizedHref = cleanHref.startsWith("/") ? cleanHref : `/${cleanHref}`;
  return `/${locale}${normalizedHref}`;
}

export function stripLocaleFromPathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && isLocale(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }

  return pathname || "/";
}

export function switchLocalePath(pathname: string, locale: Locale) {
  return withLang(stripLocaleFromPathname(pathname), locale);
}

/**
 * ฟังก์ชันตัดสินใจเลือกภาษาที่เสถียรที่สุด
 * 1. ตรวจจาก Search Param ก่อน
 * 2. ถ้าไม่มี ตรวจจาก Cookie
 * 3. ถ้าไม่มีเลย ใช้ 'th'
 */
export function resolveLocale(searchLang?: string, cookieLang?: string): Locale {
  if (isLocale(searchLang)) return searchLang;
  if (isLocale(cookieLang)) return cookieLang;
  return defaultLocale;
}
