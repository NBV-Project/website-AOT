"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { type Locale } from "@/lib/locale";

type HighlightDetail = {
  id: string;
  title: string;
  description: string;
  points: string[];
  image: string;
};

const highlightDetailsByLocale: Record<Locale, Record<string, HighlightDetail>> = {
  th: {
    sourcing: {
      id: "sourcing",
      title: "คัดสรรจากแหล่งปลูกคุณภาพ",
      description:
        "หัวใจสำคัญของเอเชียน โอเวอร์ซี เทรดดิ้ง คือการเข้าถึงวัตถุดิบที่ดีที่สุดจากแหล่งกำเนิด",
      points: [
        "คัดเลือกเฉพาะสวนที่ได้รับมาตรฐาน GAP (Good Agricultural Practices)",
        "ตรวจสอบคุณภาพผลผลิตและมาตรฐานความสุกอย่างเข้มงวดก่อนการเก็บเกี่ยว",
        "สร้างพันธมิตรที่ยั่งยืนกับเกษตรกรเพื่อการจัดหาผลผลิตที่สม่ำเสมอตลอดฤดูกาล",
        "คัดกรองทุกขั้นตอนเพื่อให้มั่นใจว่าผลไม้ทุกลูกไร้ตำหนิและพร้อมสำหรับการส่งออก",
      ],
      image: "/images/home-story-origin.jpg",
    },
    logistics: {
      id: "logistics",
      title: "ควบคุมความสดตลอดเส้นทาง",
      description:
        "ระยะทางไม่ใช่ปัญหา หากมีการบริหารจัดการห่วงโซ่ความเย็นที่แม่นยำและรวดเร็ว",
      points: [
        "ใช้ระบบห้องเย็นและตู้คอนเทนเนอร์ควบคุมอุณหภูมิ (Reefer) ตลอดการขนส่ง",
        "ระบบติดตามตำแหน่งและอุณหภูมิแบบ Real-time เพื่อความโปร่งใส",
        "กระบวนการขนถ่ายสินค้าที่รวดเร็วเพื่อลดเวลาการอยู่นอกระบบควบคุม",
        "ออกแบบเส้นทางเดินรถและรอบเรือที่สั้นที่สุดเพื่อรักษาความสดใหม่จนถึงมือผู้รับ",
      ],
      image: "/images/team-logistics-port.jpg",
    },
    market: {
      id: "market",
      title: "รองรับตลาดปลายทางในจีน",
      description:
        "เราไม่ใช่แค่ผู้ส่งออก แต่เราคือพันธมิตรที่เข้าใจโครงสร้างตลาดค้าส่งของจีนอย่างลึกซึ้ง",
      points: [
        "เครือข่ายที่แข็งแกร่งในตลาดค้าส่งหลัก เช่น ตลาดเจียงหนาน (กวางโจว) และตลาดว่านบัง (เหอหนาน)",
        "ทีมงานประสานงานในพื้นที่เพื่อดูแลการรับสินค้าและกระจายล็อตอย่างเป็นระบบ",
        "วิเคราะห์แนวโน้มราคาและความต้องการในตลาดจีนรายวันเพื่อปรับแผนการจัดส่ง",
        "รองรับการจัดพอร์ตสินค้าตามความต้องการที่แตกต่างกันของคู่ค้าแต่ละมณฑล",
      ],
      image: "/images/hero-home.jpg",
    },
  },
  en: {
    sourcing: {
      id: "sourcing",
      title: "Premium Sourcing at Origin",
      description: "The core of our operations is securing the finest produce directly from the source.",
      points: [
        "Selection of GAP-certified (Good Agricultural Practices) orchards only.",
        "Strict quality checks and ripeness standards before harvesting.",
        "Sustainable partnerships with local farmers for consistent year-round supply.",
        "Rigorous screening to ensure every fruit is flawless and export-ready.",
      ],
      image: "/images/home-story-origin.jpg",
    },
    logistics: {
      id: "logistics",
      title: "End-to-End Freshness Control",
      description: "Distance is no obstacle when managed with precision and rapid cold chain logistics.",
      points: [
        "Utilization of advanced temperature-controlled (Reefer) containers throughout transit.",
        "Real-time tracking of location and temperature for full transparency.",
        "Fast loading and unloading procedures to minimize outside exposure.",
        "Optimized routing to ensure peak freshness from the tree to the consumer.",
      ],
      image: "/images/team-logistics-port.jpg",
    },
    market: {
      id: "market",
      title: "Deep Presence in China Markets",
      description:
        "We are more than an exporter; we are a partner with deep insight into China's distribution network.",
      points: [
        "Strong network in major wholesale markets like Jiangnan (Guangzhou) and Wanbang (Henan).",
        "On-ground coordination teams to manage receiving and systematic lot distribution.",
        "Daily analysis of market trends and price fluctuations across China.",
        "Tailored portfolio management to meet the specific demands of each province.",
      ],
      image: "/images/hero-home.jpg",
    },
  },
  zh: {
    sourcing: {
      id: "sourcing",
      title: "优质产地甄选",
      description: "亚洲海外贸易的核心竞争力在于从源头获取最优质的原材料。",
      points: [
        "仅选择符合 GAP（良好农业规范）标准的优质果园。",
        "采收前对果品质量和成熟度标准进行严格检查。",
        "与当地农户建立可持续的合作伙伴关系，确保全年供应稳定。",
        "通过严格筛选，确保每一颗水果都完美无瑕且符合出口标准。",
      ],
      image: "/images/home-story-origin.jpg",
    },
    logistics: {
      id: "logistics",
      title: "全程新鲜度管控",
      description: "只要管理得当，精准快速的冷链物流便能跨越地理距离。",
      points: [
        "运输过程中全程使用先进的温控冷藏集装箱。",
        "实时监控位置和温度，确保流程完全透明。",
        "快速装卸流程，最大限度地减少产品在外部环境中的暴露时间。",
        "优化运输路线，确保水果从果园到消费者手中始终保持最佳新鲜度。",
      ],
      image: "/images/team-logistics-port.jpg",
    },
    market: {
      id: "market",
      title: "深耕中国终端市场",
      description: "我们不仅是出口商，更是深入了解中国批发市场结构的战略伙伴。",
      points: [
        "在广州江南市场和河南万邦市场等主要批发市场拥有强大的网络。",
        "地面协调团队负责管理货物的接收与系统化的批次分销。",
        "每日分析中国市场的价格趋势和需求波动。",
        "根据中国各省份合作伙伴的不同需求，提供定制化的产品组合管理。",
      ],
      image: "/images/hero-home.jpg",
    },
  },
};

type HighlightModalProps = {
  isOpen: boolean;
  onClose: () => void;
  highlightId: string | null;
  locale: Locale;
  details?: HighlightDetail[];
};

export function HighlightModal({ isOpen, onClose, highlightId, locale, details }: HighlightModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Use a separate effect for visibility and body scroll to avoid cascading renders
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOpen) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 400);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
    
    return () => {
      if (timer) clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setMounted(true);
    return () => {
      setMounted(false);
    };
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!mounted || (!isVisible && !isOpen) || !highlightId) return null;

  const customDetails = Array.isArray(details)
    ? Object.fromEntries(details.map((detail) => [detail.id, detail]))
    : null;
  const data = customDetails?.[highlightId] || highlightDetailsByLocale[locale][highlightId];
  if (!data) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-400 ease-out ${
          isOpen ? "opacity-100 animate-modal-backdrop" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`relative z-[10000] max-h-[90vh] flex w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] border border-white/20 bg-[var(--brand-bg)] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] ${
          isOpen ? "animate-modal-content" : "animate-modal-content-out"
        }`}
      >
        <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-64">
          <Image src={data.image} alt={data.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-bg)] via-transparent to-transparent" />

          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-colors hover:bg-black/40"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-8 pt-0 md:p-10 md:pt-0">
          <div className="relative z-10 mb-6 -mt-8">
            <div className="pt-8">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#6f9152]">
                {locale === "th" ? "แนวทางการดำเนินงาน" : locale === "zh" ? "运营理念" : "Our Operational Approach"}
              </span>
              <h2 className="font-[family-name:var(--font-montserrat)] text-2xl font-bold tracking-[-0.02em] text-[var(--brand-primary)] md:text-3xl">
                {data.title}
              </h2>
            </div>
          </div>

          <p className="mb-8 border-l-4 border-[#95bb72] bg-slate-50/50 py-2 pl-4 text-base italic leading-relaxed text-slate-600">
            {data.description}
          </p>

          <div className="space-y-3">
            {data.points.map((point, idx) => (
              <div
                key={idx}
                className="group flex gap-4 rounded-2xl border border-slate-100 bg-white/50 p-4 shadow-sm transition-all hover:bg-white hover:shadow-md"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 transition-colors duration-300 group-hover:bg-[#95bb72] group-hover:text-white">
                  {idx + 1}
                </span>
                <p className="text-sm leading-normal text-slate-700 md:text-base">{point}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="mt-10 w-full rounded-xl bg-[var(--brand-primary)] py-4 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:brightness-110 active:scale-[0.98]"
          >
            {locale === "th" ? "เข้าใจแล้ว" : locale === "zh" ? "我明白了" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
