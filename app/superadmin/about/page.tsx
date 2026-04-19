"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AdminPortal } from "@/components/admin-portal";
import { CmsAssetUploadButton } from "@/components/cms-asset-upload-button";
import { XCircle } from "lucide-react";

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
      { name: "出口市场团队", role: "市场协调", quote: "团队引言", image: "/images/marketing-world-map.png" },
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
          {lang}
        </button>
      ))}
    </div>
  );
}

export default function AboutManagement() {
  const [activeLang, setActiveLang] = useState<Locale>("th");
  const [content, setContent] = useState<AboutContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "confirming" | "saving" | "success" | "error">("idle");

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
    try {
      const { error } = await supabase.from("page_content").upsert(
        {
          page_name: "about",
          content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "page_name" },
      );

      if (error) {
        throw error;
      }

      setSaveStatus("success");
    } catch (error) {
      console.error("Error saving about content:", error);
      setSaveStatus("error");
    }
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
        onClick={() => setSaveStatus("confirming")}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-2xl z-50 transition-all hover:-translate-y-2 active:scale-90 bg-[#002548] text-white hover:bg-slate-800"
        title="Save"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
      </button>

      <AdminPortal>
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-500 ${saveStatus !== "idle" ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => saveStatus !== "saving" && setSaveStatus("idle")}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-10 shadow-2xl text-center">
            {saveStatus === "confirming" && (
              <div className="space-y-8 py-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">ยืนยันการบันทึก?</h3>
                  <p className="text-slate-500 mt-2 text-sm font-medium leading-relaxed px-4">บันทึกข้อมูลหน้าเกี่ยวกับเราทั้งหมดลงฐานข้อมูล</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setSaveStatus("idle")} className="flex-1 py-3 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors text-sm uppercase tracking-widest">ยกเลิก</button>
                  <button onClick={handleSave} className="flex-1 py-3 bg-[#002548] text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all text-sm uppercase tracking-widest">บันทึก</button>
                </div>
              </div>
            )}
            {saveStatus === "saving" && (
              <div className="space-y-6 py-6">
                <div className="w-16 h-16 border-4 border-[#002548]/10 border-t-[#002548] rounded-full animate-spin mx-auto"></div>
                <p className="text-[#002548] font-bold animate-pulse uppercase tracking-widest text-sm">Saving...</p>
              </div>
            )}
            {saveStatus === "success" && (
              <div className="space-y-8 py-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">บันทึกเรียบร้อย</h3>
                  <p className="text-slate-500 mt-2 text-sm font-medium leading-relaxed px-4">หน้า About จะใช้ข้อมูลชุดนี้ทันทีเมื่อโหลดใหม่</p>
                </div>
                <button onClick={() => setSaveStatus("idle")} className="w-full py-3 bg-[#002548] text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all text-sm uppercase tracking-widest">ตกลง</button>
              </div>
            )}
            {saveStatus === "error" && (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto"><XCircle className="w-9 h-9" /></div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">เกิดข้อผิดพลาด</h3>
                  <p className="text-slate-500 mt-2 text-sm font-medium leading-relaxed px-4">ไม่สามารถบันทึกข้อมูลได้ในขณะนี้</p>
                </div>
                <button onClick={() => setSaveStatus("confirming")} className="w-full py-3 bg-red-500 text-white rounded-2xl font-bold shadow-lg hover:bg-red-600 transition-all text-sm uppercase tracking-widest">ลองใหม่</button>
              </div>
            )}
          </div>
        </div>
      </AdminPortal>

      <LanguageTabs activeLang={activeLang} onChange={setActiveLang} />

      <div className="space-y-10">
        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-xl font-bold text-slate-800">1. Hero</h3>
          </div>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.heroTitle[0]} onChange={(e) => updateHeroTitle(0, e.target.value)} placeholder="Hero title line 1" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.heroTitle[1]} onChange={(e) => updateHeroTitle(1, e.target.value)} placeholder="Hero title line 2" />
              <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[140px]" value={langContent.heroBody} onChange={(e) => updateLang("heroBody", e.target.value)} placeholder="Hero body" />
              
            </div>
            <CmsAssetUploadButton
              src={content.images.hero}
              alt="About hero preview"
              aspectClassName="aspect-video"
              onUploaded={(url) => updateImage("hero", url)}
              pathPrefix="about"
            />
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-xl font-bold text-slate-800">2. Story</h3>
          </div>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.storyLabel} onChange={(e) => updateLang("storyLabel", e.target.value)} placeholder="Story label" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.storyTitle} onChange={(e) => updateLang("storyTitle", e.target.value)} placeholder="Story title" />
              <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[180px]" value={langContent.storyBody} onChange={(e) => updateLang("storyBody", e.target.value)} placeholder="Story body" />
              
            </div>
            <CmsAssetUploadButton
              src={content.images.story}
              alt="About story preview"
              aspectClassName="aspect-[4/5]"
              onUploaded={(url) => updateImage("story", url)}
              pathPrefix="about"
            />
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-xl font-bold text-slate-800">3. Mission / Sustainability</h3>
          </div>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.missionTitle} onChange={(e) => updateLang("missionTitle", e.target.value)} placeholder="Mission title" />
              <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[160px]" value={langContent.missionBody} onChange={(e) => updateLang("missionBody", e.target.value)} placeholder="Mission body" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.missionCta} onChange={(e) => updateLang("missionCta", e.target.value)} placeholder="Mission CTA" />
            </div>
            <div className="space-y-4">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.sustainabilityTitle} onChange={(e) => updateLang("sustainabilityTitle", e.target.value)} placeholder="Sustainability title" />
              <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[160px]" value={langContent.sustainabilityBody} onChange={(e) => updateLang("sustainabilityBody", e.target.value)} placeholder="Sustainability body" />
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-xl font-bold text-slate-800">4. Strengths Section</h3>
          </div>
          <div className="p-8 space-y-5">
            <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.strengthKicker} onChange={(e) => updateLang("strengthKicker", e.target.value)} placeholder="Strength kicker" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.strengthTitle[0]} onChange={(e) => updateStrengthTitle(0, e.target.value)} placeholder="Strength title line 1" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.strengthTitle[1]} onChange={(e) => updateStrengthTitle(1, e.target.value)} placeholder="Strength title line 2" />
            </div>
            <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[140px]" value={langContent.strengthBody} onChange={(e) => updateLang("strengthBody", e.target.value)} placeholder="Strength body" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {langContent.strengthCards.map((card, index) => (
                <div key={index} className="rounded-[2rem] border border-slate-100 p-5 space-y-4">
                  <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={card.title} onChange={(e) => updateStrengthCard(index, "title", e.target.value)} placeholder={`Card ${index + 1} title`} />
                  <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[120px]" value={card.body} onChange={(e) => updateStrengthCard(index, "body", e.target.value)} placeholder={`Card ${index + 1} body`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-xl font-bold text-slate-800">5. Leaders</h3>
          </div>
          <div className="p-8 space-y-5">
            <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.leadersTitle} onChange={(e) => updateLang("leadersTitle", e.target.value)} placeholder="Leader section title" />
            <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[140px]" value={langContent.leadersBody} onChange={(e) => updateLang("leadersBody", e.target.value)} placeholder="Leader section body" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {langContent.leaders.map((leader, index) => (
                <div key={index} className="rounded-[2rem] border border-slate-100 p-5 space-y-4">
                  <CmsAssetUploadButton
                    src={leader.image}
                    alt={leader.name}
                    aspectClassName="aspect-[3/4]"
                    className="rounded-[1.5rem]"
                    onUploaded={(url) => updateLeader(index, "image", url)}
                    pathPrefix="about"
                  />
                  <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={leader.name} onChange={(e) => updateLeader(index, "name", e.target.value)} placeholder="Name" />
                  <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={leader.role} onChange={(e) => updateLeader(index, "role", e.target.value)} placeholder="Role" />
                  <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[120px]" value={leader.quote} onChange={(e) => updateLeader(index, "quote", e.target.value)} placeholder="Quote" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
