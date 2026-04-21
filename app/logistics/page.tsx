import Image from "next/image";
import Link from "next/link";
import { unstable_cache } from "next/cache";

import { HeroBackgroundVideo } from "@/components/hero-background-video";
import { LogisticsChinaMapClient as LogisticsChinaMap } from "@/components/logistics-china-map-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  brandByLocale,
  type Locale,
  navigationByLocale,
  resolveLocale,
  withLang,
} from "@/lib/locale";
import { supabase } from "@/lib/supabase";

const heroVideo = "/videos/logistics-hero-ship.mp4";
const heroPoster = "/images/hero-logistics.jpg";

const logisticsImages = {
  route: "/images/logistics-route.jpg",
  packaging: "/images/team-logistics.jpg",
  loading: "/images/logistics-loading-1.jpg",
};

type MapLabelKey =
  | "origin"
  | "guangzhou"
  | "henan"
  | "beijing"
  | "qingchong"
  | "linyi"
  | "changsha";


const destinationHeadingByLocale = {
  th: "มณฑลและตลาดส่งออกหลัก",
  en: "Primary China destinations",
  zh: "重点出口目的地",
} as const;

const countryLabelsByLocale = {
  th: { china: "จีน", thailand: "ไทย" },
  en: { china: "China", thailand: "Thailand" },
  zh: { china: "中国", thailand: "泰国" },
} as const;

// Geographic coordinates [lon, lat] for each destination in order
const DESTINATION_COORDS: [number, number][] = [
  [113.25, 23.13],  // Guangzhou
  [113.65, 34.76],  // Henan (Zhengzhou)
  [116.41, 39.90],  // Beijing
  [106.55, 29.56],  // Qingchong (Chongqing/Sichuan area)
  [118.35, 35.10],  // Linyi, Shandong
  [112.98, 28.23],  // Changsha, Hunan
];

type LogisticsCopy = {
  heroTitle: string[];
  heroBody: string;
  primaryCta: string;
  secondaryCta: string;
  destinationHeading?: string;
  countryLabels?: { china: string; thailand: string };
  supportTitle: string;
  supportBody: string;
  supportPoints: string[];
  mapKicker: string;
  mapTitle: string;
  mapBody: string;
  mapOriginLabel: string;
  mapLabels: Record<MapLabelKey, string>;
  destinations: { city: string; market: string }[];
  processTitle: string;
  processBody: string;
  processSteps: { title: string; body: string }[];
  featureTitle: string;
  featureBody: string;
  features: { title: string; body: string }[];
  ctaTitle: string;
  ctaBody: string;
};

const copyByLocale: Record<Locale, LogisticsCopy> = {
  th: {
    heroTitle: ["โลจิสติกส์ที่แม่นยำ", "เพื่อสินค้าส่งออก"],
    heroBody:
      "เราบริหารการขนส่งผลไม้และสินค้าเกษตรด้วยระบบที่เน้นความปลอดภัย ความรวดเร็ว และความตรงเวลา เพื่อให้สินค้าไปถึงตลาดจีนในสภาพพร้อมจำหน่าย",
    primaryCta: "ขอคำปรึกษา",
    secondaryCta: "สอบถามบริการ",
    supportTitle: "ระบบขนส่งที่เชื่อมตั้งแต่ต้นทางถึงปลายทาง",
    supportBody:
      "นอกจากการคัดสรรสินค้า เรายังดูแลเรื่องการจัดเตรียมลอต การแพ็ก การขนถ่าย การควบคุมสภาพสินค้า และการเชื่อมต่อเข้าสู่ตลาดค้าส่งปลายทาง เพื่อให้ทุกลอตเดินทางได้ต่อเนื่อง",
    supportPoints: [
      "ควบคุมสภาพสินค้าและจังหวะการเดินทางให้เหมาะกับผลไม้แต่ละชนิด",
      "ออกแบบเส้นทางส่งออกให้สอดคล้องกับตลาดปลายทางหลักในจีน",
      "ประสานงานการขนส่ง การโหลด และการรับปลายทางให้เป็นระบบเดียวกัน",
    ],
    mapKicker: "Transportation Network",
    mapTitle: "เส้นทางปลายทางหลักของการส่งออก",
    mapBody:
      "เครือข่ายการจัดส่งของเราเชื่อมจากประเทศไทยไปยังตลาดค้าส่งสำคัญในจีนอย่างเป็นระบบ เพื่อรองรับการกระจายผลไม้สดและสินค้าเกษตรให้ถึงปลายทางอย่างต่อเนื่อง",
    mapOriginLabel: "THAILAND\nExport Origin",
    mapLabels: {
      origin: "ไทย",
      guangzhou: "กวางโจว",
      henan: "เหอหนาน",
      beijing: "ปักกิ่ง",
      qingchong: "ชิงฉงซวนฟู",
      linyi: "ลินอี้",
      changsha: "ฉางชา",
    },
    destinations: [
      { city: "กวางโจว", market: "ตลาดเจียงหนาน" },
      { city: "มณฑลเหอหนาน", market: "ตลาดเหอหนานวานบัง" },
      { city: "กรุงปักกิ่ง", market: "ตลาดเกาเพ่ยเตี้ยน" },
      { city: "ชิงฉงซวนฟู", market: "ตลาดเกษตรกรรมนานาชาติ" },
      { city: "ลินอี้", market: "ในมณฑลซานตง" },
      { city: "ฉางชา", market: "ในมณฑลหูหนาน" },
    ],
    processTitle: "ขั้นตอนการขนถ่ายและจัดส่ง",
    processBody:
      "ทุกขั้นตอนของโลจิสติกส์ถูกจัดให้ชัดเจน เพื่อช่วยรักษาความสด ลดความเสี่ยง และทำให้การเข้าสู่ตลาดปลายทางเกิดขึ้นได้ตามแผน",
    processSteps: [
      {
        title: "จัดเตรียมลอตสินค้า",
        body: "คัดลอตและวางแผนการบรรจุให้เหมาะกับจำนวนสินค้าและตลาดปลายทาง",
      },
      {
        title: "แพ็กและขนถ่าย",
        body: "ควบคุมการแพ็ก การจัดเรียง และการโหลดสินค้าให้พร้อมสำหรับการส่งออก",
      },
      {
        title: "ส่งต่อสู่ตลาดปลายทาง",
        body: "ดูแลการกระจายลอตไปยังตลาดค้าส่งสำคัญเพื่อให้การส่งมอบเป็นไปอย่างต่อเนื่อง",
      },
    ],
    featureTitle: "สิ่งที่ทีมโลจิสติกส์ของเราดูแล",
    featureBody:
      "ทีมของเราทำงานครอบคลุมตั้งแต่การวางแผนเส้นทาง การดูแลการขนส่ง ไปจนถึงการประสานงานปลายทาง เพื่อให้ผลไม้ยังคงคุณภาพเมื่อถึงตลาดจีน",
    features: [
      {
        title: "วางแผนเส้นทาง",
        body: "กำหนดเส้นทางและจังหวะการจัดส่งให้เหมาะกับประเภทสินค้าและหน้าต่างของตลาด",
      },
      {
        title: "ระบบแพ็กกิ้ง",
        body: "จัดรูปแบบบรรจุและการเรียงลอตเพื่อลดความเสียหายระหว่างการขนย้าย",
      },
      {
        title: "ควบคุมการโหลด",
        body: "ดูแลการยก ขนย้าย และโหลดสินค้าให้เป็นไปตามมาตรฐานการส่งออก",
      },
      {
        title: "เชื่อมต่อตลาดปลายทาง",
        body: "ประสานปลายทางและตลาดหลักเพื่อให้การรับสินค้าและกระจายลอตเป็นไปอย่างราบรื่น",
      },
    ],
    ctaTitle: "พร้อมวางแผนระบบขนส่งที่เหมาะกับสินค้าของคุณ",
    ctaBody:
      "เราช่วยออกแบบเส้นทาง เวลา และรูปแบบการจัดส่งให้สอดคล้องกับประเภทสินค้า ปริมาณ และตลาดปลายทางของคุณ",
  },
  en: {
    heroTitle: ["Precise Logistics", "for Export Goods"],
    heroBody:
      "We manage fruit and agricultural transportation through systems built around safety, speed, and on-time delivery so products reach China in ready-to-sell condition.",
    primaryCta: "Get Consultation",
    secondaryCta: "Request Service Info",
    supportTitle: "A transportation system that links origin to destination",
    supportBody:
      "Beyond product sourcing, we manage lot preparation, packing, handling, condition control, and destination-market coordination so every shipment moves with continuity.",
    supportPoints: [
      "Travel conditions are matched with the needs of each fruit category",
      "Export routes are aligned with key destination markets in China",
      "Handling, loading, and destination coordination are managed as one system",
    ],
    mapKicker: "Transportation Network",
    mapTitle: "Key Destination Routes for Export",
    mapBody:
      "Our transportation network connects Thailand with major wholesale destinations in China, supporting steady fruit distribution and clearer market-entry planning.",
    mapOriginLabel: "THAILAND\nExport Origin",
    mapLabels: {
      origin: "Thailand",
      guangzhou: "Guangzhou",
      henan: "Henan",
      beijing: "Beijing",
      qingchong: "Qingchong",
      linyi: "Linyi",
      changsha: "Changsha",
    },
    destinations: [
      { city: "Guangzhou", market: "Jiangnan Market" },
      { city: "Henan", market: "Henan Wanbang Market" },
      { city: "Beijing", market: "Gaobeidian Market" },
      { city: "Qingchongxuanfu", market: "International Agricultural Market" },
      { city: "Linyi", market: "Shandong Province" },
      { city: "Changsha", market: "Hunan Province" },
    ],
    processTitle: "Handling and Delivery Stages",
    processBody:
      "Each logistics stage is structured to protect freshness, reduce risk, and help products enter destination markets according to plan.",
    processSteps: [
      {
        title: "Lot Preparation",
        body: "Shipment lots are planned according to quantity, format, and destination requirements.",
      },
      {
        title: "Packing and Loading",
        body: "Packing, arrangement, and loading are managed to support real export operations.",
      },
      {
        title: "Destination Distribution",
        body: "Lots are directed into major wholesale destinations to keep market-entry flow steady.",
      },
    ],
    featureTitle: "What our logistics team manages",
    featureBody:
      "Our team covers route planning, transportation handling, and destination coordination so fruit quality is preserved when shipments arrive in China.",
    features: [
      {
        title: "Route Planning",
        body: "Delivery rhythm is aligned with product type and destination-market timing.",
      },
      {
        title: "Packing System",
        body: "Lot arrangement and packaging formats are built to reduce handling risk.",
      },
      {
        title: "Loading Control",
        body: "Loading and handling activities follow a structured export standard.",
      },
      {
        title: "Destination Coordination",
        body: "We support market-side receiving and lot distribution with continuous coordination.",
      },
    ],
    ctaTitle: "Ready to build the right transportation plan for your goods",
    ctaBody:
      "We help design routes, timing, and shipment formats that fit your product type, shipment volume, and destination market.",
  },
  zh: {
    heroTitle: ["精准物流体系", "服务出口货品"],
    heroBody:
      "我们以重视安全、速度与准时性的物流体系管理水果与农产品运输，确保货品抵达中国市场时保持适合销售的状态。",
    primaryCta: "获取咨询",
    secondaryCta: "咨询服务",
    supportTitle: "连接产地与终端市场的运输体系",
    supportBody:
      "除了选品之外，我们也负责批次准备、包装、装卸、货况控制以及与终端批发市场的衔接，确保每一批货都能稳定连续地运输。",
    supportPoints: [
      "根据不同水果品类匹配合适的运输条件",
      "围绕中国重点市场规划出口路线",
      "把装卸、运输与目的地衔接整合到同一体系中",
    ],
    mapKicker: "运输网络",
    mapTitle: "重点出口目的地路线",
    mapBody:
      "我们的运输网络从泰国连接到中国多个主要批发市场，帮助水果与农产品更稳定地进入终端销售渠道。",
    mapOriginLabel: "THAILAND\n出口起点",
    mapLabels: {
      origin: "泰国",
      guangzhou: "广州",
      henan: "河南",
      beijing: "北京",
      qingchong: "青崇",
      linyi: "临沂",
      changsha: "长沙",
    },
    destinations: [
      { city: "广州", market: "江南市场" },
      { city: "河南", market: "万邦市场" },
      { city: "北京", market: "高碑店市场" },
      { city: "青崇宣富", market: "国际农产品市场" },
      { city: "临沂", market: "山东省" },
      { city: "长沙", market: "湖南省" },
    ],
    processTitle: "装卸与发运阶段",
    processBody:
      "每个物流环节都围绕保鲜、降风险与稳定进入市场而设计，帮助产品按计划抵达终端市场。",
    processSteps: [
      {
        title: "批次准备",
        body: "依据数量、包装形式与目的地要求规划每一批出口货品。",
      },
      {
        title: "包装与装载",
        body: "按照出口标准管理包装、排货与装载过程。",
      },
      {
        title: "终端分发",
        body: "将货品稳定导入重点批发市场，保持市场进入节奏。",
      },
    ],
    featureTitle: "物流团队负责的重点",
    featureBody:
      "我们的团队覆盖路线规划、运输处理与终端协调，确保水果进入中国市场时仍保持良好状态。",
    features: [
      {
        title: "路线规划",
        body: "根据产品类型与市场节奏安排运输路径和发运时间。",
      },
      {
        title: "包装体系",
        body: "通过合理包装和批次编排降低搬运风险。",
      },
      {
        title: "装载控制",
        body: "装货、搬运与交接过程遵循出口标准执行。",
      },
      {
        title: "终端衔接",
        body: "持续协调市场端接收与批次分发安排。",
      },
    ],
    ctaTitle: "为您的货品规划更合适的运输方案",
    ctaBody:
      "我们可依据产品类别、出货数量与目标市场，设计更匹配的运输路线与节奏。",
  },
};

const heroPrimaryCtaByLocale: Record<Locale, string> = {
  th: "ขอคำปรึกษา",
  en: "Get Consultation",
  zh: "获取咨询",
};

const heroSecondaryCtaByLocale: Record<Locale, string> = {
  th: "ดูเส้นทางขนส่ง",
  en: "View Delivery Network",
  zh: "查看运输网络",
};

type LogisticsProps = {
  searchParams: Promise<{ lang?: string }>;
};

const getLogisticsData = unstable_cache(
  async () => {
    const { data } = await supabase
      .from("page_content")
      .select("content")
      .eq("page_name", "logistics")
      .maybeSingle();

    return data;
  },
  ["logistics-page-data"],
  { revalidate: 300 },
);

export default async function LogisticsPage({ searchParams }: LogisticsProps) {
  const resolvedSearchParams = await searchParams;
  const lang = resolveLocale(resolvedSearchParams.lang);
  const navigation = navigationByLocale[lang];
  const brand = brandByLocale[lang];
  const pageData = await getLogisticsData();
  const dbContent = pageData?.content || {};
  const langContent = dbContent[lang] || {};
  const defaultCopy = copyByLocale[lang];
  const copy = {
    ...defaultCopy,
    ...langContent,
    heroTitle: langContent.heroTitle || defaultCopy.heroTitle,
    supportPoints: langContent.supportPoints || defaultCopy.supportPoints,
    destinations: langContent.destinations || defaultCopy.destinations,
    processSteps: langContent.processSteps || defaultCopy.processSteps,
    features: langContent.features || defaultCopy.features,
    destinationHeading: langContent.destinationHeading || destinationHeadingByLocale[lang],
    countryLabels: langContent.countryLabels || countryLabelsByLocale[lang],
  };
  const images = {
    heroVideo: dbContent.images?.heroVideo || heroVideo,
    heroPoster: dbContent.images?.heroPoster || heroPoster,
    route: dbContent.images?.route || logisticsImages.route,
    packaging: dbContent.images?.packaging || logisticsImages.packaging,
  };
  const heroPrimaryCta = heroPrimaryCtaByLocale[lang];
  const heroSecondaryCta = heroSecondaryCtaByLocale[lang];
  const destinationHeading = copy.destinationHeading;
  const mapDestinations = copy.destinations.map((dest: { city: string; market: string }, i: number) => ({
    city: dest.city,
    coords: DESTINATION_COORDS[i],
  }));
  const countryLabels = copy.countryLabels;

  return (
    <>
      <main className="bg-[var(--brand-bg)] font-[family-name:var(--font-open-sans)] text-[var(--brand-text)] transition-colors duration-500">
        <SiteHeader activeHref="/logistics" brand={brand} currentLocale={lang} navigation={navigation} />

        <section className="relative h-screen min-h-[600px] overflow-hidden bg-[var(--brand-primary)]">
            <div className="absolute inset-0">
              <HeroBackgroundVideo
              className="h-full w-full scale-[1.22] translate-y-[-2%] object-cover object-center"
              src={images.heroVideo}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.64)_0%,rgba(0,0,0,0.32)_38%,rgba(0,0,0,0.08)_100%)]" />
          </div>

          <div className="relative z-10 mx-auto flex h-full w-full max-w-screen-2xl items-center px-4 py-12 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <div className="max-w-4xl reveal mt-20">
              <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-7xl">
                {copy.heroTitle.map((line: string) => (
                  <span key={line} className="block md:whitespace-nowrap">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-[1.7] text-white/84 md:text-lg reveal-delayed-1">
                {copy.heroBody}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row reveal-delayed-2">
                <Link
                  href={`${withLang("/contact", lang)}#contact-form`}
                  className="inline-flex min-w-[9.5rem] items-center justify-center rounded-md border-2 border-white bg-white px-7 py-4 text-center font-[family-name:var(--font-montserrat)] text-base font-medium text-[var(--brand-primary)] transition duration-300 hover:-translate-y-0.5 hover:bg-transparent hover:text-white hover:shadow-md"
                >
                  {heroPrimaryCta}
                </Link>
                <Link
                  href="#delivery-network"
                  className="inline-flex min-w-[9.5rem] items-center justify-center rounded-md border-2 border-white bg-transparent px-7 py-4 text-center font-[family-name:var(--font-montserrat)] text-base font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[var(--brand-primary)] hover:shadow-md"
                >
                  {heroSecondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--brand-bg)] px-4 py-12 md:py-24 sm:px-6 md:px-8 lg:px-10 lg:py-24 xl:px-12">
          <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
            <div>
              <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold tracking-[-0.025em] text-[var(--brand-primary)] md:text-5xl">
                {copy.supportTitle}
              </h2>
              <p className="mt-6 text-base leading-[1.7] text-slate-600 md:text-lg">
                {copy.supportBody}
              </p>
              <ul className="mt-8 space-y-4">
                {copy.supportPoints.map((point: string) => (
                  <li key={point} className="flex items-start gap-4 text-base leading-[1.7] text-slate-600">
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#95bb72]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[#d9dfce] bg-white shadow-[0_18px_48px_rgba(0,37,72,0.08)]">
              <div className="relative min-h-[22rem] overflow-hidden bg-[#eef2e6] sm:min-h-[26rem] lg:min-h-[32rem]">
                <Image
                  src={images.route}
                  alt={copy.supportTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover object-center transition duration-700 hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="delivery-network" className="bg-white px-4 py-12 md:py-24 sm:px-6 md:px-8 lg:px-10 lg:py-28 xl:px-12">
          <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <LogisticsChinaMap
              destinations={mapDestinations}
              originLabel={copy.mapOriginLabel}
              countryLabels={countryLabels}
            />

            <div>
              <span className="inline-flex bg-[var(--brand-bg)] px-4 py-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#6f9152]">
                {copy.mapKicker}
              </span>
              <h2 className="mt-6 font-[family-name:var(--font-montserrat)] text-3xl font-semibold leading-[1.02] tracking-[-0.025em] text-[var(--brand-primary)] md:text-5xl lg:text-[3.4rem]">
                {copy.mapTitle}
              </h2>
              <p className="mt-6 text-base leading-[1.7] text-slate-600 md:text-lg">
                {copy.mapBody}
              </p>
              <div className="mt-8 rounded-[1.5rem] border border-[#d8dfce] bg-[#f7f8f2] p-6">
                <h3 className="font-[family-name:var(--font-montserrat)] text-lg font-semibold text-[var(--brand-primary)]">
                  {destinationHeading}
                </h3>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {copy.destinations.map((destination: { city: string; market: string }) => (
                    <li
                      key={`${destination.city}-${destination.market}`}
                      className="rounded-2xl border border-[#dbe4cf] bg-white px-4 py-3 text-sm leading-6 text-slate-600 shadow-[0_10px_22px_rgba(0,37,72,0.04)]"
                    >
                      <span className="block font-[family-name:var(--font-montserrat)] font-semibold text-[var(--brand-primary)]">
                        {destination.city}
                      </span>
                      <span className="block text-slate-500">{destination.market}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-12 md:py-24 sm:px-6 md:px-8 lg:px-10 lg:py-24 xl:px-12">
          <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <div className="overflow-hidden rounded-[2rem] border border-[#d9dfce] bg-white shadow-[0_18px_48px_rgba(0,37,72,0.08)]">
              <div className="relative min-h-[22rem] overflow-hidden bg-[#eef2e6] sm:min-h-[26rem] lg:min-h-[32rem]">
                <Image
                  src={images.packaging}
                  alt={copy.processTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold leading-[1.04] tracking-[-0.02em] text-[var(--brand-primary)] md:text-5xl">
                {copy.processTitle}
              </h2>
              <p className="mt-5 text-base leading-[1.7] text-slate-600 md:text-lg">{copy.processBody}</p>

              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {copy.processSteps.map((step: { title: string; body: string }, index: number) => (
                  <article key={step.title} className="rounded-[1.25rem] bg-[#f7f8f2] p-6 shadow-[0_10px_26px_rgba(0,37,72,0.05)]">
                    <span className="font-[family-name:var(--font-montserrat)] text-4xl font-semibold text-[#95bb72]">
                      0{index + 1}
                    </span>
                    <h3 className="mt-5 font-[family-name:var(--font-montserrat)] text-xl font-semibold text-[var(--brand-primary)]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-base leading-[1.7] text-slate-500">{step.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--brand-primary)] px-4 py-12 md:py-24 text-white sm:px-6 md:px-8 lg:px-10 lg:py-24 xl:px-12">
          <div className="mx-auto max-w-screen-2xl">
            <div className="mb-12 max-w-3xl">
              <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold tracking-[-0.025em] md:text-5xl">
                {copy.featureTitle}
              </h2>
              <p className="mt-4 text-base leading-[1.7] text-white/72 md:text-lg">{copy.featureBody}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {copy.features.map((feature: { title: string; body: string }, index: number) => (
                <article key={feature.title} className="rounded-[1.5rem] border border-white/10 bg-white/8 p-8">
                  <div className="mb-5 h-1 w-14 bg-[#f6d9a4]" />
                  <span className="font-[family-name:var(--font-montserrat)] text-sm font-medium tracking-[0.18em] text-white/45">
                    0{index + 1}
                  </span>
                  <h3 className="mt-4 font-[family-name:var(--font-montserrat)] text-2xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-base leading-[1.7] text-white/68">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-12 sm:px-6 md:px-8 lg:px-10 lg:py-14 xl:px-12">
          <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 rounded-[1.75rem] border border-[#d8dfce] bg-[#f7f8f2] px-6 py-8 shadow-[0_10px_26px_rgba(0,37,72,0.05)] sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="font-[family-name:var(--font-montserrat)] text-2xl font-semibold tracking-[-0.02em] text-[var(--brand-primary)] md:text-3xl">
                {copy.ctaTitle}
              </h2>
              <p className="mt-3 text-base leading-[1.7] text-slate-600 md:text-lg">{copy.ctaBody}</p>
            </div>
            <Link
              href={withLang("/contact", lang)}
              className="inline-flex min-w-[9.5rem] items-center justify-center rounded-md border-2 border-[#002548] bg-transparent px-6 py-3.5 text-center font-[family-name:var(--font-montserrat)] text-base font-medium text-[var(--brand-primary)] transition duration-300 hover:-translate-y-0.5 hover:border-[#003366] hover:shadow-md"
            >
              {copy.primaryCta}
            </Link>
          </div>
        </section>

        <SiteFooter locale={lang} />
      </main>
    </>
  );
}
