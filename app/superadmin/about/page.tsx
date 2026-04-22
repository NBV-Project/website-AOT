"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Lightbulb, Users } from "lucide-react";
import { AdminPortal } from "@/components/admin-portal";
import { CmsAssetUploadButton } from "@/components/cms-asset-upload-button";
import { CmsSaveToast, type CmsSaveStatus } from "@/components/cms-save-toast";
import { savePageContent } from "@/lib/actions";

type Locale = "th" | "en" | "zh";

type StrengthCard = {
  title: string;
  body: string;
};

type Leader = {
  name: string;
  role: string;
  quote: string;
  image: string;
};

type AboutLanguageContent = {
  heroTitle: string[];
  heroBody: string;
  storyLabel: string;
  storyTitle: string;
  storyBody: string;
  missionTitle: string;
  missionBody: string;
  missionCta: string;
  sustainabilityTitle: string;
  sustainabilityBody: string;
  strengthKicker: string;
  strengthTitle: string[];
  strengthBody: string;
  strengthCards: StrengthCard[];
  leadersTitle: string;
  leadersBody: string;
  leaders: Leader[];
};

type AboutContent = Record<Locale, AboutLanguageContent> & {
  images: {
    hero: string;
    story: string;
  };
};

const defaultContent: AboutContent = {
  th: {
    heroTitle: ["รากฐานของคุณภาพ", "ความสดและความไว้วางใจ"],
    heroBody: "ข้อความแนะนำหน้าเกี่ยวกับเรา",
    storyLabel: "Legacy of Precision",
    storyTitle: "เรื่องราวของบริษัท",
    storyBody: "อธิบายแนวทางของบริษัทและจุดเริ่มต้น",
    missionTitle: "พันธกิจของเรา",
    missionBody: "ข้อความพันธกิจ",
    missionCta: "ดูแนวทางการทำงาน",
    sustainabilityTitle: "ความยั่งยืน",
    sustainabilityBody: "ข้อความความยั่งยืน",
    strengthKicker: "จุดแข็งหลักของเรา",
    strengthTitle: ["โครงสร้างการส่งออกที่เรียบง่าย", "แต่แม่นยำ"],
    strengthBody: "ข้อความอธิบายจุดแข็ง",
    strengthCards: [
      { title: "การคัดสรรชั้นเลิศ", body: "รายละเอียด" },
      { title: "ระบบขนส่งที่แม่นยำ", body: "รายละเอียด" },
      { title: "ความร่วมมือที่ไว้ใจได้", body: "รายละเอียด" },
      { title: "มองระยะยาว", body: "รายละเอียด" },
    ],
    leadersTitle: "ทีมงานที่ขับเคลื่อนองค์กร",
    leadersBody: "ข้อความอธิบายทีม",
    leaders: [
      { name: "ทีมคัดสรรสินค้า", role: "ดูแลคุณภาพจากต้นทาง", quote: "ข้อความทีม", image: "/images/team-sourcing-new.jpg" },
      { name: "ทีมโลจิสติกส์", role: "ควบคุมการขนส่ง", quote: "ข้อความทีม", image: "/images/team-logistics-port.jpg" },
      { name: "ทีมตลาดส่งออก", role: "ประสานตลาดปลายทาง", quote: "ข้อความทีม", image: "/images/marketing-world-map.png" },
    ],
  },
  en: {
    heroTitle: ["The Foundation of Quality", "Freshness and Trust"],
    heroBody: "About page introduction copy",
    storyLabel: "Legacy of Precision",
    storyTitle: "Our Company Story",
    storyBody: "Describe the company background and approach",
    missionTitle: "Our Mission",
    missionBody: "Mission copy",
    missionCta: "Explore Our Approach",
    sustainabilityTitle: "Sustainability",
    sustainabilityBody: "Sustainability copy",
    strengthKicker: "Core Strengths",
    strengthTitle: ["An export structure that stays simple", "yet precise"],
    strengthBody: "Strength section body",
    strengthCards: [
      { title: "Premium Sourcing", body: "Detail" },
      { title: "Precise Transportation", body: "Detail" },
      { title: "Trusted Coordination", body: "Detail" },
      { title: "Long-Term Thinking", body: "Detail" },
    ],
    leadersTitle: "The Teams Behind Our Growth",
    leadersBody: "Leader section body",
    leaders: [
      { name: "Sourcing Team", role: "Origin Quality Control", quote: "Team quote", image: "/images/team-sourcing-new.jpg" },
      { name: "Transportation Team", role: "Temperature and Route Management", quote: "Team quote", image: "/images/team-logistics-port.jpg" },
      { name: "Export Market Team", role: "Partner Coordination", quote: "Team quote", image: "/images/marketing-world-map.png" },
    ],
  },
  zh: {
    heroTitle: ["品质基石", "新鲜与信任"],
    heroBody: "关于我们页面说明",
    storyLabel: "Legacy of Precision",
    storyTitle: "公司故事",
    storyBody: "说明公司的背景与方法",
    missionTitle: "我们的使命",
    missionBody: "使命文案",
    missionCta: "了解我们的方式",
    sustainabilityTitle: "可持续性",
    sustainabilityBody: "可持续性文案",
    strengthKicker: "核心优势",
    strengthTitle: ["简洁而精准的出口结构", "稳定运作"],
    strengthBody: "优势说明",
    strengthCards: [
      { title: "精选采购", body: "详情" },
      { title: "精准运输", body: "详情" },
      { title: "可靠协调", body: "详情" },
      { title: "长期思维", body: "详情" },
    ],
    leadersTitle: "推动公司成长的团队",
    leadersBody: "团队说明",
    leaders: [
      { name: "采购团队", role: "产地质量控制", quote: "团队引言", image: "/images/team-sourcing-new.jpg" },
      { name: "运输团队", role: "路线与温控管理", quote: "团队引言", image: "/images/team-logistics-port.jpg" },
      { name: "出口市場團隊", role: "市場協調", quote: "團隊引言", image: "/images/marketing-world-map.png" },
    ],
  },
  images: {
    hero: "/images/pc.png",
    story: "/images/hero-about.jpg",
  },
};

function LanguageTabs({
  activeLang,
  onChange,
}: {
  activeLang: Locale;
  onChange: (lang: Locale) => void;
}) {
  return (
    <div className="flex bg-white p-2 rounded-[2rem] w-fit shadow-sm border border-slate-100 ring-4 ring-slate-50">
      {(["th", "en", "zh"] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={`px-8 py-3 rounded-[1.5rem] text-sm font-bold uppercase tracking-widest transition-all ${
            activeLang === lang ? "bg-[#002548] text-white shadow-lg" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          }`}
        >
          {lang === "th" ? "ไทย" : lang === "en" ? "English" : "中文"}
        </button>
      ))}
    </div>
  );
}

export default function AboutManagement() {
  const [activeLang, setActiveLang] = useState<Locale>("th");
  const [content, setContent] = useState<AboutContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<CmsSaveStatus>("idle");
  const [adminLang, setAdminLang] = useState<string>("th");

  // Strength Modal States
  const [isStrengthModalOpen, setIsStrengthModalOpen] = useState(false);
  const [activeStrengthIndex, setActiveStrengthIndex] = useState<number>(0);

  // Leader Modal States
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
  const [activeLeaderIndex, setActiveLeaderIndex] = useState<number>(0);

  useEffect(() => {
    const getLang = () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("admin_lang") || "th";
      }
      return "th";
    };
    setAdminLang(getLang());
    const handleLangChange = () => setAdminLang(getLang());
    window.addEventListener("admin_lang_changed", handleLangChange);
    return () => window.removeEventListener("admin_lang_changed", handleLangChange);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await supabase
          .from("page_content")
          .select("content")
          .eq("page_name", "about")
          .single();

        if (data?.content) {
          setContent({
            ...defaultContent,
            ...data.content,
            th: { ...defaultContent.th, ...data.content.th },
            en: { ...defaultContent.en, ...data.content.en },
            zh: { ...defaultContent.zh, ...data.content.zh },
            images: { ...defaultContent.images, ...(data.content.images || {}) },
          });
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const updateLang = <K extends keyof AboutLanguageContent>(key: K, value: AboutLanguageContent[K]) => {
    setContent((prev) => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [key]: value,
      },
    }));
  };

  const updateHeroTitle = (index: number, value: string) => {
    const next = [...content[activeLang].heroTitle];
    next[index] = value;
    updateLang("heroTitle", next);
  };

  const updateStrengthTitle = (index: number, value: string) => {
    const next = [...content[activeLang].strengthTitle];
    next[index] = value;
    updateLang("strengthTitle", next);
  };

  const updateStrengthCard = (index: number, key: keyof StrengthCard, value: string) => {
    const next = [...content[activeLang].strengthCards];
    next[index] = { ...next[index], [key]: value };
    updateLang("strengthCards", next);
  };

  const updateLeader = (index: number, key: keyof Leader, value: string) => {
    const next = [...content[activeLang].leaders];
    next[index] = { ...next[index], [key]: value };
    updateLang("leaders", next);
  };

  const updateImage = (key: keyof AboutContent["images"], value: string) => {
    setContent((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    const result = await savePageContent("about", content);

    if (result.success) {
      setSaveStatus("success");
    } else {
      setSaveStatus("error");
    }
  };

  const handleEditStrength = (index: number) => {
    setActiveStrengthIndex(index);
    setIsStrengthModalOpen(true);
  };

  const handleEditLeader = (index: number) => {
    setActiveLeaderIndex(index);
    setIsLeaderModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-kanit">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#002548]/20 border-t-[#002548] rounded-full animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse">Loading about content...</p>
        </div>
      </div>
    );
  }

  const langContent = content[activeLang];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 font-kanit">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 tracking-tight text-[32px]">
            จัดการ <span className="text-[#002548]">เกี่ยวกับเรา</span>
          </h2>
          <p className="text-slate-400 font-medium mt-3 text-lg">
            เพิ่มส่วนที่หน้า About ใช้งานจริงให้แก้ไขผ่าน CMS ได้ครบ
          </p>
        </div>
      </section>

      <button
        onClick={handleSave}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-2xl z-50 transition-all hover:-translate-y-2 active:scale-90 bg-[#002548] text-white hover:bg-slate-800"
        title="Save"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
      </button>

      <CmsSaveToast
        status={saveStatus}
        onClear={() => setSaveStatus("idle")}
        messages={{
          saving: { th: "กำลังบันทึกข้อมูลหน้าเกี่ยวกับเรา...", en: "Saving About page changes...", zh: "正在保存关于我们内容..." }[adminLang as "th" | "en" | "zh"] || "Saving...",
          success: { th: "บันทึกข้อมูลหน้าเกี่ยวกับเราเรียบร้อยแล้ว", en: "About page saved successfully.", zh: "关于我们内容保存成功。" }[adminLang as "th" | "en" | "zh"] || "Saved.",
          error: { th: "ไม่สามารถบันทึกข้อมูลหน้าเกี่ยวกับเราได้", en: "Unable to save the About page.", zh: "无法保存关于我们内容。" }[adminLang as "th" | "en" | "zh"] || "Error.",
        }}
      />

      <LanguageTabs activeLang={activeLang} onChange={setActiveLang} />

      <div className="space-y-10">
        <section className="bg-white border border-slate-100 rounded-[2rem] md:rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-xl font-bold text-slate-800">1. Hero</h3>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.heroTitle[0]} onChange={(e) => updateHeroTitle(0, e.target.value)} placeholder="Hero title line 1" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.heroTitle[1]} onChange={(e) => updateHeroTitle(1, e.target.value)} placeholder="Hero title line 2" />
              <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[140px]" value={langContent.heroBody} onChange={(e) => updateLang("heroBody", e.target.value)} placeholder="Hero body" />
              
            </div>
            <div className="space-y-2">
              <CmsAssetUploadButton
                src={content.images.hero}
                alt="About hero preview"
                aspectClassName="aspect-video"
                onUploaded={(url) => updateImage("hero", url)}
                pathPrefix="about"
              />
              <p className="text-center text-[11px] font-semibold text-[#002548]/70">ขนาดแนะนำ: 1920 x 1080 px</p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[2rem] md:rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-xl font-bold text-slate-800">2. Story</h3>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.storyLabel} onChange={(e) => updateLang("storyLabel", e.target.value)} placeholder="Story label" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.storyTitle} onChange={(e) => updateLang("storyTitle", e.target.value)} placeholder="Story title" />
              <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[180px]" value={langContent.storyBody} onChange={(e) => updateLang("storyBody", e.target.value)} placeholder="Story body" />
              
            </div>
            <div className="space-y-2">
              <CmsAssetUploadButton
                src={content.images.story}
                alt="About story preview"
                aspectClassName="aspect-[4/5]"
                onUploaded={(url) => updateImage("story", url)}
                pathPrefix="about"
              />
              <p className="text-center text-[11px] font-semibold text-[#002548]/70">ขนาดแนะนำ: 1200 x 1500 px</p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[2rem] md:rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-xl font-bold text-slate-800">3. Mission / Sustainability</h3>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.missionTitle} onChange={(e) => updateLang("missionTitle", e.target.value)} placeholder="Mission title" />
              <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[160px]" value={langContent.missionBody} onChange={(e) => updateLang("missionBody", e.target.value)} placeholder="Mission body" />
            </div>
            <div className="space-y-4">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.sustainabilityTitle} onChange={(e) => updateLang("sustainabilityTitle", e.target.value)} placeholder="Sustainability title" />
              <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[160px]" value={langContent.sustainabilityBody} onChange={(e) => updateLang("sustainabilityBody", e.target.value)} placeholder="Sustainability body" />
            </div>
          </div>
        </section>

        {/* STRENGTHS SECTION - PREMIUM DASHBOARD STYLE */}
        <section className="bg-white border border-slate-100 rounded-[2rem] md:rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-slate-800">4. ส่วนจุดแข็งหลัก (Strengths Section)</h3>
            <span className="w-fit rounded-full bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 shadow-sm ring-1 ring-slate-100">
              Strategic Assets
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-10">
            {/* Header Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block px-2 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">คำโปรย (Kicker)</label>
                  <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl shadow-inner border-none focus:ring-4 focus:ring-[#D4AF37]/10" value={langContent.strengthKicker} onChange={(e) => updateLang("strengthKicker", e.target.value)} placeholder="Strength kicker" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block px-2 text-[10px] font-bold uppercase tracking-widest text-[#002548]">หัวข้อบรรทัด 1</label>
                    <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl shadow-inner border-none focus:ring-4 focus:ring-[#002548]/10" value={langContent.strengthTitle[0]} onChange={(e) => updateStrengthTitle(0, e.target.value)} placeholder="Title line 1" />
                  </div>
                  <div>
                    <label className="mb-2 block px-2 text-[10px] font-bold uppercase tracking-widest text-[#002548]">หัวข้อบรรทัด 2</label>
                    <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl shadow-inner border-none focus:ring-4 focus:ring-[#002548]/10" value={langContent.strengthTitle[1]} onChange={(e) => updateStrengthTitle(1, e.target.value)} placeholder="Title line 2" />
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-2 block px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">เนื้อหาบรรยายหลัก</label>
                <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[148px] shadow-inner border-none focus:ring-4 focus:ring-slate-200" value={langContent.strengthBody} onChange={(e) => updateLang("strengthBody", e.target.value)} placeholder="Strength body" />
              </div>
            </div>

            {/* Interactive Grid of 4 Strength Cards */}
            <div className="pt-8 border-t border-slate-50">
              <div className="mb-8 flex flex-col gap-2">
                <label className="px-2 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Interactive Strength Dashboard</label>
                <h4 className="px-2 text-2xl font-bold text-slate-800">
                  จุดแข็งทั้ง 4 ด้าน <span className="text-slate-400 font-medium">(Interactive Cards)</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {langContent.strengthCards.map((card, index) => (
                  <div 
                    key={index}
                    onClick={() => handleEditStrength(index)}
                    className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,37,72,0.08)] hover:-translate-y-2 active:scale-[0.98] cursor-pointer"
                  >
                    {/* Badge */}
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 font-black text-[#002548] shadow-sm transition-all duration-500 group-hover:bg-[#D4AF37] group-hover:text-white group-hover:shadow-lg group-hover:scale-110">
                      {index + 1}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-6 rounded-full bg-[#D4AF37]" />
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Strength {index + 1}</label>
                      </div>
                      <h5 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-[#002548] transition-colors">
                        {card.title || `Strength ${index + 1}`}
                      </h5>
                      <p className="line-clamp-3 text-sm font-medium leading-relaxed text-slate-400">
                        {card.body || "คลิกเพื่อเพิ่มรายละเอียดจุดแข็งด้านนี้..."}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#002548] opacity-60">Edit Card</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-[#002548] group-hover:text-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MODAL FOR STRENGTH CARD EDITING */}
          <AdminPortal>
            <div className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 transition-all duration-500 ${isStrengthModalOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`}>
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsStrengthModalOpen(false)} />
              
              <div className={`relative w-full max-w-2xl overflow-hidden rounded-3xl md:rounded-[3.5rem] bg-white shadow-2xl transition-all duration-700 ${isStrengthModalOpen ? "translate-y-0 scale-100" : "translate-y-12 scale-95"}`} style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 px-6 md:px-10 py-6 md:py-8">
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-[1rem] md:rounded-[1.25rem] bg-[#002548] text-white shadow-xl ring-4 md:ring-8 ring-[#002548]/5">
                      <span className="text-xl md:text-2xl font-black">{activeStrengthIndex + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">แก้ไขจุดแข็งด้านที่ {activeStrengthIndex + 1}</h3>
                      <p className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Strength Module Editor</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsStrengthModalOpen(false)}
                    className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-100 transition-all hover:bg-slate-50 hover:text-slate-800 hover:rotate-90 duration-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-10 space-y-6 md:space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-6">
                    <div>
                      <label className="mb-3 block px-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        หัวข้อจุดแข็ง <span className="text-[#D4AF37]">(Card Title)</span>
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-[1.25rem] md:rounded-[1.5rem] border-none bg-slate-50 px-5 md:px-6 py-4 md:py-5 font-kanit text-base md:text-lg font-bold text-[#002548] shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 transition-all"
                        value={langContent.strengthCards[activeStrengthIndex]?.title || ""}
                        onChange={(e) => updateStrengthCard(activeStrengthIndex, "title", e.target.value)}
                        placeholder="กรอกชื่อจุดแข็ง เช่น ระบบขนส่งที่แม่นยำ"
                      />
                    </div>

                    <div>
                      <label className="mb-3 block px-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        เนื้อหารายละเอียด <span className="text-slate-300">(Card Description)</span>
                      </label>
                      <textarea
                        rows={5}
                        className="w-full resize-none rounded-[1.25rem] md:rounded-[1.5rem] border-none bg-slate-50 px-5 md:px-6 py-4 md:py-6 font-kanit text-sm md:text-base leading-relaxed text-slate-600 shadow-inner focus:ring-4 focus:ring-slate-100 transition-all"
                        value={langContent.strengthCards[activeStrengthIndex]?.body || ""}
                        onChange={(e) => updateStrengthCard(activeStrengthIndex, "body", e.target.value)}
                        placeholder="กรอกรายละเอียดอธิบายจุดแข็งด้านนี้..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-[1.5rem] md:rounded-[2rem] bg-[#002548]/5 p-5 md:p-6 border border-[#002548]/10">
                    <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-[#002548] text-white shadow-lg">
                      <Lightbulb className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <p className="text-[11px] md:text-xs font-semibold leading-relaxed text-[#002548]/70">
                      รายละเอียดที่กระชับและเข้าใจง่าย จะช่วยให้ลูกค้าเข้าใจถึงความพรีเมียมและความมืออาชีพของเราได้อย่างรวดเร็ว
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-4 border-t border-slate-50 bg-slate-50/50 px-6 md:px-10 py-6 md:py-8">
                  <button 
                    onClick={() => setIsStrengthModalOpen(false)}
                    className="w-full md:w-auto rounded-xl md:rounded-2xl bg-[#002548] px-10 md:px-12 py-3.5 md:py-4 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white shadow-2xl transition-all hover:bg-slate-800 hover:shadow-slate-800/20 active:scale-95"
                  >
                    Confirm & Close
                  </button>
                </div>
              </div>
            </div>
          </AdminPortal>
        </section>

        {/* LEADERS SECTION - PREMIUM DASHBOARD STYLE */}
        <section className="bg-white border border-slate-100 rounded-[2rem] md:rounded-[3rem] shadow-sm overflow-hidden text-[16px]">
          <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-slate-800">5. ส่วนทีมงานที่ขับเคลื่อนองค์กร (The Teams)</h3>
            <span className="w-fit rounded-full bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 shadow-sm ring-1 ring-slate-100">
              Operational Teams
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-10 text-[16px]">
            {/* Header Text Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-[16px]">
              <div>
                <label className="mb-3 block px-2 text-[10px] font-bold uppercase tracking-widest text-[#002548]">หัวข้อส่วนทีมงาน</label>
                <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl shadow-inner border-none focus:ring-4 focus:ring-[#002548]/10 text-lg font-bold" value={langContent.leadersTitle} onChange={(e) => updateLang("leadersTitle", e.target.value)} placeholder="Leader section title" />
              </div>
              <div>
                <label className="mb-3 block px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">คำอธิบายภาพรวมทีม</label>
                <textarea className="w-full px-6 py-4 bg-slate-50 rounded-2xl min-h-[100px] shadow-inner border-none focus:ring-4 focus:ring-slate-100 leading-relaxed" value={langContent.leadersBody} onChange={(e) => updateLang("leadersBody", e.target.value)} placeholder="Leader section body" />
              </div>
            </div>

            {/* Interactive Grid of 3 Teams */}
            <div className="pt-8 border-t border-slate-50 text-[16px]">
              <div className="mb-8 flex flex-col gap-2">
                <label className="px-2 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Operational Excellence Dashboard</label>
                <h4 className="px-2 text-2xl font-bold text-slate-800">
                  ทีมหลักทั้ง 3 ฝ่าย <span className="text-slate-400 font-medium">(Interactive Cards)</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-[16px]">
                {langContent.leaders.map((leader, index) => (
                  <div 
                    key={index}
                    onClick={() => handleEditLeader(index)}
                    className="group relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all duration-700 hover:shadow-[0_25px_60px_rgba(0,37,72,0.1)] hover:-translate-y-3 active:scale-[0.98] cursor-pointer"
                  >
                    {/* Visual Asset Preview */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={leader.image || "/images/team-sourcing-new.jpg"}
                        alt={leader.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#002548]/90 via-[#002548]/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      
                      {/* Hover Label */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                        <div className="translate-y-4 rounded-full bg-white px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.25em] text-[#002548] shadow-2xl transition-transform duration-500 group-hover:translate-y-0">
                          Configure Team
                        </div>
                      </div>

                      {/* Floating Badge */}
                      <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 shadow-xl backdrop-blur-md">
                        <Users className="h-5 w-5 text-[#002548]" />
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="p-8 md:p-10 text-[16px]">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="h-1.5 w-10 rounded-full bg-[#D4AF37]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Department {index + 1}</span>
                      </div>
                      <h5 className="mb-2 text-xl md:text-2xl font-bold text-slate-800 tracking-tight group-hover:text-[#002548] transition-colors">
                        {leader.name || `Team ${index + 1}`}
                      </h5>
                      <p className="mb-6 text-[11px] md:text-[13px] font-bold text-slate-400 uppercase tracking-widest">
                        {leader.role || "ตำแหน่ง/หน้าที่..."}
                      </p>
                      <p className="line-clamp-2 text-sm md:text-base font-medium leading-relaxed italic text-slate-500/80">
                        &quot;{leader.quote || "คลิกเพื่อเพิ่มคำขวัญหรือจุดเน้นของทีมนี้..."}&quot;
                      </p>
                      
                      <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                        <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#002548]">
                          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                          <span>Customizable</span>
                        </div>
                        <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-[#002548] group-hover:text-white group-hover:rotate-12">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MODAL FOR LEADER EDITING */}
          <AdminPortal>
            <div className={`fixed inset-0 z-[99999] flex items-center justify-center p-2 md:p-4 transition-all duration-500 ${isLeaderModalOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`}>
              <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-lg" onClick={() => setIsLeaderModalOpen(false)} />
              
              <div className={`relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] md:rounded-[4rem] bg-white shadow-2xl transition-all duration-700 ${isLeaderModalOpen ? "translate-y-0 scale-100" : "translate-y-16 scale-95"}`} style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 px-6 md:px-12 py-6 md:py-10">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl md:rounded-3xl bg-[#002548] text-white shadow-2xl ring-4 md:ring-12 ring-[#002548]/5">
                      <Users className="h-6 w-6 md:h-8 md:w-8" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight">จัดการข้อมูลฝ่ายบริหารจัดการ</h3>
                      <p className="hidden md:block text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-1.5">Organizational Team Management</p>
                    </div>
                  </div>
                  <button 
                   onClick={() => setIsLeaderModalOpen(false)}
                   className="flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-xl ring-1 ring-slate-100 transition-all hover:bg-slate-50 hover:text-slate-800 hover:rotate-90 duration-700"
                  >
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>

                </div>

                {/* Modal Body */}
                <div className="max-h-[70vh] overflow-y-auto p-6 md:p-12 custom-scrollbar text-[16px]">
                  <div className="grid grid-cols-1 gap-8 md:gap-14 lg:grid-cols-[0.8fr_1.2fr]">
                    
                    {/* Left Column: Image Management */}
                    <div className="space-y-6 md:space-y-8">
                      <div>
                        <label className="mb-3 md:mb-4 block px-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">รูปถ่ายทีมงาน (Visual Asset)</label>
                        <CmsAssetUploadButton
                          src={langContent.leaders[activeLeaderIndex]?.image}
                          alt="Leader Team"
                          aspectClassName="aspect-[3/4]"
                          className="rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl ring-[12px] md:ring-[16px] ring-slate-50 transition-all hover:ring-[#002548]/10 duration-700"
                          onUploaded={(url) => updateLeader(activeLeaderIndex, "image", url)}
                          pathPrefix="about"
                        />
                        <p className="mt-2 text-center text-[11px] font-semibold text-[#002548]/70">ขนาดแนะนำ: 1200 x 1600 px</p>
                      </div>
                      <div className="flex items-start gap-4 md:gap-5 rounded-[2rem] md:rounded-[2.5rem] bg-[#002548]/5 p-6 md:p-8 border border-[#002548]/10">
                        <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full bg-[#002548] text-white shadow-xl mt-1">
                          <Lightbulb className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <p className="text-[11px] md:text-sm font-semibold leading-relaxed text-[#002548]/80">
                          ใช้รูปถ่ายทีมงานในสถานที่จริง เพื่อแสดงถึงความเชี่ยวชาญและความเป็นมืออาชีพในหน้างานจริง
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Information Controls */}
                    <div className="space-y-8 md:space-y-10">
                      <div>
                        <label className="mb-3 md:mb-4 block px-4 text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">ชื่อทีม / ฝ่าย (Department Name)</label>
                        <input
                          type="text"
                          className="w-full rounded-[1.5rem] md:rounded-[2rem] border-none bg-slate-50 px-6 md:px-8 py-5 md:py-6 font-kanit text-lg md:text-xl font-bold text-slate-800 shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 transition-all"
                          value={langContent.leaders[activeLeaderIndex]?.name || ""}
                          onChange={(e) => updateLeader(activeLeaderIndex, "name", e.target.value)}
                          placeholder="เช่น ทีมโลจิสติกส์"
                        />
                      </div>

                      <div>
                        <label className="mb-3 md:mb-4 block px-4 text-[11px] font-bold uppercase tracking-widest text-[#002548]">บทบาทหน้าที่ (Role & Responsibilities)</label>
                        <input
                          type="text"
                          className="w-full rounded-[1.5rem] md:rounded-[2rem] border-none bg-slate-50 px-6 md:px-8 py-5 md:py-6 font-kanit text-base md:text-lg font-bold text-[#002548]/70 shadow-inner focus:ring-4 focus:ring-[#002548]/10 transition-all"
                          value={langContent.leaders[activeLeaderIndex]?.role || ""}
                          onChange={(e) => updateLeader(activeLeaderIndex, "role", e.target.value)}
                          placeholder="เช่น ควบคุมการขนส่งและเส้นทาง"
                        />
                      </div>

                      <div>
                        <label className="mb-3 md:mb-4 block px-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">คำขวัญหรือจุดเน้น (Team Quote / Focus)</label>
                        <textarea
                          rows={4}
                          className="w-full resize-none rounded-[1.5rem] md:rounded-[2rem] border-none bg-slate-50 px-6 md:px-8 py-6 md:py-8 font-kanit text-base md:text-lg font-medium leading-relaxed italic text-slate-500 shadow-inner focus:ring-4 focus:ring-slate-100 transition-all"
                          value={langContent.leaders[activeLeaderIndex]?.quote || ""}
                          onChange={(e) => updateLeader(activeLeaderIndex, "quote", e.target.value)}
                          placeholder="กรอกประโยคสั้นๆ ที่แสดงถึงความมุ่งมั่นของทีม..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-4 md:gap-5 border-t border-slate-50 bg-slate-50/50 px-6 md:px-12 py-6 md:py-10">
                  <button 
                    onClick={() => setIsLeaderModalOpen(false)}
                    className="w-full md:w-auto rounded-[1.5rem] md:rounded-[2rem] bg-[#002548] px-10 md:px-14 py-4 md:py-5 text-xs md:text-sm font-black uppercase tracking-[0.4em] text-white shadow-[0_15px_40px_rgba(0,37,72,0.3)] transition-all hover:bg-slate-800 hover:shadow-slate-800/20 active:scale-95"
                  >
                    Complete & Apply
                  </button>
                </div>
              </div>
            </div>
          </AdminPortal>
        </section>
      </div>
    </div>
  );
}
