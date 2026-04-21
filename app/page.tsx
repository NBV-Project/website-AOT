import Image from "next/image";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCategoriesHome } from "@/components/product-categories-home";
import { OverviewSection } from "@/components/overview-section";
import {
  brandByLocale,
  type Locale,
  navigationByLocale,
  resolveLocale,
  withLang,
} from "@/lib/locale";
import { resolveProductKey } from "@/lib/product-keys";

const heroImage = "/images/home-hero-durian-v2.jpg";
const introImage = "/images/home-story-origin.jpg";

const copyByLocale: Record<
  Locale,
  {
    heroTitle: string[];
    heroBody: string;
    primaryCta: string;
    secondaryCta: string;
    categoriesTitle: string;
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
  }
> = {
  th: {
    heroTitle: ["ส่งตรงผลไม้สด", "คุณภาพพรีเมียม"],
    heroBody:
      "เอเชียน โอเวอร์ซี เทรดดิ้ง เชื่อมโยงผลไม้คุณภาพจากไทยและภูมิภาคใกล้เคียงสู่ตลาดจีน ด้วยระบบคัดสรร ควบคุมคุณภาพ และขนส่งที่ออกแบบมาเพื่อการส่งออกโดยเฉพาะ",
    primaryCta: "ดูสินค้า",
    secondaryCta: "เกี่ยวกับเรา",
    categoriesTitle: "หมวดหมู่สินค้า",
    overviewKicker: "ข้อมูลองค์กร",
    overviewTitle: "เริ่มต้นจากความเข้าใจ ในคุณภาพผลไม้เขตร้อน",
    overviewBody:
      "เราก่อตั้งขึ้นเพื่อเป็นสะพานเชื่อมโยงผลไม้เขตร้อนคุณภาพจากไทยและภูมิภาคใกล้เคียงสู่ตลาดจีน โดยมีทุเรียน มะพร้าว มะม่วง มังคุด ขนุน และสับปะรด เป็นกลุ่มสินค้าหลัก พร้อมระบบคัดสรร ควบคุมอุณหภูมิ และจัดส่งที่แม่นยำในทุกขั้นตอน",
    overviewHighlights: ["คัดสรรจากแหล่งปลูกคุณภาพ", "ควบคุมความสดตลอดเส้นทาง", "รองรับตลาดปลายทางในจีน"],
  },
  en: {
    heroTitle: ["Premium Fresh Fruit", "Delivered Direct"],
    heroBody:
      "Asian Overseas Trading connects quality fruit from Thailand and nearby regions to China through disciplined sourcing, quality control, and export-focused transportation.",
    primaryCta: "View Products",
    secondaryCta: "About Us",
    categoriesTitle: "Product Categories",
    overviewKicker: "Company Profile",
    overviewTitle: "Built on a clear understanding of tropical fruit quality",
    overviewBody:
      "We were founded to connect durian, coconut, mango, mangosteen, jackfruit, and pineapple with the Chinese market by managing the crucial points of export operations from orchard selection and temperature control to delivery coordination.",
    overviewHighlights: [
      "Strong sourcing at origin",
      "Freshness protected in transit",
      "Destination market coordination in China",
    ],
  },
  zh: {
    heroTitle: ["直送高品质鲜果", "稳定进入中国市场"],
    heroBody:
      "亚洲海外贸易通过严谨的甄选、品控与出口运输体系，把来自泰国及周边地区的优质水果稳定送往中国市场。",
    primaryCta: "查看产品",
    secondaryCta: "关于我们",
    categoriesTitle: "产品分类",
    overviewKicker: "公司资料",
    overviewTitle: "始于对热带水果品质的深入理解",
    overviewBody:
      "我们成立的初衷，是将榴莲、椰子、芒果、山竹、菠萝蜜与菠萝稳定带入中国市场，并管理จาก果园选择、温控安排到交付协调的每一个关键节点。",
    overviewHighlights: ["优质产地甄选", "运输过程中的新鲜保障", "中国市场端协调"],
  },
};

type HomePageProps = {
  searchParams: Promise<{ lang?: string }>;
};

const getHomeData = unstable_cache(
  async () => {
    const [{ data: pageData }, { data: dbProducts }] = await Promise.all([
      supabase.from('page_content').select('content').eq('page_name', 'home').single(),
      supabase.from('products').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
    ]);
    return { pageData, dbProducts };
  },
  ['home-data'],
  { revalidate: 3600 }
);

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const lang = resolveLocale(resolvedSearchParams.lang);
  const navigation = navigationByLocale[lang];
  const brand = brandByLocale[lang];

  const { pageData, dbProducts } = await getHomeData();

  const dbContent = pageData?.content || {};
  const langCopy = dbContent[lang] || {};
  const defaultCopy = copyByLocale[lang];

  // Deep merge copy
  const copy = {
    ...defaultCopy,
    ...langCopy,
    heroTitle: langCopy.heroTitle || defaultCopy.heroTitle,
    overviewHighlights: langCopy.overviewHighlights || defaultCopy.overviewHighlights,
    overviewDetails: langCopy.overviewDetails,
  };
  
  const images = dbContent.images || { hero: heroImage, overview: introImage };
  const categoriesTitle = copy.categoriesTitle || defaultCopy.categoriesTitle;

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
        <SiteHeader activeHref="/" brand={brand} currentLocale={lang} navigation={navigation} />

        <section className="relative h-screen min-h-[600px] overflow-hidden bg-[var(--brand-primary)]">
          <div className="absolute inset-0">
            <Image 
              src={images.hero} 
              alt="Hero background" 
              fill 
              priority 
              sizes="100vw" 
              className="object-cover" 
              loading="eager"
              quality={90}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,18,30,0.8)_0%,rgba(5,18,30,0.4)_45%,rgba(5,18,30,0.1)_100%)]" />
          </div>

          <div className="relative z-10 mx-auto flex h-full w-full max-w-screen-2xl items-center px-6 py-16 sm:px-10 xl:px-12">
            <div className="max-w-4xl reveal w-full mt-20">
              <h1 className="font-[family-name:var(--font-montserrat)] text-[2.5rem] sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-[-0.02em] text-white">
                {(copy.heroTitle || []).map((line: string, i: number) => (
                  <span key={line} className={`block ${i === 0 ? "mb-1" : ""} md:whitespace-nowrap`}>
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-[1.8] text-white/84 sm:text-lg reveal-delayed-1">
                {copy.heroBody}
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row reveal-delayed-2">
                <Link
                  href={withLang("/products", lang)}
                  className="inline-flex min-w-[10rem] items-center justify-center rounded-xl border-2 border-white bg-white px-8 py-4 text-center font-[family-name:var(--font-montserrat)] text-base font-bold text-[var(--brand-primary)] transition duration-300 hover:bg-transparent hover:text-white sm:rounded-md"
                >
                  {copy.primaryCta}
                </Link>
                <Link
                  href={withLang("/about", lang)}
                  className="inline-flex min-w-[10rem] items-center justify-center rounded-xl border-2 border-white bg-transparent px-8 py-4 text-center font-[family-name:var(--font-montserrat)] text-base font-bold text-white transition duration-300 hover:bg-white hover:text-[var(--brand-primary)] sm:rounded-md"
                >
                  {copy.secondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-12 md:py-24 sm:px-6 md:px-8 lg:px-10 lg:py-24 xl:px-12">
          <div className="mx-auto max-w-screen-2xl text-center">
            <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold tracking-[-0.02em] text-[var(--brand-primary)] md:text-5xl mb-12">
              {categoriesTitle}
            </h2>

            <ProductCategoriesHome categories={categories} locale={lang} />
          </div>
        </section>

        <OverviewSection locale={lang} copy={copy} introImage={images.overview} />

        <SiteFooter locale={lang} />
      </main>
    </>
  );
}
