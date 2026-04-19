import Image from "next/image";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  brandByLocale,
  type Locale,
  navigationByLocale,
  resolveLocale,
  withLang,
} from "@/lib/locale";

const aboutHeroImage = "/images/pc.png";
const storyImage = "/images/hero-about.jpg";

type Leader = {
  name: string;
  role: string;
  quote: string;
  image: string;
};

type AboutCopy = {
  heroKicker: string;
  heroTitle: string[];
  heroBody: string;
  storyLabel: string;
  storyTitle: string;
  storyBody: string;
  storySideTitle: string;
  storySideBody: string;
  missionTitle: string;
  missionBody: string;
  missionCta: string;
  sustainabilityTitle: string;
  sustainabilityBody: string;
  statsLeft: string;
  statsLeftLabel: string;
  statsRight: string;
  statsRightLabel: string;
  leadersTitle: string;
  leadersBody: string;
  leadersCta: string;
};

type StrengthCard = {
  title: string;
  body: string;
};

type StrengthSection = {
  kicker: string;
  title: string[];
  body: string;
  cards: StrengthCard[];
};

const leadersByLocale: Record<Locale, Leader[]> = {
  th: [
    { name: "ทีมคัดสรรสินค้า", role: "ดูแลคุณภาพจากต้นทาง", quote: "คุณภาพที่ดีเริ่มจากการเลือกแหล่งปลูกที่ดีที่สุด", image: "/images/team-sourcing-new.jpg" },
    { name: "ทีมโลจิสติกส์", role: "ควบคุมอุณหภูมิและเส้นทางขนส่ง", quote: "ความสดต้องได้รับการดูแลตลอดทั้งเส้นทาง ไม่ใช่เฉพาะต้นทาง", image: "/images/team-logistics-port.jpg" },
    { name: "ทีมตลาดส่งออก", role: "ประสานงานคู่ค้าและตลาดปลายทาง", quote: "ความเชื่อมั่นของคู่ค้าคือรากฐานของการเติบโตอย่างยั่งยืน", image: "/images/marketing-world-map.png" },
  ],
  en: [
    { name: "Sourcing Team", role: "Origin Quality Control", quote: "Great quality begins with selecting the best orchards.", image: "/images/team-sourcing-new.jpg" },
    { name: "Transportation Team", role: "Temperature and Route Management", quote: "Freshness must be protected throughout the journey, not only at origin.", image: "/images/team-logistics-port.jpg" },
    { name: "Export Market Team", role: "Partner and Destination Coordination", quote: "Partner trust is the foundation of sustainable growth.", image: "/images/marketing-world-map.png" },
  ],
  zh: [
    { name: "采购团队", role: "产地质量控制", quote: "优质的品质始于对最佳果园的选择。", image: "/images/team-sourcing-new.jpg" },
    { name: "运输团队", role: "温控与航线管理", quote: "新鲜度必须在整个旅程中得到保护，而不仅仅是在产地。", image: "/images/team-logistics-port.jpg" },
    { name: "出口市场团队", role: "合作伙伴与目的地协调", quote: "合作伙伴的信任是可持续增长的基石。", image: "/images/marketing-world-map.png" },
  ],
};

const aboutCopy: Record<Locale, AboutCopy> = {
  th: {
    heroKicker: "เรื่องราวของเรา",
    heroTitle: ["รากฐานของคุณภาพ", "ความสดและความไว้วางใจ"],
    heroBody: "เอเชียน โอเวอร์ซี เทรดดิ้ง เชื่อมโยงผลไม้พรีเมียมจากไทยและภูมิภาคใกล้เคียงสู่ตลาดจีน ด้วยระบบคัดสรร ควบคุมคุณภาพ และขนส่งที่ออกแบบมาเพื่อการส่งออกโดยเฉพาะ",
    storyLabel: "Legacy of Precision",
    storyTitle: "เชื่อมโยงแหล่งปลูกคุณภาพ สู่ตลาดปลายทางอย่างมั่นใจ",
    storyBody: "เรารวบรวมความเชี่ยวชาญด้านการคัดสรรสินค้า การควบคุมอุณหภูมิ การวางแผนขนส่ง และการประสานงานตลาดปลายทาง เพื่อให้ผลไม้ทุกล็อตยังคงความสด รสชาติดี และพร้อมแข่งขันในตลาดจีน",
    storySideTitle: "แนวคิดของเรา",
    storySideBody: "คุณภาพ ความต่อเนื่อง และความไว้วางใจ คือหัวใจของการดำเนินงาน ตั้งแต่ต้นทางจนถึงปลายทาง",
    missionTitle: "พันธกิจของเรา",
    missionBody: "มุ่งสู่การเป็นผู้นำอันดับหนึ่งในใจผู้บริโภคชาวจีน สำหรับการส่งมอบผลไม้สดคุณภาพพรีเมียมจากเอเชียตะวันออกเฉียงใต้ ด้วยนวัตกรรมการขนส่งที่ทันสมัยและความซื่อสัตย์ต่อคู่ค้า",
    missionCta: "เรียนรู้แนวทางการดำเนินงาน",
    sustainabilityTitle: "ความยั่งยืน",
    sustainabilityBody: "เราให้ความสำคัญกับการคัดสรรสินค้าจากแหล่งปลูกคุณภาพ การพัฒนาความร่วมมือกับเกษตรกร และการขนส่งที่ช่วยรักษาความสด ลดความเสียหาย และเพิ่มคุณค่าให้สินค้าในระยะยาว",
    statsLeft: "4",
    statsLeftLabel: "พันธกิจหลัก",
    statsRight: "6",
    statsRightLabel: "ตลาดปลายทางสำคัญ",
    leadersTitle: "ทีมงานที่ขับเคลื่อนองค์กร",
    leadersBody: "ทีมคัดสรรสินค้า ทีมโลจิสติกส์ และทีมตลาดส่งออก ทำงานร่วมกันเพื่อให้ทุกคำสั่งซื้อเป็นไปตามมาตรฐานเดียวกัน",
    leadersCta: "ดูข้อมูลเพิ่มเติม",
  },
  en: {
    heroKicker: "Our Story",
    heroTitle: ["The Foundation of Quality", "Freshness and Trust"],
    heroBody: "Asian Overseas Trading connects premium tropical fruit to Chinese markets with outstanding quality, stable freshness, and dependable operations.",
    storyLabel: "Legacy of Precision",
    storyTitle: "Connecting quality origins to destination markets with confidence",
    storyBody: "We bring together sourcing expertise, temperature control, transportation planning, and destination-market coordination so every shipment reaches China with the standard it started with.",
    storySideTitle: "Our Perspective",
    storySideBody: "Quality, consistency, and trust shape the way we manage every export step from origin to destination.",
    missionTitle: "Our Mission",
    missionBody: "To become the top choice in the hearts of Chinese consumers for premium fresh fruit from Southeast Asia, backed by advanced transportation innovation and integrity with our partners.",
    missionCta: "Explore Our Approach",
    sustainabilityTitle: "Sustainability",
    sustainabilityBody: "We value strong growing sources, collaboration with farmers, and transportation systems that preserve freshness, reduce damage, and create long-term value.",
    statsLeft: "4",
    statsLeftLabel: "Core Missions",
    statsRight: "6",
    statsRightLabel: "Key Markets",
    leadersTitle: "The Teams Behind Our Growth",
    leadersBody: "Our sourcing, transportation, and export market teams work together to keep every order aligned with the same standard.",
    leadersCta: "Learn More",
  },
  zh: {
    heroKicker: "我们的故事",
    heroTitle: ["品质基石", "新鲜与信任"],
    heroBody: "亚洲海外贸易连接泰国优质热带水果与中国市场，确保卓越品质、稳定新鲜度与可靠运营。",
    storyLabel: "Legacy of Precision",
    storyTitle: "以信心连接优质产地与目的地市场",
    storyBody: "我们汇集了采购专业知识、温度控制、运输规划和目的地市场协调，确保每批货物都能以初始标准抵达中国。",
    storySideTitle: "我们的视角",
    storySideBody: "品质、一致性和信任塑造了我们管理从产地到目的地的每一个出口步骤的方式。",
    missionTitle: "我们的使命",
    missionBody: "成为中国消费者心中东南亚优质鲜果的首选，以先进的运输创新和对合作伙伴的诚信为后盾。",
    missionCta: "探索我们的方法",
    sustainabilityTitle: "可持续性",
    sustainabilityBody: "我们重视强大的种植源头、与农民的合作以及保持新鲜、减少损坏并创造长期价值的运输系统。",
    statsLeft: "4",
    statsLeftLabel: "核心任务",
    statsRight: "6",
    statsRightLabel: "关键市场",
    leadersTitle: "我们增长背后的团队",
    leadersBody: "我们的采购、运输和出口市场团队共同努力，保持每一份订单都符合相同的标准。",
    leadersCta: "了解更多",
  }
};

const getAboutData = unstable_cache(
  async () => {
    const { data: pageData } = await supabase
      .from("page_content")
      .select("content")
      .eq("page_name", "about")
      .maybeSingle();

    return pageData;
  },
  ["about-page-data"],
  { revalidate: 300 }
);

type AboutProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function AboutPage({ searchParams }: AboutProps) {
  const resolvedSearchParams = await searchParams;
  const lang = resolveLocale(resolvedSearchParams.lang);
  const pageData = await getAboutData();

  const dbContent = pageData?.content || {};
  const dbLangContent = dbContent[lang] || {};
  const defaultCopy = aboutCopy[lang];

  // 2. Merge Data
  const copy = {
    ...defaultCopy,
    ...dbLangContent,
    heroTitle: dbLangContent.heroTitle || defaultCopy.heroTitle,
  };

  const navigation = navigationByLocale[lang];
  const leaders = dbLangContent.leaders || leadersByLocale[lang];
  const brand = brandByLocale[lang];
  const images = {
    hero: dbContent.images?.hero || aboutHeroImage,
    story: dbContent.images?.story || storyImage,
  };
  
  const movedStrengthSection: StrengthSection = {
    th: {
      kicker: "จุดแข็งหลักของเรา",
      title: ["โครงสร้างการส่งออกที่เรียบง่าย แต่", "แม่นยำ"],
      body: "เราออกแบบการทำงานให้ทุกขั้นตอนเชื่อมต่อกันตั้งแต่ต้นทางถึงปลายทาง เพื่อให้สินค้าไปถึงตลาดด้วยคุณภาพ ความสด และความเชื่อมั่นที่สม่ำเสมอ",
      cards: [
        { title: "การคัดสรรชั้นเลิศ", body: "คัดเลือกผลไม้จากสวนและแหล่งปลูกที่เหมาะกับตลาดส่งออกอย่างเข้มงวด" },
        { title: "ระบบขนส่งที่แม่นยำ", body: "จัดเส้นทาง เวลา และรูปแบบการขนส่งให้เหมาะกับสินค้าแต่ละชนิด" },
        { title: "ความร่วมมือที่ไว้วางใจได้", body: "ประสานงานกับคู่ค้า ตลาดปลายทาง และทีมขนส่งอย่างต่อเนื่อง" },
        { title: "มองระยะยาว", body: "พัฒนาความสัมพันธ์กับเกษตรกรและคู่ค้าเพื่อสร้างความยั่งยืนให้ธุรกิจ" },
      ],
    },
    en: {
      kicker: "Core Strengths",
      title: ["An export structure that stays simple", "yet precise"],
      body: "We design every step to stay connected from origin to destination so products arrive with stable quality, freshness, and confidence.",
      cards: [
        { title: "Premium Sourcing", body: "We select fruit from orchards and producing areas that fit export expectations." },
        { title: "Precise Transportation", body: "Routes, timing, and shipment formats are planned to match each product category." },
        { title: "Trusted Coordination", body: "We work continuously with partners, destination markets, and transportation teams." },
        { title: "Long-Term Thinking", body: "We build durable relationships with growers and partners for lasting export stability." },
      ],
    },
    zh: {
      kicker: "核心优势",
      title: ["简洁而精准的出口结构", "持续稳定运营"],
      body: "我们将每个步骤规划为从产地到目的地的无缝衔接，确保产品以稳定的品质、新鲜度和信心到达市场。",
      cards: [
        { title: "精选采购", body: "严格甄选适合出口市场的果园与产地水果。" },
        { title: "精准运输", body: "根据每个产品类别规划路线、时机和发运方式。" },
        { title: "可靠协调", body: "与合作伙伴、目的地市场和运输团队持续合作。" },
        { title: "长远思维", body: "与种植户和合作伙伴建立持久关系，实现稳定出口。" },
      ],
    },
  }[lang];

  const strengthSection = {
    kicker: dbLangContent.strengthKicker || movedStrengthSection.kicker,
    title: dbLangContent.strengthTitle || movedStrengthSection.title,
    body: dbLangContent.strengthBody || movedStrengthSection.body,
    cards: dbLangContent.strengthCards || movedStrengthSection.cards,
  };

  return (
    <main className="bg-[var(--brand-bg)] font-[family-name:var(--font-open-sans)] text-[var(--brand-text)] transition-colors duration-500">
      <SiteHeader activeHref="/about" brand={brand} currentLocale={lang} navigation={navigation} />

      <section className="relative h-screen min-h-[600px] overflow-hidden bg-[var(--brand-primary)]">
        <div className="absolute inset-0">
          <Image src={images.hero} alt={copy.heroTitle.join(" ")} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.64)_0%,rgba(0,0,0,0.32)_38%,rgba(0,0,0,0.08)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-screen-2xl items-center px-4 py-12 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="max-w-4xl reveal mt-20">
            <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold leading-[1.1] tracking-[-0.018em] text-white md:text-7xl">
              {(copy.heroTitle || []).map((line: string) => (
                <span key={line} className="block md:whitespace-nowrap">{line}</span>
              ))}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-[1.7] text-white/84 md:text-lg reveal-delayed-1">{copy.heroBody}</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 md:py-24 sm:px-6 md:px-8 lg:px-10 lg:py-28 xl:px-12">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 md:grid-cols-12 md:items-center md:gap-16">
          <div className="group relative md:col-span-5">
            <div className="aspect-[4/5] overflow-hidden bg-[#e8ecdf] shadow-[24px_24px_60px_rgba(0,37,72,0.08)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[28px_28px_70px_rgba(0,37,72,0.14)]">
              <Image src={images.story} alt="Durian inspection at origin" fill sizes="(max-width: 768px) 100vw, 42vw" className="object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-[#95bb72]/15 blur-3xl" />
          </div>

          <div className="space-y-8 md:col-span-7 reveal">
            <div className="inline-flex bg-[var(--brand-bg)] px-4 py-1 text-[0.68rem] font-bold uppercase tracking-[0.26em] text-[#6f9152]">{copy.storyLabel}</div>
            <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold leading-[1.02] tracking-[-0.02em] text-[var(--brand-primary)] md:text-5xl lg:text-6xl">{copy.storyTitle}</h2>
            <p className="max-w-3xl text-base leading-[1.7] text-slate-600 md:text-lg">{copy.storyBody}</p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-bg)] px-4 pb-20 pt-12 sm:px-6 sm:pt-14 md:px-8 lg:px-10 lg:pb-28 lg:pt-16 xl:px-12">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="bg-white p-8 shadow-sm sm:p-10 lg:col-span-7 lg:p-14">
            <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold text-[var(--brand-primary)] md:text-5xl">{copy.missionTitle}</h2>
            <p className="mt-6 text-base leading-[1.7] text-slate-600 md:text-lg">{copy.missionBody}</p>
            <Link href={withLang("/products", lang)} className="mt-8 inline-flex items-center gap-3 border-b-2 border-[#002548]/15 pb-1 font-[family-name:var(--font-montserrat)] text-base font-medium tracking-[0.12em] text-[var(--brand-primary)] transition hover:border-[#002548]">
              {copy.missionCta} <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="relative overflow-hidden bg-[var(--brand-bg)] p-8 sm:p-10 lg:col-span-5 lg:p-14">
            <div className="relative z-10">
              <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold text-[var(--brand-primary)] md:text-5xl">{copy.sustainabilityTitle}</h2>
              <p className="mt-6 text-base leading-[1.7] text-slate-600 md:text-lg">{copy.sustainabilityBody}</p>
            </div>
            <div className="pointer-events-none absolute -bottom-8 -right-4 font-[family-name:var(--font-montserrat)] text-[9rem] font-extrabold leading-none text-[#e8edde] sm:text-[11rem] lg:text-[16rem]">A</div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-primary)] px-4 py-24 text-white transition-colors duration-500">
        <div className="mx-auto max-w-screen-2xl">
          <div className="max-w-3xl">
            <span className="text-sm text-[#d8e3c4]">{strengthSection.kicker}</span>
            <h2 className="mt-3 font-[family-name:var(--font-montserrat)] text-3xl font-semibold leading-[1.02] tracking-[-0.02em] md:text-5xl">
              {(strengthSection.title || []).map((line: string) => (
                <span key={line} className="block">{line}</span>
              ))}
            </h2>
            <p className="mt-5 text-base leading-[1.7] text-white/78 md:text-lg">{strengthSection.body}</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {(strengthSection.cards || []).map((item: StrengthCard, index: number) => (
              <article key={index} className="rounded-[1.75rem] border border-white/10 bg-white/8 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/12">
                <div className="mb-5 h-2 w-14 rounded-full bg-[#d8c196]" />
                <h3 className="font-[family-name:var(--font-montserrat)] text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-base leading-[1.7] text-white/75">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-24 xl:px-12">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-14">
            <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold tracking-[-0.02em] text-[var(--brand-primary)] md:text-5xl">{copy.leadersTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-[1.7] text-slate-500 md:text-lg">{copy.leadersBody}</p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {leaders.map((leader: Leader) => (
              <article key={leader.name} className="group">
                <div className="relative mb-6 aspect-[3/4] overflow-hidden bg-[var(--brand-bg)] rounded-2xl shadow-lg">
                  <Image src={leader.image} alt={leader.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <h3 className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-[var(--brand-primary)]">{leader.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">{leader.role}</p>
                <p className="mt-4 text-sm italic leading-6 text-slate-500">&ldquo;{leader.quote}&rdquo;</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter locale={lang} />
    </main>
  );
}
