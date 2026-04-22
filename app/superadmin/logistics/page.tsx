"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CmsAssetUploadButton } from "@/components/cms-asset-upload-button";
import { CmsSaveToast, type CmsSaveStatus } from "@/components/cms-save-toast";
import { savePageContent } from "@/lib/actions";

type Locale = "th" | "en" | "zh";

type LogisticsStep = { title: string; body: string };
type Destination = { city: string; market: string };
type Feature = { title: string; body: string };

type LogisticsLanguageContent = {
  heroTitle: string[];
  heroBody: string;
  primaryCta: string;
  secondaryCta: string;
  destinationHeading: string;
  countryLabels: { china: string; thailand: string };
  supportTitle: string;
  supportBody: string;
  supportPoints: string[];
  mapKicker: string;
  mapTitle: string;
  mapBody: string;
  mapOriginLabel: string;
  destinations: Destination[];
  processTitle: string;
  processBody: string;
  processSteps: LogisticsStep[];
  featureTitle: string;
  featureBody: string;
  features: Feature[];
  ctaTitle: string;
  ctaBody: string;
};

type LogisticsContent = Record<Locale, LogisticsLanguageContent> & {
  images: {
    heroVideo: string;
    heroPoster: string;
    route: string;
    packaging: string;
  };
};

const defaultContent: LogisticsContent = {
  th: {
    heroTitle: ["โลจิสติกส์ที่แม่นยำ", "เพื่อสินค้าส่งออก"],
    heroBody: "ข้อความ Hero",
    primaryCta: "ขอคำปรึกษา",
    secondaryCta: "สอบถามบริการ",
    destinationHeading: "มณฑลและตลาดส่งออกหลัก",
    countryLabels: { china: "จีน", thailand: "ไทย" },
    supportTitle: "ระบบขนส่งที่เชื่อมตั้งแต่ต้นทางถึงปลายทาง",
    supportBody: "ข้อความ support section",
    supportPoints: ["จุดเด่น 1", "จุดเด่น 2", "จุดเด่น 3"],
    mapKicker: "Transportation Network",
    mapTitle: "เส้นทางปลายทางหลักของการส่งออก",
    mapBody: "ข้อความแผนที่",
    mapOriginLabel: "THAILAND\nExport Origin",
    destinations: [
      { city: "กวางโจว", market: "Jiangnan Market" },
      { city: "เหอหนาน", market: "Wanbang Market" },
      { city: "ปักกิ่ง", market: "Gaobeidian Market" },
      { city: "ชิงฉง", market: "International Market" },
      { city: "ลินอี้", market: "Shandong" },
      { city: "ฉางซา", market: "Hunan" },
    ],
    processTitle: "ขั้นตอนการขนถ่ายและจัดส่ง",
    processBody: "ข้อความ process body",
    processSteps: [
      { title: "จัดเตรียมลอตสินค้า", body: "รายละเอียด" },
      { title: "แพ็กและขนถ่าย", body: "รายละเอียด" },
      { title: "ส่งต่อสู่ตลาดปลายทาง", body: "รายละเอียด" },
    ],
    featureTitle: "สิ่งที่ทีมโลจิสติกส์ของเราดูแล",
    featureBody: "ข้อความ features body",
    features: [
      { title: "วางแผนเส้นทาง", body: "รายละเอียด" },
      { title: "ระบบแพ็กกิ้ง", body: "รายละเอียด" },
      { title: "ควบคุมการโหลด", body: "รายละเอียด" },
      { title: "เชื่อมต่อตลาดปลายทาง", body: "รายละเอียด" },
    ],
    ctaTitle: "พร้อมวางแผนระบบขนส่ง",
    ctaBody: "ข้อความ CTA",
  },
  en: {
    heroTitle: ["Precise Logistics", "for Export Goods"],
    heroBody: "Hero copy",
    primaryCta: "Get Consultation",
    secondaryCta: "Request Service Info",
    destinationHeading: "Primary China destinations",
    countryLabels: { china: "China", thailand: "Thailand" },
    supportTitle: "A transportation system that links origin to destination",
    supportBody: "Support body",
    supportPoints: ["Point 1", "Point 2", "Point 3"],
    mapKicker: "Transportation Network",
    mapTitle: "Key Destination Routes for Export",
    mapBody: "Map body",
    mapOriginLabel: "THAILAND\nExport Origin",
    destinations: [
      { city: "Guangzhou", market: "Jiangnan Market" },
      { city: "Henan", market: "Wanbang Market" },
      { city: "Beijing", market: "Gaobeidian Market" },
      { city: "Qingchong", market: "International Market" },
      { city: "Linyi", market: "Shandong" },
      { city: "Changsha", market: "Hunan" },
    ],
    processTitle: "Handling and Delivery Stages",
    processBody: "Process body",
    processSteps: [
      { title: "Lot Preparation", body: "Detail" },
      { title: "Packing and Loading", body: "Detail" },
      { title: "Destination Distribution", body: "Detail" },
    ],
    featureTitle: "What our logistics team manages",
    featureBody: "Feature section body",
    features: [
      { title: "Route Planning", body: "Detail" },
      { title: "Packing System", body: "Detail" },
      { title: "Loading Control", body: "Detail" },
      { title: "Destination Coordination", body: "Detail" },
    ],
    ctaTitle: "Ready to build the right transportation plan",
    ctaBody: "CTA body",
  },
  zh: {
    heroTitle: ["精准物流体系", "服务出口货品"],
    heroBody: "主视觉文案",
    primaryCta: "获取咨询",
    secondaryCta: "咨询服务",
    destinationHeading: "重点出口目的地",
    countryLabels: { china: "中国", thailand: "泰国" },
    supportTitle: "连接产地与终端市场的运输体系",
    supportBody: "说明文案",
    supportPoints: ["要点 1", "要点 2", "要点 3"],
    mapKicker: "运输网络",
    mapTitle: "重点出口目的地路线",
    mapBody: "地图说明",
    mapOriginLabel: "THAILAND\n出口起点",
    destinations: [
      { city: "广州", market: "江南市场" },
      { city: "河南", market: "万邦市场" },
      { city: "北京", market: "高碑店市场" },
      { city: "青崇", market: "国际市场" },
      { city: "临沂", market: "山东" },
      { city: "长沙", market: "湖南" },
    ],
    processTitle: "装卸与发运阶段",
    processBody: "流程说明",
    processSteps: [
      { title: "批次准备", body: "详情" },
      { title: "包装与装载", body: "详情" },
      { title: "终端分发", body: "详情" },
    ],
    featureTitle: "物流团队负责重点",
    featureBody: "特性说明",
    features: [
      { title: "路线规划", body: "详情" },
      { title: "包装体系", body: "详情" },
      { title: "装载控制", body: "详情" },
      { title: "终端衔接", body: "详情" },
    ],
    ctaTitle: "为您的货品规划运输方案",
    ctaBody: "CTA 说明",
  },
  images: {
    heroVideo: "/videos/logistics-hero-ship.mp4",
    heroPoster: "/images/hero-logistics.jpg",
    route: "/images/logistics-route.jpg",
    packaging: "/images/team-logistics.jpg",
  },
};

function LanguageTabs({ activeLang, onChange }: { activeLang: Locale; onChange: (lang: Locale) => void }) {
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

export default function LogisticsAdmin() {
  const [activeLang, setActiveLang] = useState<Locale>("th");
  const [content, setContent] = useState<LogisticsContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<CmsSaveStatus>("idle");
  const [adminLang, setAdminLang] = useState<string>("th");

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
          .eq("page_name", "logistics")
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
        console.error("Error fetching logistics content:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const updateLang = <K extends keyof LogisticsLanguageContent>(key: K, value: LogisticsLanguageContent[K]) => {
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

  const updateSupportPoint = (index: number, value: string) => {
    const next = [...content[activeLang].supportPoints];
    next[index] = value;
    updateLang("supportPoints", next);
  };

  const updateDestination = (index: number, key: keyof Destination, value: string) => {
    const next = [...content[activeLang].destinations];
    next[index] = { ...next[index], [key]: value };
    updateLang("destinations", next);
  };

  const updateProcessStep = (index: number, key: keyof LogisticsStep, value: string) => {
    const next = [...content[activeLang].processSteps];
    next[index] = { ...next[index], [key]: value };
    updateLang("processSteps", next);
  };

  const updateFeature = (index: number, key: keyof Feature, value: string) => {
    const next = [...content[activeLang].features];
    next[index] = { ...next[index], [key]: value };
    updateLang("features", next);
  };

  const updateImage = (key: keyof LogisticsContent["images"], value: string) => {
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
    const result = await savePageContent("logistics", content);

    if (result.success) {
      setSaveStatus("success");
    } else {
      setSaveStatus("error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-kanit">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#002548]/20 border-t-[#002548] rounded-full animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse">Loading logistics content...</p>
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
            จัดการ <span className="text-[#002548]">โลจิสติกส์</span>
          </h2>
          <p className="text-slate-400 font-medium mt-3 text-lg">ผูกทุก section ของหน้า Logistics เข้ากับ CMS</p>
        </div>
      </section>

      <button onClick={handleSave} className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-2xl z-50 transition-all hover:-translate-y-2 active:scale-90 bg-[#002548] text-white hover:bg-slate-800" title="Save">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
      </button>

      <CmsSaveToast
        status={saveStatus}
        onClear={() => setSaveStatus("idle")}
        messages={{
          saving: { th: "กำลังบันทึกข้อมูลหน้าโลจิสติกส์...", en: "Saving Logistics page changes...", zh: "正在保存物流页内容..." }[adminLang as "th" | "en" | "zh"] || "Saving...",
          success: { th: "บันทึกข้อมูลหน้าโลจิสติกส์เรียบร้อยแล้ว", en: "Logistics page saved successfully.", zh: "物流页内容保存成功。" }[adminLang as "th" | "en" | "zh"] || "Saved.",
          error: { th: "ไม่สามารถบันทึกข้อมูลหน้าโลจิสติกส์ได้", en: "Unable to save the Logistics page.", zh: "无法保存物流页内容。" }[adminLang as "th" | "en" | "zh"] || "Error.",
        }}
      />

      <LanguageTabs activeLang={activeLang} onChange={setActiveLang} />

      <div className="space-y-10">
        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30"><h3 className="text-xl font-bold text-slate-800">1. Hero</h3></div>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.heroTitle[0]} onChange={(e) => updateHeroTitle(0, e.target.value)} placeholder="Hero title line 1" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.heroTitle[1]} onChange={(e) => updateHeroTitle(1, e.target.value)} placeholder="Hero title line 2" />
              <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[140px]" value={langContent.heroBody} onChange={(e) => updateLang("heroBody", e.target.value)} placeholder="Hero body" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.primaryCta} onChange={(e) => updateLang("primaryCta", e.target.value)} placeholder="Primary CTA" />
                <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.secondaryCta} onChange={(e) => updateLang("secondaryCta", e.target.value)} placeholder="Secondary CTA" />
              </div>
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={content.images.heroVideo} onChange={(e) => updateImage("heroVideo", e.target.value)} placeholder="Hero video path" />
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] bg-slate-900 text-white p-6 text-sm">{content.images.heroVideo}</div>
              <div className="space-y-2">
                <CmsAssetUploadButton
                  src={content.images.heroPoster}
                  alt="Hero poster preview"
                  aspectClassName="aspect-video"
                  onUploaded={(url) => updateImage("heroPoster", url)}
                  pathPrefix="logistics"
                />
                <p className="text-center text-[11px] font-semibold text-[#002548]/70">ขนาดแนะนำ: 1920 x 1080 px</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30"><h3 className="text-xl font-bold text-slate-800">2. Support / Route Image</h3></div>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.supportTitle} onChange={(e) => updateLang("supportTitle", e.target.value)} placeholder="Support title" />
              <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[140px]" value={langContent.supportBody} onChange={(e) => updateLang("supportBody", e.target.value)} placeholder="Support body" />
              {langContent.supportPoints.map((point, index) => (
                <input key={index} className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={point} onChange={(e) => updateSupportPoint(index, e.target.value)} placeholder={`Support point ${index + 1}`} />
              ))}
            </div>
            <div className="space-y-2">
              <CmsAssetUploadButton
                src={content.images.route}
                alt="Route preview"
                aspectClassName="aspect-[4/3]"
                onUploaded={(url) => updateImage("route", url)}
                pathPrefix="logistics"
              />
              <p className="text-center text-[11px] font-semibold text-[#002548]/70">ขนาดแนะนำ: 1200 x 900 px</p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30"><h3 className="text-xl font-bold text-slate-800">3. Map / Destinations</h3></div>
          <div className="p-8 space-y-4">
            <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.mapKicker} onChange={(e) => updateLang("mapKicker", e.target.value)} placeholder="Map kicker" />
            <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.mapTitle} onChange={(e) => updateLang("mapTitle", e.target.value)} placeholder="Map title" />
            <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[140px]" value={langContent.mapBody} onChange={(e) => updateLang("mapBody", e.target.value)} placeholder="Map body" />
            <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.destinationHeading} onChange={(e) => updateLang("destinationHeading", e.target.value)} placeholder="Destination heading" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.mapOriginLabel} onChange={(e) => updateLang("mapOriginLabel", e.target.value)} placeholder="Origin label" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.countryLabels.thailand} onChange={(e) => updateLang("countryLabels", { ...langContent.countryLabels, thailand: e.target.value })} placeholder="Thailand label" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.countryLabels.china} onChange={(e) => updateLang("countryLabels", { ...langContent.countryLabels, china: e.target.value })} placeholder="China label" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {langContent.destinations.map((destination, index) => (
                <div key={index} className="rounded-[1.5rem] border border-slate-100 p-4 space-y-3">
                  <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={destination.city} onChange={(e) => updateDestination(index, "city", e.target.value)} placeholder={`Destination ${index + 1} city`} />
                  <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={destination.market} onChange={(e) => updateDestination(index, "market", e.target.value)} placeholder={`Destination ${index + 1} market`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30"><h3 className="text-xl font-bold text-slate-800">4. Process / Features / CTA</h3></div>
          <div className="p-8 space-y-5">
            <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.processTitle} onChange={(e) => updateLang("processTitle", e.target.value)} placeholder="Process title" />
            <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[140px]" value={langContent.processBody} onChange={(e) => updateLang("processBody", e.target.value)} placeholder="Process body" />
            <div className="space-y-2">
              <CmsAssetUploadButton
                src={content.images.packaging}
                alt="Packaging preview"
                aspectClassName="aspect-[4/3]"
                onUploaded={(url) => updateImage("packaging", url)}
                pathPrefix="logistics"
              />
              <p className="text-center text-[11px] font-semibold text-[#002548]/70">ขนาดแนะนำ: 1200 x 900 px</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {langContent.processSteps.map((step, index) => (
                <div key={index} className="rounded-[1.5rem] border border-slate-100 p-4 space-y-3">
                  <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={step.title} onChange={(e) => updateProcessStep(index, "title", e.target.value)} placeholder={`Step ${index + 1} title`} />
                  <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[120px]" value={step.body} onChange={(e) => updateProcessStep(index, "body", e.target.value)} placeholder={`Step ${index + 1} body`} />
                </div>
              ))}
            </div>
            <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.featureTitle} onChange={(e) => updateLang("featureTitle", e.target.value)} placeholder="Feature title" />
            <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[140px]" value={langContent.featureBody} onChange={(e) => updateLang("featureBody", e.target.value)} placeholder="Feature body" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {langContent.features.map((feature, index) => (
                <div key={index} className="rounded-[1.5rem] border border-slate-100 p-4 space-y-3">
                  <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={feature.title} onChange={(e) => updateFeature(index, "title", e.target.value)} placeholder={`Feature ${index + 1} title`} />
                  <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[120px]" value={feature.body} onChange={(e) => updateFeature(index, "body", e.target.value)} placeholder={`Feature ${index + 1} body`} />
                </div>
              ))}
            </div>
            <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.ctaTitle} onChange={(e) => updateLang("ctaTitle", e.target.value)} placeholder="CTA title" />
            <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[120px]" value={langContent.ctaBody} onChange={(e) => updateLang("ctaBody", e.target.value)} placeholder="CTA body" />
          </div>
        </section>
      </div>
    </div>
  );
}

