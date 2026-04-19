"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { XCircle, Lightbulb } from "lucide-react";
import { AdminPortal } from "@/components/admin-portal";
import { CmsAssetUploadButton } from "@/components/cms-asset-upload-button";
import { supabase } from "@/lib/supabase";

interface HomeLanguageContent {
  heroTitle: string[];
  heroBody: string;
  primaryCta: string;
  secondaryCta: string;
  categoriesTitle: string;
  overviewKicker: string;
  overviewTitle: string;
  overviewBody: string;
  overviewHighlights: string[];
  overviewDetails: Array<{
    id: string;
    title: string;
    description: string;
    points: string[];
    image: string;
  }>;
}

interface HomeContent {
  th: HomeLanguageContent;
  en: HomeLanguageContent;
  zh: HomeLanguageContent;
  images: {
    hero: string;
    overview: string;
  };
}

const defaultContent: HomeContent = {
  th: {
    heroTitle: ["ส่งตรงผลไม้สด", "คุณภาพพรีเมียม"],
    heroBody:
      "เอเชียน โอเวอร์ซี เทรดดิ้ง เชื่อมโยงผลไม้คุณภาพจากไทยและภูมิภาคใกล้เคียงสู่ตลาดจีนอย่างเป็นระบบ พร้อมมาตรฐานการคัดเลือก ขนส่ง และกระจายสินค้าที่เชื่อถือได้",
    primaryCta: "ดูสินค้า",
    secondaryCta: "เกี่ยวกับเรา",
    categoriesTitle: "หมวดหมู่สินค้า",
    overviewKicker: "ข้อมูลองค์กร",
    overviewTitle: "เริ่มต้นจากความเข้าใจในคุณภาพผลไม้เขตร้อน",
    overviewBody:
      "เราก่อตั้งขึ้นเพื่อเป็นสะพานเชื่อมโยงผลไม้เขตร้อนคุณภาพจากแหล่งผลิตสู่คู่ค้าในประเทศจีน โดยให้ความสำคัญกับคุณภาพ ความสด และความพร้อมทางการตลาดในทุกขั้นตอน",
    overviewHighlights: [
      "คัดสรรจากแหล่งปลูกคุณภาพ",
      "ควบคุมความสดตลอดเส้นทาง",
      "รองรับตลาดปลายทางในจีน",
    ],
    overviewDetails: [
      {
        id: "sourcing",
        title: "คัดสรรจากแหล่งปลูกคุณภาพ",
        description: "รายละเอียดเชิงลึกของการคัดเลือกแหล่งปลูก",
        points: [
          "มาตรฐานแหล่งปลูก",
          "ตรวจคุณภาพก่อนเก็บเกี่ยว",
          "ทำงานร่วมกับเกษตรกร",
          "คัดกรองก่อนส่งออก",
        ],
        image: "/images/home-story-origin.jpg",
      },
      {
        id: "logistics",
        title: "ควบคุมความสดตลอดเส้นทาง",
        description: "รายละเอียดเชิงลึกของการควบคุมความสด",
        points: [
          "ควบคุมอุณหภูมิ",
          "ติดตามการขนส่ง",
          "ลดเวลาขนถ่าย",
          "วางแผนเส้นทาง",
        ],
        image: "/images/team-logistics-port.jpg",
      },
      {
        id: "market",
        title: "รองรับตลาดปลายทางในจีน",
        description: "รายละเอียดเชิงลึกของการเชื่อมตลาดปลายทาง",
        points: [
          "เครือข่ายตลาดค้าส่ง",
          "ทีมประสานงานปลายทาง",
          "ติดตามแนวโน้มตลาด",
          "วางแผนพอร์ตสินค้า",
        ],
        image: "/images/hero-home.jpg",
      },
    ],
  },
  en: {
    heroTitle: ["Premium Fresh Fruit", "Delivered Direct"],
    heroBody:
      "Asian Overseas Trading connects quality fruit from Thailand and nearby regions to China through a reliable sourcing, logistics, and distribution system.",
    primaryCta: "View Products",
    secondaryCta: "About Us",
    categoriesTitle: "Category",
    overviewKicker: "Company Profile",
    overviewTitle: "Built on a clear understanding of tropical fruit quality",
    overviewBody:
      "We were founded to connect high-quality tropical fruit from origin to distribution partners in China with a strong focus on quality, freshness, and market readiness.",
    overviewHighlights: [
      "Strong sourcing at origin",
      "Freshness protected",
      "Market coordination",
    ],
    overviewDetails: [
      {
        id: "sourcing",
        title: "Strong sourcing at origin",
        description: "Operational detail for sourcing quality fruit at origin.",
        points: [
          "Qualified orchard network",
          "Pre-harvest quality checks",
          "Stable grower partnerships",
          "Export-ready screening",
        ],
        image: "/images/home-story-origin.jpg",
      },
      {
        id: "logistics",
        title: "Freshness protected in transit",
        description: "Operational detail for freshness control during transport.",
        points: [
          "Cold-chain handling",
          "Shipment tracking",
          "Fast loading process",
          "Route planning",
        ],
        image: "/images/team-logistics-port.jpg",
      },
      {
        id: "market",
        title: "Market coordination in China",
        description: "Operational detail for destination-market support in China.",
        points: [
          "Wholesale market network",
          "Destination coordination",
          "Market monitoring",
          "Portfolio alignment",
        ],
        image: "/images/hero-home.jpg",
      },
    ],
  },
  zh: {
    heroTitle: ["直送高品质鲜果", "稳定进入中国市场"],
    heroBody:
      "亚洲海外贸易通过严格的甄选、品控与出口运输体系，将优质水果从泰国及周边地区稳定供应到中国市场。",
    primaryCta: "查看产品",
    secondaryCta: "关于我们",
    categoriesTitle: "分类",
    overviewKicker: "公司资料",
    overviewTitle: "始于对热带水果品质的深入理解",
    overviewBody:
      "我们成立的初衷，是将高品质热带水果从源头稳定连接到中国合作伙伴，并在质量、新鲜度与市场适配方面提供完整支持。",
    overviewHighlights: [
      "优质产地甄选",
      "运输过程中的新鲜保障",
      "中国市场端协调",
    ],
    overviewDetails: [
      {
        id: "sourcing",
        title: "优质产地甄选",
        description: "关于源头选品的详细说明。",
        points: ["果园标准", "采前质检", "种植端合作", "出口前筛选"],
        image: "/images/home-story-origin.jpg",
      },
      {
        id: "logistics",
        title: "运输过程中的新鲜保障",
        description: "关于运输保鲜的详细说明。",
        points: ["温控运输", "运输追踪", "快速装卸", "路线规划"],
        image: "/images/team-logistics-port.jpg",
      },
      {
        id: "market",
        title: "中国市场端协调",
        description: "关于中国市场衔接的详细说明。",
        points: ["批发市场网络", "目的地协调", "市场趋势跟进", "产品组合规划"],
        image: "/images/hero-home.jpg",
      },
    ],
  },
  images: {
    hero: "/images/home-hero-durian-v2.jpg",
    overview: "/images/home-story-origin.jpg",
  },
};

export default function HomeEditor() {
  const [activeLang, setActiveLang] = useState<"th" | "en" | "zh">("th");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeDetailIndex, setActiveDetailIndex] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "confirming" | "saving" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<HomeContent>(defaultContent);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await supabase.from("page_content").select("content").eq("page_name", "home").single();

        if (data?.content) {
          setContent((prev) => ({
            ...prev,
            ...data.content,
            th: { ...prev.th, ...data.content.th },
            en: { ...prev.en, ...data.content.en },
            zh: { ...prev.zh, ...data.content.zh },
            images: { ...prev.images, ...(data.content.images || {}) },
          }));
        }
      } catch (err) {
        console.error("Error fetching home content:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleEditDetail = (index: number) => {
    setActiveDetailIndex(index);
    setIsDetailModalOpen(true);
  };

  const handleSave = async () => {
    setSaveStatus("saving");

    try {
      const { error } = await supabase.from("page_content").upsert(
        {
          page_name: "home",
          content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "page_name" },
      );

      if (error) throw error;
      setSaveStatus("success");
    } catch (err) {
      console.error("Error saving:", err);
      setSaveStatus("error");
    }
  };

  const updateContent = (key: keyof HomeLanguageContent, value: string | string[], index?: number) => {
    setContent((prev) => {
      const langData = { ...prev[activeLang] };

      if (index !== undefined && Array.isArray(langData[key])) {
        const nextArray = [...(langData[key] as string[])];
        nextArray[index] = value as string;
        (langData as Record<string, unknown>)[key] = nextArray;
      } else {
        (langData as Record<string, unknown>)[key] = value;
      }

      return {
        ...prev,
        [activeLang]: langData,
      };
    });
  };

  const updateImage = (key: keyof HomeContent["images"], value: string) => {
    setContent((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [key]: value,
      },
    }));
  };

  const updateOverviewDetail = (
    detailIndex: number,
    field: "title" | "description" | "image",
    value: string,
  ) => {
    setContent((prev) => {
      const details = [...prev[activeLang].overviewDetails];
      details[detailIndex] = { ...details[detailIndex], [field]: value };

      return {
        ...prev,
        [activeLang]: { ...prev[activeLang], overviewDetails: details },
      };
    });
  };

  const updateOverviewPoint = (detailIndex: number, pointIndex: number, value: string) => {
    setContent((prev) => {
      const details = [...prev[activeLang].overviewDetails];
      const points = [...details[detailIndex].points];
      points[pointIndex] = value;
      details[detailIndex] = { ...details[detailIndex], points };

      return {
        ...prev,
        [activeLang]: { ...prev[activeLang], overviewDetails: details },
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-kanit text-[16px]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#002548]/20 border-t-[#002548]" />
          <p className="animate-pulse font-medium text-slate-400">กำลังโหลดข้อมูลจากฐานข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in space-y-12 fade-in duration-700 font-kanit text-[16px]">
      <section className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-800 text-[32px]">
            จัดการ <span className="text-[#002548]">หน้าแรก</span>
          </h2>
          <p className="mt-3 text-lg font-medium text-slate-400">
            แก้ไขเนื้อหาและรูปภาพประกอบ โดยแบ่งตามส่วนที่ปรากฏบนหน้าเว็บไซต์
          </p>
        </div>
      </section>

      <button
        onClick={() => setSaveStatus("confirming")}
        className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#002548] text-white shadow-2xl transition-all hover:-translate-y-2 hover:bg-slate-800 active:scale-90 md:bottom-6 md:right-6 md:h-12 md:w-12"
        title="บันทึกการเปลี่ยนแปลง"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      </button>

      <AdminPortal>
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-500 ${
            saveStatus !== "idle" ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
            onClick={() => saveStatus !== "saving" && setSaveStatus("idle")}
          />
          <div
            className={`relative w-full max-w-sm rounded-[2.5rem] bg-white p-10 text-center shadow-2xl transition-all duration-500 ${
              saveStatus !== "idle" ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
            }`}
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            {saveStatus === "confirming" && (
              <div className="space-y-8 py-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">ยืนยันการบันทึก?</h3>
                  <p className="mt-2 px-4 text-sm font-medium leading-relaxed text-slate-500">
                    คุณต้องการบันทึกการเปลี่ยนแปลงเนื้อหาทั้งหมดลงในฐานข้อมูลใช่หรือไม่
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSaveStatus("idle")}
                    className="flex-1 rounded-2xl py-3 text-sm font-bold uppercase tracking-widest text-slate-400 transition-colors hover:bg-slate-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 rounded-2xl bg-[#002548] py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-slate-800"
                  >
                    บันทึกเลย
                  </button>
                </div>
              </div>
            )}

            {saveStatus === "saving" && (
              <div className="space-y-6 py-6">
                <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#002548]/10 border-t-[#002548]" />
                <p className="animate-pulse text-sm font-bold uppercase tracking-widest text-[#002548]">
                  กำลังบันทึกข้อมูล...
                </p>
              </div>
            )}

            {saveStatus === "success" && (
              <div className="space-y-8 py-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">บันทึกเรียบร้อย!</h3>
                  <p className="mt-2 px-4 text-sm font-medium leading-relaxed text-slate-500">
                    ข้อมูลถูกอัปเดตลงฐานข้อมูล Supabase สำเร็จแล้ว
                  </p>
                </div>
                <button
                  onClick={() => setSaveStatus("idle")}
                  className="w-full rounded-2xl bg-[#002548] py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-slate-800"
                >
                  ตกลง
                </button>
              </div>
            )}

            {saveStatus === "error" && (
              <div className="space-y-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <XCircle className="h-9 w-9" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">เกิดข้อผิดพลาด</h3>
                  <p className="mt-2 px-4 text-sm font-medium leading-relaxed text-slate-500">
                    ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง
                  </p>
                </div>
                <button
                  onClick={() => setSaveStatus("confirming")}
                  className="w-full rounded-2xl bg-red-500 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-red-600"
                >
                  ลองใหม่
                </button>
              </div>
            )}
          </div>
        </div>
      </AdminPortal>

      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 hide-scrollbar">
        <div className="flex w-fit whitespace-nowrap rounded-[2rem] border border-slate-100 bg-white p-2 text-[16px] shadow-sm ring-4 ring-slate-50">
          {(["th", "en", "zh"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`rounded-[1.5rem] px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all sm:px-8 sm:py-3 sm:text-sm ${
                activeLang === lang
                  ? "bg-[#002548] text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              }`}
            >
              {lang === "th" ? "ไทย" : lang === "en" ? "English" : "中文"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-10 sm:space-y-16">
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white text-[16px] shadow-sm sm:rounded-[3.5rem]">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-50 bg-slate-50/30 p-6 text-[16px] sm:p-10 sm:flex-row sm:items-center">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 sm:text-xl">
              1. ส่วนต้อนรับ (Hero Section)
            </h3>
            <span className="w-fit rounded-full bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 shadow-sm ring-1 ring-slate-100 sm:text-[10px]">
              Top Banner
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 p-6 text-[16px] sm:gap-12 sm:p-10 md:p-12 lg:grid-cols-2">
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
                <div>
                  <label className="mb-2 block px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:mb-3 sm:text-[11px]">
                    หัวข้อหลัก (บรรทัด 1)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 font-kanit text-sm text-slate-700 shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 sm:px-6 sm:py-4 sm:text-base"
                    value={content[activeLang].heroTitle[0]}
                    onChange={(e) => updateContent("heroTitle", e.target.value, 0)}
                  />
                </div>
                <div>
                  <label className="mb-2 block px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:mb-3 sm:text-[11px]">
                    หัวข้อหลัก (บรรทัด 2)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 font-kanit text-sm text-slate-700 shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 sm:px-6 sm:py-4 sm:text-base"
                    value={content[activeLang].heroTitle[1]}
                    onChange={(e) => updateContent("heroTitle", e.target.value, 1)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:mb-3 sm:text-[11px]">
                  คำบรรยาย Hero
                </label>
                <textarea
                  rows={3}
                  className="w-full resize-none rounded-2xl border-none bg-slate-50 px-5 py-3.5 font-kanit text-sm leading-relaxed text-slate-700 shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 sm:px-6 sm:py-4 sm:text-base"
                  value={content[activeLang].heroBody}
                  onChange={(e) => updateContent("heroBody", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
                <div>
                  <label className="mb-2 block px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:mb-3 sm:text-[11px]">
                    ปุ่มดูสินค้า (Primary)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 font-kanit text-sm text-slate-700 shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 sm:px-6 sm:py-4 sm:text-base"
                    value={content[activeLang].primaryCta}
                    onChange={(e) => updateContent("primaryCta", e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:mb-3 sm:text-[11px]">
                    ปุ่มเกี่ยวกับเรา (Secondary)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 font-kanit text-sm text-slate-700 shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 sm:px-6 sm:py-4 sm:text-base"
                    value={content[activeLang].secondaryCta}
                    onChange={(e) => updateContent("secondaryCta", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <label className="block px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-[11px]">
                รูปภาพพื้นหลัง
              </label>
              <CmsAssetUploadButton
                src={content.images.hero}
                alt="Hero preview"
                aspectClassName="aspect-[16/9]"
                className="rounded-[2rem] shadow-lg ring-4 ring-slate-50 sm:rounded-[2.5rem] sm:ring-8"
                onUploaded={(url) => updateImage("hero", url)}
                pathPrefix="home"
              />
              <p className="text-center text-[9px] font-medium italic text-slate-400 opacity-60 underline underline-offset-4 sm:text-[10px]">
                แนะนำขนาด: 1920 x 1080 px
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white text-[16px] shadow-sm sm:rounded-[3.5rem]">
          <div className="border-b border-slate-50 bg-slate-50/30 p-6 sm:p-10">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 sm:text-xl">
              2. ส่วนหมวดหมู่สินค้า (Categories)
            </h3>
          </div>
          <div className="max-w-2xl p-6 text-[16px] sm:p-10 md:p-12">
            <label className="mb-3 block px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-[11px]">
              หัวข้อหลักของส่วนหมวดหมู่
            </label>
            <input
              type="text"
              className="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 font-kanit text-sm text-slate-700 shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 sm:px-6 sm:py-4 sm:text-base"
              value={content[activeLang].categoriesTitle}
              onChange={(e) => updateContent("categoriesTitle", e.target.value)}
            />

            <div className="mt-6 flex items-center gap-4 rounded-3xl border border-blue-100/50 bg-blue-50/50 p-5 sm:mt-8 sm:p-6">
              <Lightbulb className="h-5 w-5 text-blue-500 sm:h-6 sm:w-6" />
              <p className="text-xs font-medium leading-relaxed text-blue-600 sm:text-sm">
                จัดการรูปภาพผลไม้และรายละเอียดสินค้าแต่ละชนิดได้ที่หน้า{" "}
                <Link href="/superadmin/products" className="font-bold text-blue-800 underline transition-colors hover:text-[#002548]">
                  &quot;รายการสินค้า&quot;
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white text-[16px] shadow-sm sm:rounded-[3.5rem]">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-50 bg-slate-50/30 p-6 text-[16px] sm:p-10 sm:flex-row sm:items-center">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 sm:text-xl">
              3. ส่วนข้อมูลองค์กร (Overview Section)
            </h3>
            <span className="w-fit rounded-full bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 shadow-sm ring-1 ring-slate-100 sm:text-[10px]">
              Bottom Content
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 p-6 text-[16px] sm:gap-12 sm:p-10 md:p-12 lg:grid-cols-2">
            <div className="order-2 space-y-4 sm:space-y-6 lg:order-1">
              <label className="block px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-[11px]">
                รูปภาพประกอบ
              </label>
              <CmsAssetUploadButton
                src={content.images.overview}
                alt="Overview preview"
                aspectClassName="aspect-[4/3]"
                className="rounded-[2rem] shadow-lg ring-4 ring-slate-50 sm:rounded-[2.5rem] sm:ring-8"
                onUploaded={(url) => updateImage("overview", url)}
                pathPrefix="home"
              />
              <p className="text-center text-[9px] font-medium italic text-slate-400 opacity-60 underline underline-offset-4 sm:text-[10px]">
                แนะนำขนาด: 1200 x 900 px
              </p>
            </div>

            <div className="order-1 space-y-6 text-[16px] sm:space-y-8 lg:order-2">
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div>
                  <label className="mb-2 block px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:mb-3 sm:text-[11px]">
                    คำโปรยเหนือหัวข้อ (Kicker)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 font-kanit text-sm text-slate-700 shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 sm:px-6 sm:py-4 sm:text-base"
                    value={content[activeLang].overviewKicker}
                    onChange={(e) => updateContent("overviewKicker", e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:mb-3 sm:text-[11px]">
                    หัวข้อหลัก Overview
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border-none bg-slate-50 px-5 py-3.5 font-kanit text-sm text-slate-700 shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 sm:px-6 sm:py-4 sm:text-base"
                    value={content[activeLang].overviewTitle}
                    onChange={(e) => updateContent("overviewTitle", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:mb-3 sm:text-[11px]">
                  เนื้อหาหลัก
                </label>
                <textarea
                  rows={5}
                  className="w-full resize-none rounded-2xl border-none bg-slate-50 px-5 py-3.5 font-kanit text-sm leading-relaxed text-slate-700 shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 sm:px-6 sm:py-4 sm:text-base"
                  value={content[activeLang].overviewBody}
                  onChange={(e) => updateContent("overviewBody", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* VALUE HIGHLIGHTS - FULL WIDTH DASHBOARD */}
          <div className="border-t border-slate-50 bg-slate-50/20 p-6 sm:p-10 md:p-12">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <label className="block px-2 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] sm:text-[11px]">
                  Value Highlights Dashboard
                </label>
                <h4 className="px-2 mt-1 text-2xl font-bold text-slate-800">
                  จุดเด่น 3 ด้านหลัก <span className="text-slate-400 font-medium">(Interactive Cards)</span>
                </h4>
              </div>
              <div className="hidden sm:block">
                <span className="rounded-full bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 shadow-sm ring-1 ring-slate-200">
                  3 Active Modules
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {content[activeLang].overviewDetails.map((detail, index) => (
                <div 
                  key={detail.id}
                  className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,37,72,0.08)] hover:-translate-y-2 active:scale-[0.98] cursor-pointer"
                  onClick={() => handleEditDetail(index)}
                >
                  {/* Premium Preview Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <Image 
                      src={detail.image || "/images/home-story-origin.jpg"} 
                      alt={detail.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002548]/80 via-[#002548]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    
                    {/* Floating Badge */}
                    <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 font-black text-[#002548] shadow-xl backdrop-blur-xl transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-white">
                      {index + 1}
                    </div>

                    {/* Hover Label */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                      <div className="translate-y-4 rounded-full bg-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#002548] shadow-2xl transition-transform duration-500 group-hover:translate-y-0">
                        Customize Details
                      </div>
                    </div>
                  </div>

                  {/* Refined Content Preview */}
                  <div className="p-8">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="h-1 w-8 rounded-full bg-[#D4AF37]" />
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
                        Module {index + 1}
                      </label>
                    </div>
                    <h5 className="mb-3 text-xl font-bold text-slate-800 leading-tight group-hover:text-[#002548] transition-colors">
                      {detail.title || `Highlight ${index + 1}`}
                    </h5>
                    <p className="line-clamp-2 text-sm font-medium leading-relaxed text-slate-400">
                      {detail.description || "คลิกเพื่อเพิ่มรายละเอียดเชิงลึกและจุดขายสำคัญ..."}
                    </p>
                    
                    <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#002548]">
                        <span>Edit Details</span>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-[#002548] group-hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* MODAL FOR DETAIL EDITING */}
            <AdminPortal>
              <div className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 transition-all duration-500 ${isDetailModalOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`}>
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsDetailModalOpen(false)} />
                
                <div className={`relative w-full max-w-4xl overflow-hidden rounded-[3.5rem] bg-white shadow-2xl transition-all duration-700 ${isDetailModalOpen ? "translate-y-0 scale-100" : "translate-y-12 scale-95"}`} style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[#002548] text-white shadow-xl ring-8 ring-[#002548]/5">
                        <span className="text-2xl font-black">{activeDetailIndex + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">แก้ไขจุดเด่นที่ {activeDetailIndex + 1}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Full Content Management</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsDetailModalOpen(false)}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-100 transition-all hover:bg-slate-50 hover:text-slate-800 hover:rotate-90 duration-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="max-h-[65vh] overflow-y-auto p-10 custom-scrollbar">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                      
                      {/* Left Column: Image Management */}
                      <div className="space-y-6">
                        <div>
                          <label className="mb-3 block px-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">รูปภาพประกอบ (Visual Asset)</label>
                          <CmsAssetUploadButton
                            src={content[activeLang].overviewDetails[activeDetailIndex]?.image}
                            alt="Highlight Image"
                            aspectClassName="aspect-[4/3]"
                            className="rounded-[3rem] shadow-2xl ring-[12px] ring-slate-50 transition-all hover:ring-[#D4AF37]/20 duration-500"
                            onUploaded={(url) => updateOverviewDetail(activeDetailIndex, "image", url)}
                            pathPrefix="home"
                          />
                        </div>
                        <div className="flex items-center gap-4 rounded-[2rem] bg-[#002548]/5 p-6 border border-[#002548]/10">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#002548] text-white shadow-lg">
                            <Lightbulb className="h-5 w-5" />
                          </div>
                          <p className="text-xs font-semibold leading-relaxed text-[#002548]/70">
                            แนะนำให้ใช้รูปที่มีคุณภาพสูงและสื่อถึงหัวข้อนั้นๆ เพื่อสร้างความเชื่อมั่นให้กับลูกค้า
                          </p>
                        </div>
                      </div>

                      {/* Right Column: Text & Points */}
                      <div className="space-y-10">
                        <div className="grid grid-cols-1 gap-8">
                          <div>
                            <label className="mb-3 block px-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                              หัวข้อบนหน้าเว็บ <span className="text-[#D4AF37]">(Main Page)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-[1.5rem] border-none bg-slate-50 px-6 py-4.5 font-kanit text-lg font-bold text-slate-700 shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 transition-all"
                              value={content[activeLang].overviewHighlights[activeDetailIndex] ?? ""}
                              onChange={(e) => updateContent("overviewHighlights", e.target.value, activeDetailIndex)}
                            />
                          </div>

                          <div>
                            <label className="mb-3 block px-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                              หัวข้อเรื่องในโมดอล <span className="text-[#D4AF37]">(Modal Title)</span>
                            </label>
                            <input
                              type="text"
                              className="w-full rounded-[1.5rem] border-none bg-slate-50 px-6 py-4.5 font-kanit text-lg font-bold text-[#002548] shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 transition-all"
                              value={content[activeLang].overviewDetails[activeDetailIndex]?.title}
                              onChange={(e) => updateOverviewDetail(activeDetailIndex, "title", e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="mb-3 block px-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                              คำอธิบายรายละเอียด
                            </label>
                            <textarea
                              rows={4}
                              className="w-full resize-none rounded-[1.5rem] border-none bg-slate-50 px-6 py-5 font-kanit text-base leading-relaxed text-slate-600 shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 transition-all"
                              value={content[activeLang].overviewDetails[activeDetailIndex]?.description}
                              onChange={(e) => updateOverviewDetail(activeDetailIndex, "description", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-5">
                          <label className="block px-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">จุดเด่นย่อย (Strategic Key Points)</label>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {content[activeLang].overviewDetails[activeDetailIndex]?.points.map((point, pIdx) => (
                              <div key={pIdx} className="group relative">
                                <input
                                  type="text"
                                  className="w-full rounded-2xl border-none bg-slate-50 pl-12 pr-6 py-4 font-kanit text-sm font-bold text-slate-600 shadow-inner focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                                  value={point}
                                  onChange={(e) => updateOverviewPoint(activeDetailIndex, pIdx, e.target.value)}
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[10px] font-black text-[#D4AF37] group-focus-within:bg-[#D4AF37] group-focus-within:text-white transition-all">
                                  {pIdx + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-end gap-4 border-t border-slate-50 bg-slate-50/50 px-10 py-8">
                    <button 
                      onClick={() => setIsDetailModalOpen(false)}
                      className="rounded-2xl bg-[#002548] px-12 py-4 text-xs font-black uppercase tracking-[0.3em] text-white shadow-2xl transition-all hover:bg-slate-800 hover:shadow-slate-800/20 active:scale-95"
                    >
                      Confirm Changes
                    </button>
                  </div>
                </div>
              </div>
            </AdminPortal>
          </div>
        </div>
      </div>
    </div>
  );
}
