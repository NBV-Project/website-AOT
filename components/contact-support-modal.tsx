"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { type Locale } from "@/lib/locale";

type SupportDetail = {
  id: string;
  title: string;
  description: string;
  points: string[];
  icon: string;
  image: string;
};

const supportDetailsByLocale: Record<Locale, Record<string, SupportDetail>> = {
  th: {
    products: {
      id: "products",
      title: "ข้อมูลสินค้าและปริมาณที่เหมาะสม",
      description: "เราให้คำปรึกษาด้านการเลือกประเภทสินค้าและสัดส่วนที่เหมาะสมกับแผนการค้าของคุณ",
      points: [
        "แนะนำเกรดผลไม้ที่ตลาดปลายทางต้องการสูง",
        "คำนวณปริมาณการสั่งซื้อที่คุ้มค่าต่อการขนส่ง (Full Container Load)",
        "แจ้งรอบการผลิตและช่วงเวลาเก็บเกี่ยวที่ดีที่สุดของผลไม้แต่ละชนิด",
        "วางแผนการคละสินค้าในตู้เดียวเพื่อให้ตรงกับความต้องการของกลุ่มลูกค้า"
      ],
      icon: "📦",
      image: "/images/products-packing-process.jpg"
    },
    shipping: {
      id: "shipping",
      title: "แนวทางการจัดส่ง",
      description: "ระบบโลจิสติกส์ที่ออกแบบมาเพื่อรักษาคุณภาพสินค้าจากสวนถึงมือผู้รับในจีน",
      points: [
        "ใช้ตู้คอนเทนเนอร์ควบคุมอุณหภูมิ (Reefer) มาตรฐานสากล",
        "ระบบติดตามตำแหน่งและสถานะสินค้าตลอด 24 ชั่วโมง",
        "การจัดการเอกสารศุลกากรทั้งฝั่งไทยและจีนอย่างมืออาชีพ",
        "เครือข่ายกระจายสินค้าในตลาดค้าส่งหลักทั่วประเทศจีน"
      ],
      icon: "🚢",
      image: "/images/logistics-route.jpg"
    },
    coordination: {
      id: "coordination",
      title: "การประสานงานและรอบจัดส่ง",
      description: "การสื่อสารที่ชัดเจนและรอบจัดส่งที่สม่ำเสมอคือหัวใจของความร่วมมือระยะยาว",
      points: [
        "ทีมงานประสานงาน 3 ภาษา (ไทย, อังกฤษ, จีน) คอยดูแลอย่างใกล้ชิด",
        "แจ้งตารางเดินเรือและรอบการขนส่งล่วงหน้าเพื่อการวางแผนตลาด",
        "ระบบรายงานสถานะการบรรจุสินค้า (Loading Report) แบบเรียลไทม์",
        "การบริหารจัดการข้อตกลงและเงื่อนไขการค้าอย่างโปร่งใส"
      ],
      icon: "🤝",
      image: "/images/team-logistics-port.jpg"
    }
  },
  en: {
    products: {
      id: "products",
      title: "Product Information & Volume",
      description: "We provide consultation on product selection and volume suitable for your trade plan.",
      points: [
        "Guidance on fruit grades high in demand in destination markets.",
        "Calculation of cost-effective shipping volumes (Full Container Load).",
        "Updates on production cycles and peak harvesting times for each fruit type.",
        "Planning mixed-product shipments to meet specific customer segment needs."
      ],
      icon: "📦",
      image: "/images/products-packing-process.jpg"
    },
    shipping: {
      id: "shipping",
      title: "Shipping Guidelines",
      description: "Logistics systems designed to preserve product quality from orchard to recipient in China.",
      points: [
        "International-standard temperature-controlled (Reefer) containers.",
        "24-hour tracking of shipment location and status.",
        "Professional customs documentation management in both Thailand and China.",
        "Distribution network in major wholesale markets throughout China."
      ],
      icon: "🚢",
      image: "/images/logistics-route.jpg"
    },
    coordination: {
      id: "coordination",
      title: "Coordination & Shipping Rounds",
      description: "Clear communication and consistent shipping rounds are key to long-term partnership.",
      points: [
        "Trilingual coordination team (Thai, English, Chinese) for close support.",
        "Advanced notice of shipping schedules and rounds for market planning.",
        "Real-time Loading Reports and status updates during packing.",
        "Transparent management of trade agreements and conditions."
      ],
      icon: "🤝",
      image: "/images/team-logistics-port.jpg"
    }
  },
  zh: {
    products: {
      id: "products",
      title: "产品信息与订单量",
      description: "เราให้คำปรึกษาด้านการเลือกประเภทสินค้าและสัดส่วนที่เหมาะสมกับแผนการค้าของคุณ",
      points: [
        "指导目的地市场需求旺盛的水果等级选择。",
        "计算最具成本效益的装运量（整箱货 FCL）。",
        "提供每种水果的生产周期和最佳采收时间更新。",
        "规划混装产品运输，以满足特定客户群体的需求。"
      ],
      icon: "📦",
      image: "/images/products-packing-process.jpg"
    },
    shipping: {
      id: "shipping",
      title: "运输指南",
      description: "旨在保护从果园到中国收货人手中产品品质的物流体系。",
      points: [
        "使用国际标准的温控（冷藏）集装箱。",
        "全天候跟踪货运位置 and 状态。",
        "专业处理泰国和中国的海关报关文件。",
        "覆盖中国主要批发市场的销售与配送网络。"
      ],
      icon: "🚢",
      image: "/images/logistics-route.jpg"
    },
    coordination: {
      id: "coordination",
      title: "协调与发运批次",
      description: "清晰的沟通与稳定的发运批次是长期合作的关键。",
      points: [
        "提供泰、英、中三语协调团队的紧密支持。",
        "预先通知船期与发运批次，以便进行市场规划。",
        "提供装货过程中的实时装载报告 (Loading Report) กับ 状态更新。",
        "对贸易协议与条款进行透明化管理。"
      ],
      icon: "🤝",
      image: "/images/team-logistics-port.jpg"
    }
  }
};

type ContactSupportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  supportId: string | null;
  locale: Locale;
};

export function ContactSupportModal({ isOpen, onClose, supportId, locale }: ContactSupportModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      // Use setTimeout to avoid synchronous setState inside effect warning
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 0);
      document.body.style.overflow = "hidden";
    } else {
      timer = setTimeout(() => setIsVisible(false), 400);
      document.body.style.overflow = "";
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!mounted || !isVisible || !supportId) return null;

  const data = supportDetailsByLocale[locale][supportId];
  if (!data) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-400 ease-out ${
          isOpen ? "opacity-100 animate-modal-backdrop" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative z-[10000] w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-[var(--brand-bg)] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] ${
          isOpen ? "animate-modal-content" : "animate-modal-content-out"
        } max-h-[90vh] flex flex-col border border-white/20`}
      >
        {/* Header Image */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-64">
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-bg)] via-transparent to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-colors hover:bg-black/40 z-20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-8 md:p-10 pt-0 overflow-y-auto">
          <div className="flex items-center gap-4 mb-6 -mt-8 relative z-10 text-[16px]">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-xl text-4xl border border-slate-50">
              {data.icon}
            </span>
            <div className="pt-8">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#6f9152]">
                {locale === "th" ? "รายละเอียดการช่วยเหลือ" : locale === "zh" ? "支持详情" : "Support Details"}
              </span>
              <h2 className="font-[family-name:var(--font-montserrat)] text-2xl font-bold tracking-[-0.02em] text-[var(--brand-primary)] md:text-3xl">
                {data.title}
              </h2>
            </div>
          </div>

          <p className="text-base leading-relaxed text-slate-600 mb-8 border-l-4 border-[#95bb72] pl-4 italic bg-slate-50/50 py-2">
            {data.description}
          </p>

          <div className="space-y-3 text-[16px]">
            {data.points.map((point, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/50 border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-md group">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500 font-bold group-hover:bg-[#95bb72] group-hover:text-white transition-colors duration-300">
                  {idx + 1}
                </span>
                <p className="text-sm md:text-base text-slate-700 leading-normal">{point}</p>
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
