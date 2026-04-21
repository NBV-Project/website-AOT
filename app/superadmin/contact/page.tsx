"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CmsAssetUploadButton } from "@/components/cms-asset-upload-button";
import { CmsSaveToast, type CmsSaveStatus } from "@/components/cms-save-toast";
import { savePageContent } from "@/lib/actions";

type Locale = "th" | "en" | "zh";

type SupportPoint = {
  id: string;
  text: string;
};

type ContactLanguageContent = {
  heroTitle: string[];
  heroBody: string;
  primaryCta: string;
  secondaryCta: string;
  introTitle: string;
  introBody: string;
  officeTitle: string;
  address: string[];
  contactTitle: string;
  contactLines: string[];
  formTitle: string;
  formBody: string;
  formLabels: {
    name: string;
    email: string;
    inquiryType: string;
    timeline: string;
    details: string;
  };
  placeholders: {
    name: string;
    email: string;
    timeline: string;
    details: string;
  };
  options: string[];
  submit: string;
  supportTitle: string;
  supportBody: string;
  supportPoints: SupportPoint[];
};

type ContactContent = Record<Locale, ContactLanguageContent> & {
  images: {
    hero: string;
    office: string;
  };
};

const defaultContent: ContactContent = {
  th: {
    heroTitle: ["สอบถามสินค้า", "และการส่งออก"],
    heroBody: "ข้อความ Hero",
    primaryCta: "ส่งคำถาม",
    secondaryCta: "ดูข้อมูลสินค้า",
    introTitle: "ติดต่อทีมงานที่ดูแลสินค้า การส่งออก และตลาดปลายทาง",
    introBody: "ข้อความ intro",
    officeTitle: "สำนักงานใหญ่",
    address: ["388/65-388/66 ถนนนวลจันทร์", "แขวงนวลจันทร์ เขตบึงกุ่ม", "กรุงเทพมหานคร 10230"],
    contactTitle: "ช่องทางติดต่อ",
    contactLines: ["085-289-2451", "contact@asianoverseas.co.th"],
    formTitle: "ส่งรายละเอียดเบื้องต้น",
    formBody: "ข้อความฟอร์ม",
    formLabels: {
      name: "ชื่อผู้ติดต่อ",
      email: "อีเมล",
      inquiryType: "ประเภทการสอบถาม",
      timeline: "ช่วงเวลาที่ต้องการ",
      details: "รายละเอียดความต้องการ",
    },
    placeholders: {
      name: "ชื่อ-นามสกุล",
      email: "อีเมล",
      timeline: "ช่วงเวลาหรือกำหนดส่ง",
      details: "อธิบายความต้องการ",
    },
    options: ["สอบถามสินค้า", "สอบถามการส่งออก", "สอบถามโลจิสติกส์", "สอบถามทั่วไป"],
    submit: "ส่งข้อมูลติดต่อ",
    supportTitle: "เราช่วยตอบคำถามด้านใดบ้าง",
    supportBody: "ข้อความ support",
    supportPoints: [
      { id: "products", text: "ข้อมูลสินค้าและปริมาณที่เหมาะกับคำสั่งซื้อ" },
      { id: "shipping", text: "แนวทางการจัดส่ง" },
      { id: "coordination", text: "การประสานงานเบื้องต้นสำหรับคำสั่งซื้อ" },
    ],
  },
  en: {
    heroTitle: ["Product Inquiry", "and Export Support"],
    heroBody: "Hero copy",
    primaryCta: "Send Inquiry",
    secondaryCta: "View Products",
    introTitle: "Contact the team behind products, exports, and destination coordination",
    introBody: "Intro copy",
    officeTitle: "Head Office",
    address: ["388/65-388/66 Nuanchan Road", "Nuanchan, Bueng Kum", "Bangkok 10230"],
    contactTitle: "Contact Channels",
    contactLines: ["085-289-2451", "contact@asianoverseas.co.th"],
    formTitle: "Share Your Initial Brief",
    formBody: "Form body",
    formLabels: {
      name: "Contact Name",
      email: "Email",
      inquiryType: "Inquiry Type",
      timeline: "Preferred Timeline",
      details: "Project Details",
    },
    placeholders: {
      name: "Full name",
      email: "Email",
      timeline: "Target timing",
      details: "Describe your needs",
    },
    options: ["Product Inquiry", "Export Support", "Logistics Support", "General Inquiry"],
    submit: "Submit Inquiry",
    supportTitle: "What we can help answer",
    supportBody: "Support copy",
    supportPoints: [
      { id: "products", text: "Product information and order volume" },
      { id: "shipping", text: "Shipping guidelines" },
      { id: "coordination", text: "Initial coordination for purchasing plans" },
    ],
  },
  zh: {
    heroTitle: ["咨询产品信息", "与出口安排"],
    heroBody: "主视觉文案",
    primaryCta: "发送咨询",
    secondaryCta: "查看产品",
    introTitle: "联系负责产品、出口与目的地协调的团队",
    introBody: "介绍文案",
    officeTitle: "总部办公室",
    address: ["388/65-388/66 Nuanchan Road", "Nuanchan, Bueng Kum", "Bangkok 10230"],
    contactTitle: "联系方式",
    contactLines: ["085-289-2451", "contact@asianoverseas.co.th"],
    formTitle: "提交初步需求",
    formBody: "表单说明",
    formLabels: {
      name: "联系人姓名",
      email: "电子邮件",
      inquiryType: "咨询类型",
      timeline: "期望时间",
      details: "需求说明",
    },
    placeholders: {
      name: "姓名",
      email: "邮箱",
      timeline: "时间窗口",
      details: "请说明需求",
    },
    options: ["产品咨询", "出口支持", "物流支持", "一般咨询"],
    submit: "提交咨询",
    supportTitle: "我们可以协助哪些问题",
    supportBody: "支持说明",
    supportPoints: [
      { id: "products", text: "产品信息与合适的采购数量" },
      { id: "shipping", text: "运输指南" },
      { id: "coordination", text: "采购计划与发运批次协调" },
    ],
  },
  images: {
    hero: "/images/contact-hero-new.jpg",
    office: "/images/contact-office.jpg",
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

export default function ContactAdmin() {
  const [activeLang, setActiveLang] = useState<Locale>("th");
  const [content, setContent] = useState<ContactContent>(defaultContent);
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
          .eq("page_name", "contact")
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
        console.error("Error fetching contact content:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const updateLang = <K extends keyof ContactLanguageContent>(key: K, value: ContactLanguageContent[K]) => {
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

  const updateAddress = (index: number, value: string) => {
    const next = [...content[activeLang].address];
    next[index] = value;
    updateLang("address", next);
  };

  const updateContactLine = (index: number, value: string) => {
    const next = [...content[activeLang].contactLines];
    next[index] = value;
    updateLang("contactLines", next);
  };

  const updateOption = (index: number, value: string) => {
    const next = [...content[activeLang].options];
    next[index] = value;
    updateLang("options", next);
  };

  const updateSupportPoint = (index: number, value: string) => {
    const next = [...content[activeLang].supportPoints];
    next[index] = { ...next[index], text: value };
    updateLang("supportPoints", next);
  };

  const updateImage = (key: keyof ContactContent["images"], value: string) => {
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
    const result = await savePageContent("contact", content);

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
          <p className="text-slate-400 font-medium animate-pulse">Loading contact content...</p>
        </div>
      </div>
    );
  }

  const langContent = content[activeLang];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 font-kanit">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 tracking-tight text-[32px]">จัดการ <span className="text-[#002548]">ติดต่อเรา</span></h2>
          <p className="text-slate-400 font-medium mt-3 text-lg">ผูกทุก section ของหน้า Contact เข้ากับ CMS</p>
        </div>
      </section>

      <button onClick={handleSave} className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-2xl z-50 transition-all hover:-translate-y-2 active:scale-90 bg-[#002548] text-white hover:bg-slate-800" title="Save">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
      </button>

      <CmsSaveToast
        status={saveStatus}
        onClear={() => setSaveStatus("idle")}
        messages={{
          saving: { th: "กำลังบันทึกข้อมูลหน้าติดต่อเรา...", en: "Saving Contact page changes...", zh: "正在保存联系我们内容..." }[adminLang as "th" | "en" | "zh"] || "Saving...",
          success: { th: "บันทึกข้อมูลหน้าติดต่อเราเรียบร้อยแล้ว", en: "Contact page saved successfully.", zh: "联系我们内容保存成功。" }[adminLang as "th" | "en" | "zh"] || "Saved.",
          error: { th: "ไม่สามารถบันทึกข้อมูลหน้าติดต่อเราได้", en: "Unable to save the Contact page.", zh: "无法保存联系我们内容。" }[adminLang as "th" | "en" | "zh"] || "Error.",
        }}
      />

      <LanguageTabs activeLang={activeLang} onChange={setActiveLang} />

      <div className="space-y-10">
        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30"><h3 className="text-xl font-bold text-slate-800">1. Hero / Intro</h3></div>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.heroTitle[0]} onChange={(e) => updateHeroTitle(0, e.target.value)} placeholder="Hero title line 1" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.heroTitle[1]} onChange={(e) => updateHeroTitle(1, e.target.value)} placeholder="Hero title line 2" />
              <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[140px]" value={langContent.heroBody} onChange={(e) => updateLang("heroBody", e.target.value)} placeholder="Hero body" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.primaryCta} onChange={(e) => updateLang("primaryCta", e.target.value)} placeholder="Primary CTA" />
                <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.secondaryCta} onChange={(e) => updateLang("secondaryCta", e.target.value)} placeholder="Secondary CTA" />
              </div>
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.introTitle} onChange={(e) => updateLang("introTitle", e.target.value)} placeholder="Intro title" />
              <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[120px]" value={langContent.introBody} onChange={(e) => updateLang("introBody", e.target.value)} placeholder="Intro body" />
              
            </div>
            <CmsAssetUploadButton
              src={content.images.hero}
              alt="Contact hero preview"
              aspectClassName="aspect-video"
              onUploaded={(url) => updateImage("hero", url)}
              pathPrefix="contact"
            />
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30"><h3 className="text-xl font-bold text-slate-800">2. Office / Contact</h3></div>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.officeTitle} onChange={(e) => updateLang("officeTitle", e.target.value)} placeholder="Office title" />
              {langContent.address.map((line, index) => (
                <input key={index} className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={line} onChange={(e) => updateAddress(index, e.target.value)} placeholder={`Address line ${index + 1}`} />
              ))}
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.contactTitle} onChange={(e) => updateLang("contactTitle", e.target.value)} placeholder="Contact title" />
              {langContent.contactLines.map((line, index) => (
                <input key={index} className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={line} onChange={(e) => updateContactLine(index, e.target.value)} placeholder={`Contact line ${index + 1}`} />
              ))}
              
            </div>
            <CmsAssetUploadButton
              src={content.images.office}
              alt="Office preview"
              aspectClassName="aspect-[4/3]"
              onUploaded={(url) => updateImage("office", url)}
              pathPrefix="contact"
            />
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30"><h3 className="text-xl font-bold text-slate-800">3. Form / Support</h3></div>
          <div className="p-8 space-y-5">
            <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.formTitle} onChange={(e) => updateLang("formTitle", e.target.value)} placeholder="Form title" />
            <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[120px]" value={langContent.formBody} onChange={(e) => updateLang("formBody", e.target.value)} placeholder="Form body" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.formLabels.name} onChange={(e) => updateLang("formLabels", { ...langContent.formLabels, name: e.target.value })} placeholder="Label: name" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.formLabels.email} onChange={(e) => updateLang("formLabels", { ...langContent.formLabels, email: e.target.value })} placeholder="Label: email" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.formLabels.inquiryType} onChange={(e) => updateLang("formLabels", { ...langContent.formLabels, inquiryType: e.target.value })} placeholder="Label: inquiry type" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.formLabels.timeline} onChange={(e) => updateLang("formLabels", { ...langContent.formLabels, timeline: e.target.value })} placeholder="Label: timeline" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl md:col-span-2" value={langContent.formLabels.details} onChange={(e) => updateLang("formLabels", { ...langContent.formLabels, details: e.target.value })} placeholder="Label: details" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.placeholders.name} onChange={(e) => updateLang("placeholders", { ...langContent.placeholders, name: e.target.value })} placeholder="Placeholder: name" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.placeholders.email} onChange={(e) => updateLang("placeholders", { ...langContent.placeholders, email: e.target.value })} placeholder="Placeholder: email" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.placeholders.timeline} onChange={(e) => updateLang("placeholders", { ...langContent.placeholders, timeline: e.target.value })} placeholder="Placeholder: timeline" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.submit} onChange={(e) => updateLang("submit", e.target.value)} placeholder="Submit text" />
              <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[120px] md:col-span-2" value={langContent.placeholders.details} onChange={(e) => updateLang("placeholders", { ...langContent.placeholders, details: e.target.value })} placeholder="Placeholder: details" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {langContent.options.map((option, index) => (
                <input key={index} className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={option} onChange={(e) => updateOption(index, e.target.value)} placeholder={`Option ${index + 1}`} />
              ))}
            </div>
            <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={langContent.supportTitle} onChange={(e) => updateLang("supportTitle", e.target.value)} placeholder="Support title" />
            <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[120px]" value={langContent.supportBody} onChange={(e) => updateLang("supportBody", e.target.value)} placeholder="Support body" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {langContent.supportPoints.map((point, index) => (
                <input key={point.id} className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={point.text} onChange={(e) => updateSupportPoint(index, e.target.value)} placeholder={`Support point ${index + 1}`} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

