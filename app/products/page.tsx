import Image from "next/image";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProductCategoriesClient } from "@/components/product-categories-client";
import {
  brandByLocale,
  type Locale,
  navigationByLocale,
  resolveLocale,
  withLang,
} from "@/lib/locale";
import { resolveProductKey } from "@/lib/product-keys";

const heroImage = "/images/products-hero-bright.jpg";

const secondaryImages = {
  premium: "/images/sdr.jpg",
  packing: "/images/products-packing-process.jpg",
};

const showcaseImages = {
  programOne: "/images/rajhasingha.jpg",
  programTwo: "/images/taizhong1.jpg",
};

type ProductsCopy = {
  heroTitle: string[];
  heroBody: string;
  primaryCta: string;
  secondaryCta: string;
  categoriesTitle: string;
  flagshipTitle: string;
  flagshipBody: string;
  flagshipPoints: string[];
  showcaseTitle: string;
  showcaseBody: string;
  showcaseItems: { title: string; body: string; image: string; imageBg: string }[];
  portfolioTitle: string;
  portfolioBody: string;
  portfolioCards: { title: string; body: string }[];
  processTitle: string;
  processBody: string;
  processSteps: { title: string; body: string }[];
  ctaTitle: string;
  ctaBody: string;
};

const copyByLocale: Record<Locale, ProductsCopy> = {
  th: {
    heroTitle: ["สินค้าคุณภาพ", "เพื่อการส่งออก"],
    heroBody: "คัดสรรทุเรียน มะพร้าว มะม่วง มังคุด ขนุน และสับปะรดสำหรับตลาดสากล โดยวางทุเรียนเป็นสินค้าหลักของบริษัท",
    primaryCta: "สอบถามสินค้า",
    secondaryCta: "ติดต่อเรา",
    categoriesTitle: "หมวดหมู่สินค้า",
    flagshipTitle: "ทุเรียนคัดสรรสำหรับโปรแกรมส่งออก",
    flagshipBody: "ทุเรียนคือสินค้าหลักของเอเชียน โอเวอร์ซี เทรดดิ้ง เราดูแลตั้งแต่การเลือกแหล่งปลูก การคัดเกรด และการวางแผนจัดส่ง",
    flagshipPoints: ["คัดเกรดตามสเปกของตลาดปลายทาง", "ออกแบบการแพ็กให้เหมาะกับการส่งออก", "เชื่อมต่อกับตลาดค้าส่งหลักในจีน"],
    showcaseTitle: "แบรนด์สินค้าของเรา",
    showcaseBody: "เรามีแบรนด์สินค้าที่ตอบโจทย์รูปแบบการกระจายสินค้าที่แตกต่างกันของคู่ค้าแต่ละราย",
    showcaseItems: [
      { title: "Rajha Singha", body: "รูปแบบบรรจุที่เน้นการจัดเก็บและการกระจายลอตอย่างเป็นระบบ", image: showcaseImages.programOne, imageBg: "#000000" },
      { title: "Tai Zhong", body: "รูปแบบบรรจุที่เน้นภาพลักษณ์พรีเมียมมากขึ้น", image: showcaseImages.programTwo, imageBg: "#ffffff" }
    ],
    portfolioTitle: "แนวทางการจัดพอร์ตสินค้า",
    portfolioBody: "นอกจากทุเรียน เรายังจัดพอร์ตผลไม้หลักอีก 5 รายการเพื่อรองรับคำสั่งซื้อหลายรูปแบบ",
    portfolioCards: [
      { title: "ผลไม้สดหลายชนิด", body: "รองรับการสั่งซื้อแบบรวมหลายรายการในคำสั่งซื้อเดียว" },
      { title: "รูปแบบบรรจุที่เหมาะกับตลาด", body: "วางสเปกบรรจุภัณฑ์ให้เหมาะกับการกระจายสินค้า" },
      { title: "จังหวะการจัดส่งที่แม่นยำ", body: "ออกแบบรอบจัดส่งให้สอดคล้องกับฤดูกาลสินค้า" }
    ],
    processTitle: "วงจรการคัดสรรและจัดส่ง",
    processBody: "ทุกขั้นตอนถูกออกแบบเพื่อให้สินค้าแข่งขันได้ในตลาดจีน ทั้งด้านคุณภาพและความสด",
    processSteps: [
      { title: "คัดเลือกแหล่งผลิต", body: "เลือกสวนและแหล่งผลิตที่สอดคล้องกับมาตรฐาน" },
      { title: "ควบคุมคุณภาพสินค้า", body: "ตรวจสอบการคัดเกรดและการบรรจุอย่างเข้มงวด" },
      { title: "วางแผนการขนส่ง", body: "กำหนดเส้นทางและช่วงเวลาจัดส่งให้เหมาะกับสินค้า" }
    ],
    ctaTitle: "พร้อมเลือกสินค้าที่เหมาะกับตลาดของคุณ",
    ctaBody: "เราช่วยวางแผนสินค้า ปริมาณ และรูปแบบการจัดส่งให้สอดคล้องกับความต้องการของคุณ"
  },
  en: {
    heroTitle: ["Premium Products", "for Export"],
    heroBody: "Curation of durian, coconut, mango, mangosteen, jackfruit, and pineapple for international markets.",
    primaryCta: "Request Products",
    secondaryCta: "Contact Us",
    categoriesTitle: "Product Categories",
    flagshipTitle: "Selected Durian for Export Programs",
    flagshipBody: "Durian is the flagship product of Asian Overseas Trading.",
    flagshipPoints: ["Graded for specific markets", "Optimized export packaging", "Direct China market access"],
    showcaseTitle: "Our Brands",
    showcaseBody: "We support different product formats to serve diverse partner needs.",
    showcaseItems: [
      { title: "Rajha Singha", body: "Focused on organized storage and systematic distribution.", image: showcaseImages.programOne, imageBg: "#000000" },
      { title: "Tai Zhong", body: "Premium-facing format for high-end presentation.", image: showcaseImages.programTwo, imageBg: "#ffffff" }
    ],
    portfolioTitle: "Portfolio Structure",
    portfolioBody: "Alongside durian, we maintain a five-fruit portfolio to support seasonal demand.",
    portfolioCards: [
      { title: "Multi-Fruit Supply", body: "Consolidated orders for better procurement flexibility." },
      { title: "Market-Fit Packaging", body: "Tailored packaging for destination requirements." },
      { title: "Precise Delivery", body: "Schedules aligned with product seasonality." }
    ],
    processTitle: "Selection & Shipment Cycle",
    processBody: "Structured steps to maintain quality and freshness in international markets.",
    processSteps: [
      { title: "Source Selection", body: "Orchards matched to specific export standards." },
      { title: "Quality Control", body: "Strict inspection during grading and packing." },
      { title: "Logistics Planning", body: "Temperature and route optimization for each shipment." }
    ],
    ctaTitle: "Ready to build your market product mix?",
    ctaBody: "We help define range and volume that fit your local distribution channels."
  },
  zh: {
    heroTitle: ["优质产品", "面向出口市场"],
    heroBody: "为全球市场精选榴莲、椰子、芒果、山竹、菠萝蜜和菠萝。",
    primaryCta: "咨询产品",
    secondaryCta: "联系我们",
    categoriesTitle: "产品分类",
    flagshipTitle: "面向出口计划的精选榴莲",
    flagshipBody: "榴莲是 Asian Overseas Trading 的核心主打产品。",
    flagshipPoints: ["按市场需求分级", "专业出口包装", "直连中国各大市场"],
    showcaseTitle: "我们的品牌",
    showcaseBody: "提供多种包装形式，满足不同合作伙伴的需求。",
    showcaseItems: [
      { title: "Rajha Singha", body: "侧重于规范化仓储与系统化分发。", image: showcaseImages.programOne, imageBg: "#000000" },
      { title: "Tai Zhong", body: "更具高端感，适合展示与陈列。", image: showcaseImages.programTwo, imageBg: "#ffffff" }
    ],
    portfolioTitle: "产品组合方向",
    portfolioBody: "除榴莲外，我们还配置五个主要水果品类。",
    portfolioCards: [
      { title: "多品类供应", body: "支持单次采购中整合多种水果。" },
      { title: "适配包装", body: "根据目的地需求定制包装规格。" },
      { title: "精准节奏", body: "根据产季与市场窗口规划发运。" }
    ],
    processTitle: "甄选与发运流程",
    processBody: "每个环节都旨在保障品质与新鲜度。",
    processSteps: [
      { title: "产地筛选", body: "选择符合出口标准的优质果园。" },
      { title: "质量控制", body: "全程监控分选与包装过程。" },
      { title: "发运规划", body: "针对不同产品优化运输温控与路线。" }
    ],
    ctaTitle: "为您的市场定制产品组合",
    ctaBody: "协助规划适合当地渠道的产品种类与供应量。"
  }
};

const getProductsData = unstable_cache(
  async () => {
    const [{ data: pageData }, { data: dbProducts }] = await Promise.all([
      supabase.from('page_content').select('content').eq('page_name', 'products_page').single(),
      supabase.from('products').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
    ]);
    return { pageData, dbProducts };
  },
  ['products-data'],
  { revalidate: 300 }
);

type ProductsPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const lang = resolveLocale(resolvedSearchParams.lang);
  const navigation = navigationByLocale[lang];
  const brand = brandByLocale[lang];

  const { pageData, dbProducts } = await getProductsData();

  const dbContent = pageData?.content || {};
  const langContent = dbContent[lang] || {};
  const defaultCopy = copyByLocale[lang];
  const copy = {
    ...defaultCopy,
    ...langContent,
    heroTitle: langContent.heroTitle || defaultCopy.heroTitle,
    flagshipPoints: langContent.flagshipPoints || defaultCopy.flagshipPoints,
    showcaseItems: langContent.showcaseItems || defaultCopy.showcaseItems,
  };
  const images = {
    hero: dbContent.images?.hero || heroImage,
    flagship: dbContent.images?.flagship || secondaryImages.premium,
    showcaseOne: dbContent.images?.showcaseOne || showcaseImages.programOne,
    showcaseTwo: dbContent.images?.showcaseTwo || showcaseImages.programTwo,
  };

  interface ProductDB {
    id: string;
    image_url: string;
    is_in_season: boolean;
    th: { name: string };
    en: { name: string };
    zh: { name: string };
  }

  const categories = (dbProducts || []).map((p: ProductDB) => ({
    id: resolveProductKey(p[lang]?.name, p.image_url) ?? p.id,
    title: p[lang]?.name || 'Fruit',
    image: p.image_url,
    is_in_season: p.is_in_season
  }));

  return (
    <>
      <main className="bg-[var(--brand-bg)] font-[family-name:var(--font-open-sans)] text-[var(--brand-text)] transition-colors duration-500">
        <SiteHeader activeHref="/products" brand={brand} currentLocale={lang} navigation={navigation} />

        <section className="relative h-screen min-h-[600px] overflow-hidden bg-[var(--brand-primary)]">
          <div className="absolute inset-0">
            <Image 
              src={images.hero} 
              alt="Products hero" 
              fill 
              priority 
              sizes="100vw" 
              className="object-cover" 
              loading="eager"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,18,30,0.72)_0%,rgba(5,18,30,0.48)_38%,rgba(5,18,30,0.16)_100%)]" />
          </div>
          <div className="relative z-10 mx-auto flex h-full w-full max-w-screen-2xl items-center px-4 py-12 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <div className="max-w-4xl reveal mt-20">
              <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-7xl">
                {(copy.heroTitle || []).map((line: string) => (
                  <span key={line} className="block md:whitespace-nowrap">{line}</span>
                ))}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-[1.7] text-white/84 md:text-lg reveal-delayed-1">
                {copy.heroBody}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row reveal-delayed-2">
                <Link href={withLang("/contact", lang)} className="inline-flex min-w-[9.5rem] items-center justify-center rounded-md border-2 border-white bg-white px-7 py-4 text-center font-[family-name:var(--font-montserrat)] text-base font-medium text-[var(--brand-primary)] transition duration-300 hover:-translate-y-0.5 hover:bg-transparent hover:text-white hover:shadow-md">
                  {copy.primaryCta}
                </Link>
                <a href="#catalog" className="inline-flex min-w-[9.5rem] items-center justify-center rounded-md border-2 border-white bg-transparent px-7 py-4 text-center font-[family-name:var(--font-montserrat)] text-base font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--brand-primary)] hover:shadow-md">
                  {copy.secondaryCta}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-12 md:py-24 sm:px-6 md:px-8 lg:px-10 lg:py-24 xl:px-12">
          <div className="mx-auto max-w-screen-2xl">
            <div className="max-w-3xl">
              <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold leading-[1.04] tracking-[-0.02em] text-[var(--brand-primary)] md:text-5xl">
                {copy.showcaseTitle}
              </h2>
              <p className="mt-5 text-base leading-[1.7] text-slate-600 md:text-lg">{copy.showcaseBody}</p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {(copy.showcaseItems || []).map((item: { title: string; body: string; image: string; imageBg: string }, index: number) => (
                <article key={item.title} className="overflow-hidden rounded-[2rem] border border-[#d9dfce] bg-[#f7f8f2] shadow-[0_18px_48px_rgba(0,37,72,0.08)]">
                  <div className="relative min-h-[20rem] overflow-hidden sm:min-h-[23rem] lg:min-h-[26rem]" style={{ backgroundColor: item.imageBg }}>
                    <Image src={item.image || (index === 0 ? images.showcaseOne : images.showcaseTwo)} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 48vw" className="object-contain transition duration-700 hover:scale-[1.05]" />
                  </div>
                  <div className="p-8">
                    <h3 className="font-[family-name:var(--font-montserrat)] text-2xl font-semibold text-[var(--brand-primary)] sm:text-[2rem]">{item.title}</h3>
                    <p className="mt-4 text-base leading-[1.7] text-slate-600">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="catalog" className="bg-white px-4 py-12 md:py-24 sm:px-6 md:px-8 lg:px-10 lg:py-24 xl:px-12">
          <div className="mx-auto max-w-screen-2xl text-center">
            <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold tracking-[-0.02em] text-[var(--brand-primary)] md:text-5xl">
              {copy.categoriesTitle}
            </h2>
            <ProductCategoriesClient categories={categories} locale={lang} />
          </div>
        </section>

        <section className="bg-[var(--brand-bg)] px-4 py-12 md:py-24 sm:px-6 md:px-8 lg:px-10 lg:py-24 xl:px-12">
          <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
            <div className="overflow-hidden rounded-[2rem] border border-[#d9dfce] bg-white shadow-[0_18px_48px_rgba(0,37,72,0.08)]">
              <div className="relative aspect-[4/3]">
                <Image 
                  src={images.flagship} 
                  alt={copy.flagshipTitle} 
                  fill 
                  sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 52vw, 800px" 
                  className="object-cover" 
                />
              </div>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold leading-tight tracking-[-0.02em] text-[var(--brand-primary)] md:text-5xl">
                {copy.flagshipTitle}
              </h2>
              <p className="mt-6 text-base leading-[1.7] text-slate-600 md:text-lg">{copy.flagshipBody}</p>
              <ul className="mt-8 space-y-4">
                {(copy.flagshipPoints || []).map((point: string) => (
                  <li key={point} className="flex items-start gap-4 text-base leading-[1.7] text-slate-600">
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#95bb72]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <SiteFooter locale={lang} />
      </main>
    </>
  );
}
