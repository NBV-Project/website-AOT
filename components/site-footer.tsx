import Link from "next/link";

import { type Locale, withLang } from "@/lib/locale";

type FooterLink = {
  label: string;
  href?: string;
  external?: boolean;
};

const footerCopy: Record<
  Locale,
  {
    companyTitle: string;
    companyLinks: FooterLink[];
    approachTitle: string;
    approachLinks: FooterLink[];
    contactTitle: string;
    contactLinks: FooterLink[];
    copyright: string;
  }
> = {
  th: {
    companyTitle: "ข้อมูลองค์กร",
    companyLinks: [
      { label: "ข้อกำหนดทางกฎหมาย", href: "/about" },
      { label: "นโยบายความเป็นส่วนตัว", href: "/about" },
      { label: "เงื่อนไขการให้บริการ", href: "/about" },
    ],
    approachTitle: "แนวทางการดำเนินงาน",
    approachLinks: [
      { label: "ความยั่งยืน", href: "/logistics" },
      { label: "เครือข่ายการขนส่ง", href: "/logistics" },
      { label: "มาตรฐานการคัดสรร", href: "/logistics" },
    ],
    contactTitle: "ติดต่อเรา",
    contactLinks: [
      { label: "สำนักงานใหญ่", href: "/contact" },
      {
        label: "388/65-388/66 ถนนนวลจันทร์ แขวงนวลจันทร์ เขตบึงกุ่ม กรุงเทพมหานคร 10230",
        href: "https://maps.google.com/?q=388/65-388/66%20Nuan%20Chan%20Road%20Bueng%20Kum%20Bangkok%2010230",
        external: true,
      },
      { label: "โทร: 085-289-2451", href: "tel:0852892451", external: true },
      { label: "อีเมล: contact@asianoverseas.co.th", href: "mailto:contact@asianoverseas.co.th", external: true },
    ],
    copyright: "© 2024 เอเชียน โอเวอร์ซี เทรดดิ้ง สงวนลิขสิทธิ์ทั้งหมด",
  },
  en: {
    companyTitle: "Company Information",
    companyLinks: [
      { label: "Legal Notice", href: "/about" },
      { label: "Privacy Policy", href: "/about" },
      { label: "Terms of Service", href: "/about" },
    ],
    approachTitle: "Operating Principles",
    approachLinks: [
      { label: "Sustainability", href: "/logistics" },
      { label: "Transportation Network", href: "/logistics" },
      { label: "Selection Standards", href: "/logistics" },
    ],
    contactTitle: "Contact Us",
    contactLinks: [
      { label: "Head Office", href: "/contact" },
      {
        label: "388/65-388/66 Nuan Chan Road, Nuan Chan, Bueng Kum, Bangkok 10230",
        href: "https://maps.google.com/?q=388/65-388/66%20Nuan%20Chan%20Road%20Bueng%20Kum%20Bangkok%2010230",
        external: true,
      },
      { label: "Tel: 085-289-2451", href: "tel:0852892451", external: true },
      { label: "Email: contact@asianoverseas.co.th", href: "mailto:contact@asianoverseas.co.th", external: true },
    ],
    copyright: "Â© 2024 Asian Overseas Trading. All rights reserved.",
  },
  zh: {
    companyTitle: "ä¼ä¸šä¿¡æ¯",
    companyLinks: [
      { label: "æ³•å¾‹æ¡æ¬¾", href: "/about" },
      { label: "éšç§æ”¿ç­–", href: "/about" },
      { label: "æœåŠ¡æ¡ä»¶", href: "/about" },
    ],
    approachTitle: "è¿è¥æ–¹å‘",
    approachLinks: [
      { label: "å¯æŒç»­å‘å±•", href: "/logistics" },
      { label: "è¿è¾“ç½‘ç»œ", href: "/logistics" },
      { label: "ç²¾é€‰æ ‡å‡†", href: "/logistics" },
    ],
    contactTitle: "è”ç³»æˆ‘ä»¬",
    contactLinks: [
      { label: "æ€»éƒ¨åœ°å€", href: "/contact" },
      {
        label: "388/65-388/66 Nuan Chan Road, Nuan Chan, Bueng Kum, Bangkok 10230 æ³°å›½",
        href: "https://maps.google.com/?q=388/65-388/66%20Nuan%20Chan%20Road%20Bueng%20Kum%20Bangkok%2010230",
        external: true,
      },
      { label: "ç”µè¯: 085-289-2451", href: "tel:0852892451", external: true },
      { label: "é‚®ç®±: contact@asianoverseas.co.th", href: "mailto:contact@asianoverseas.co.th", external: true },
    ],
    copyright: "Â© 2024 äºšæ´²æµ·å¤–è´¸æ˜“ ç‰ˆæƒæ‰€æœ‰",
  },
};

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = footerCopy[locale];

  const renderLink = (item: FooterLink) => {
    const className = "transition-colors duration-200 hover:text-white";

    if (!item.href) {
      return <span>{item.label}</span>;
    }

    if (item.external) {
      return (
        <a href={item.href} target="_blank" rel="noreferrer" className={className}>
          {item.label}
        </a>
      );
    }

    return (
      <Link href={withLang(item.href, locale)} className={className}>
        {item.label}
      </Link>
    );
  };

  return (
    <footer className="bg-[var(--brand-primary)] px-4 py-12 text-white sm:px-6 md:px-8 lg:px-10 xl:px-12 transition-colors duration-500">
      <div className="mx-auto max-w-screen-2xl border-t border-white/12 pt-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-[1.45fr_0.8fr_0.9fr_1fr] xl:gap-16">
          <div />

          <div>
            <h3 className="font-[family-name:var(--font-montserrat)] text-lg font-bold tracking-[-0.02em] text-[var(--brand-footer-heading)]">
              {copy.companyTitle}
            </h3>
            <ul className="mt-5 space-y-3 text-base text-white/72">
              {copy.companyLinks.map((item) => (
                <li key={item.label}>{renderLink(item)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-montserrat)] text-lg font-bold tracking-[-0.02em] text-[var(--brand-footer-heading)]">
              {copy.approachTitle}
            </h3>
            <ul className="mt-5 space-y-3 text-base text-white/72">
              {copy.approachLinks.map((item) => (
                <li key={item.label}>{renderLink(item)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-montserrat)] text-lg font-bold tracking-[-0.02em] text-[var(--brand-footer-heading)]">
              {copy.contactTitle}
            </h3>
            <ul className="mt-5 space-y-3 text-base text-white/72">
              {copy.contactLinks.map((item) => (
                <li key={item.label}>{renderLink(item)}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 text-center text-base text-white/56">
          {copy.copyright}
        </div>
      </div>
    </footer>
  );
}
