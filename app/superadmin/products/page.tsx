"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { AdminPortal } from "@/components/admin-portal";
import { CmsAssetUploadButton } from "@/components/cms-asset-upload-button";
import { CmsSaveToast, type CmsSaveStatus } from "@/components/cms-save-toast";
import { ShoppingBasket } from "lucide-react";
import { savePageContent, saveProduct, reorderProducts } from "@/lib/actions";

type Locale = "th" | "en" | "zh";

interface ProductTranslation {
  name: string;
  description: string;
  highlights: string[];
  price_range?: string;
}

interface Product {
  id: string;
  image_url: string;
  status: "Active" | "Draft" | "Out of Stock";
  is_in_season: boolean;
  sort_order: number;
  th: ProductTranslation;
  en: ProductTranslation;
  zh: ProductTranslation;
}

type ShowcaseItem = {
  title: string;
  body: string;
  imageBg: string;
  image?: string;
};

type ProductsPageLanguageContent = {
  heroTitle: string[];
  heroBody: string;
  primaryCta: string;
  secondaryCta: string;
  categoriesTitle: string;
  flagshipTitle: string;
  flagshipBody: string;
  flagshipPoints: string[];
  showcaseTitle: string;
  showcaseBody: string;
  showcaseItems: ShowcaseItem[];
};

type ProductsPageContent = Record<Locale, ProductsPageLanguageContent> & {
  images: {
    hero: string;
    flagship: string;
    showcaseOne: string;
    showcaseTwo: string;
  };
};

const defaultPageContent: ProductsPageContent = {
  th: {
    heroTitle: ["สินค้าคุณภาพ", "เพื่อการส่งออก"],
    heroBody: "ข้อความ Hero หน้า Products",
    primaryCta: "สอบถามสินค้า",
    secondaryCta: "ดูหมวดสินค้า",
    categoriesTitle: "หมวดหมู่สินค้า",
    flagshipTitle: "สินค้าหลักสำหรับโปรแกรมส่งออก",
    flagshipBody: "คำอธิบายสินค้าหลัก",
    flagshipPoints: ["จุดเด่น 1", "จุดเด่น 2", "จุดเด่น 3"],
    showcaseTitle: "แบรนด์สินค้าของเรา",
    showcaseBody: "คำอธิบายส่วนแบรนด์",
    showcaseItems: [
      { title: "Rajha Singha", body: "รายละเอียดแบรนด์", imageBg: "#000000", image: "/images/rajhasingha.jpg" },
      { title: "Tai Zhong", body: "รายละเอียดแบรนด์", imageBg: "#ffffff", image: "/images/taizhong1.jpg" },
    ],
  },
  en: {
    heroTitle: ["Premium Products", "for Export"],
    heroBody: "Products hero copy",
    primaryCta: "Request Products",
    secondaryCta: "View Categories",
    categoriesTitle: "Product Categories",
    flagshipTitle: "Flagship export program",
    flagshipBody: "Flagship body",
    flagshipPoints: ["Point 1", "Point 2", "Point 3"],
    showcaseTitle: "Our Brands",
    showcaseBody: "Brand section body",
    showcaseItems: [
      { title: "Rajha Singha", body: "Brand detail", imageBg: "#000000", image: "/images/rajhasingha.jpg" },
      { title: "Tai Zhong", body: "Brand detail", imageBg: "#ffffff", image: "/images/taizhong1.jpg" },
    ],
  },
  zh: {
    heroTitle: ["优质产品", "面向出口市场"],
    heroBody: "产品页主视觉文案",
    primaryCta: "咨询产品",
    secondaryCta: "查看分类",
    categoriesTitle: "产品分类",
    flagshipTitle: "主力出口项目",
    flagshipBody: "主力产品说明",
    flagshipPoints: ["要点 1", "要点 2", "要点 3"],
    showcaseTitle: "我们的品牌",
    showcaseBody: "品牌板块说明",
    showcaseItems: [
      { title: "Rajha Singha", body: "品牌说明", imageBg: "#000000", image: "/images/rajhasingha.jpg" },
      { title: "Tai Zhong", body: "品牌说明", imageBg: "#ffffff", image: "/images/taizhong1.jpg" },
    ],
  },
  images: {
    hero: "/images/products-hero-bright.jpg",
    flagship: "/images/sdr.jpg",
    showcaseOne: "/images/rajhasingha.jpg",
    showcaseTwo: "/images/taizhong1.jpg",
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

export default function ProductManagement() {
  const [activeLang, setActiveLang] = useState<Locale>("th");
  const [isLoading, setIsLoading] = useState(true);
  const [pageContent, setPageContent] = useState<ProductsPageContent>(defaultPageContent);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<CmsSaveStatus>("idle");
  const [productSaveStatus, setProductSaveStatus] = useState<CmsSaveStatus>("idle");
  const [autoSaveStatus, setAutoSaveStatus] = useState<CmsSaveStatus>("idle");
  const [draggedIndex, setDragIndex] = useState<number | null>(null);
  const [draggedBrandIndex, setDraggedBrandIndex] = useState<number | null>(null);
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
        const { data: pageData } = await supabase
          .from("page_content")
          .select("content")
          .eq("page_name", "products_page")
          .single();

        if (pageData?.content) {
          setPageContent({
            ...defaultPageContent,
            ...pageData.content,
            th: { ...defaultPageContent.th, ...pageData.content.th },
            en: { ...defaultPageContent.en, ...pageData.content.en },
            zh: { ...defaultPageContent.zh, ...pageData.content.zh },
            images: { ...defaultPageContent.images, ...(pageData.content.images || {}) },
          });
        }

        const { data: productsData } = await supabase
          .from("products")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (productsData) {
          setProducts(productsData as Product[]);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const updatePageField = <K extends keyof ProductsPageLanguageContent>(key: K, value: ProductsPageLanguageContent[K]) => {
    setPageContent((prev) => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [key]: value,
      },
    }));
  };

  const updateHeroTitle = (index: number, value: string) => {
    const next = [...pageContent[activeLang].heroTitle];
    next[index] = value;
    updatePageField("heroTitle", next);
  };

  const updateFlagshipPoint = (index: number, value: string) => {
    const next = [...pageContent[activeLang].flagshipPoints];
    next[index] = value;
    updatePageField("flagshipPoints", next);
  };

  const updateShowcaseItem = (index: number, key: keyof ShowcaseItem, value: string) => {
    const next = [...pageContent[activeLang].showcaseItems];
    next[index] = { ...next[index], [key]: value };
    updatePageField("showcaseItems", next);
  };

  const updateImage = (key: keyof ProductsPageContent["images"], value: string) => {
    setPageContent((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [key]: value,
      },
    }));
  };

  const handleSavePage = async () => {
    setSaveStatus("saving");
    const result = await savePageContent("products_page", pageContent);

    if (result.success) {
      setSaveStatus("success");
    } else {
      setSaveStatus("error");
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)));
    setIsModalOpen(true);
    setProductSaveStatus("idle");
  };

  const handleUpdateProduct = (key: keyof ProductTranslation, value: string | string[], lang: Locale) => {
    if (!editingProduct) {
      return;
    }

    setEditingProduct({
      ...editingProduct,
      [lang]: {
        ...editingProduct[lang],
        [key]: value,
      },
    });
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) {
      return;
    }

    setProductSaveStatus("saving");
    const result = await saveProduct({
      id: editingProduct.id,
      is_in_season: editingProduct.is_in_season,
      th: editingProduct.th,
      en: editingProduct.en,
      zh: editingProduct.zh,
      image_url: editingProduct.image_url,
    });

    if (result.success) {
      setProducts((prev) => prev.map((product) => (product.id === editingProduct.id ? editingProduct : product)));
      setProductSaveStatus("success");
      setTimeout(() => {
        setIsModalOpen(false);
        setProductSaveStatus("idle");
      }, 1000);
    } else {
      setProductSaveStatus("error");
    }
  };

  const onDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) {
      return;
    }

    const next = [...products];
    const [item] = next.splice(draggedIndex, 1);
    next.splice(index, 0, item);
    setProducts(next);
    setDragIndex(index);
  };

  const onDragEnd = async () => {
    setDragIndex(null);
    setAutoSaveStatus("saving");
    
    const productOrders = products.map((product, index) => ({
      id: product.id,
      sort_order: index,
    }));

    const result = await reorderProducts(productOrders);

    if (result.success) {
      setAutoSaveStatus("success");
      setTimeout(() => setAutoSaveStatus("idle"), 1500);
    } else {
      setAutoSaveStatus("error");
    }
  };

  // Drag and Drop for Brands (Showcase Items)
  const onDragStartBrand = (e: React.DragEvent, index: number) => {
    setDraggedBrandIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOverBrand = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedBrandIndex === null || draggedBrandIndex === index) {
      return;
    }

    const nextContent = { ...pageContent };
    const nextItems = [...nextContent[activeLang].showcaseItems];
    const [item] = nextItems.splice(draggedBrandIndex, 1);
    nextItems.splice(index, 0, item);
    
    // Sync all languages
    (["th", "en", "zh"] as const).forEach(lang => {
      if (lang === activeLang) {
        nextContent[lang] = { ...nextContent[lang], showcaseItems: nextItems };
      } else {
        // Just reorder for other languages, keeping their content
        const otherItems = [...nextContent[lang].showcaseItems];
        const [oItem] = otherItems.splice(draggedBrandIndex, 1);
        otherItems.splice(index, 0, oItem);
        nextContent[lang] = { ...nextContent[lang], showcaseItems: otherItems };
      }
    });

    setPageContent(nextContent);
    setDraggedBrandIndex(index);
  };

  const page = pageContent[activeLang];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-kanit">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#002548]/20 border-t-[#002548] rounded-full animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse">Loading products content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 font-kanit">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 tracking-tight text-[32px]">
            จัดการ <span className="text-[#002548]">สินค้าและหน้า Products</span>
          </h2>
          <p className="text-slate-400 font-medium mt-3 text-lg">
            เพิ่ม field ของหน้า public ให้แก้ไขได้ครบตาม section ที่ใช้งานจริง
          </p>
        </div>
      </section>

      <button
        onClick={handleSavePage}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-2xl z-50 transition-all hover:-translate-y-2 active:scale-90 bg-[#002548] text-white hover:bg-slate-800"
        title="Save"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
      </button>
      <CmsSaveToast
        status={saveStatus}
        onClear={() => setSaveStatus("idle")}
        messages={{
          saving: { th: "กำลังบันทึกข้อมูลหน้าสินค้า...", en: "Saving Products page changes...", zh: "正在保存产品页内容..." }[adminLang as "th" | "en" | "zh"] || "Saving...",
          success: { th: "บันทึกข้อมูลหน้าสินค้าเรียบร้อยแล้ว", en: "Products page saved successfully.", zh: "产品页内容保存成功。" }[adminLang as "th" | "en" | "zh"] || "Saved.",
          error: { th: "ไม่สามารถบันทึกข้อมูลหน้าสินค้าได้", en: "Unable to save the Products page.", zh: "无法保存产品页内容。" }[adminLang as "th" | "en" | "zh"] || "Error.",
        }}
      />

      <CmsSaveToast
        status={autoSaveStatus}
        onClear={() => setAutoSaveStatus("idle")}
        messages={{
          saving: { th: "กำลังอัปเดตลำดับสินค้า...", en: "Updating product order...", zh: "正在更新产品排序..." }[adminLang as "th" | "en" | "zh"] || "Updating...",
          success: { th: "อัปเดตลำดับสินค้าเรียบร้อยแล้ว", en: "Product order synchronized.", zh: "产品排序已同步。" }[adminLang as "th" | "en" | "zh"] || "Synchronized.",
          error: { th: "ไม่สามารถอัปเดตลำดับสินค้าได้", en: "Failed to update product order.", zh: "产品排序更新失败。" }[adminLang as "th" | "en" | "zh"] || "Error.",
        }}
      />

      <LanguageTabs activeLang={activeLang} onChange={setActiveLang} />

      <div className="space-y-10">
        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-xl font-bold text-slate-800">1. Hero</h3>
          </div>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={page.heroTitle[0]} onChange={(e) => updateHeroTitle(0, e.target.value)} placeholder="Hero title line 1" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={page.heroTitle[1]} onChange={(e) => updateHeroTitle(1, e.target.value)} placeholder="Hero title line 2" />
              <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[140px]" value={page.heroBody} onChange={(e) => updatePageField("heroBody", e.target.value)} placeholder="Hero body" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={page.primaryCta} onChange={(e) => updatePageField("primaryCta", e.target.value)} placeholder="Primary CTA" />
                <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={page.secondaryCta} onChange={(e) => updatePageField("secondaryCta", e.target.value)} placeholder="Secondary CTA" />
              </div>
            </div>
            <div className="space-y-2">
              <CmsAssetUploadButton
                src={pageContent.images.hero}
                alt="Products hero preview"
                aspectClassName="aspect-video"
                onUploaded={(url) => updateImage("hero", url)}
                pathPrefix="products"
              />
              <p className="text-center text-[11px] font-semibold text-[#002548]/70">ขนาดแนะนำ: 1920 x 1080 px</p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-xl font-bold text-slate-800">2. Categories / Flagship</h3>
          </div>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={page.categoriesTitle} onChange={(e) => updatePageField("categoriesTitle", e.target.value)} placeholder="Categories title" />
              <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={page.flagshipTitle} onChange={(e) => updatePageField("flagshipTitle", e.target.value)} placeholder="Flagship title" />
              <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[140px]" value={page.flagshipBody} onChange={(e) => updatePageField("flagshipBody", e.target.value)} placeholder="Flagship body" />
              {page.flagshipPoints.map((point, index) => (
                <input key={index} className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={point} onChange={(e) => updateFlagshipPoint(index, e.target.value)} placeholder={`Flagship point ${index + 1}`} />
              ))}
            </div>
            <div className="space-y-2">
              <CmsAssetUploadButton
                src={pageContent.images.flagship}
                alt="Flagship preview"
                aspectClassName="aspect-[4/3]"
                onUploaded={(url) => updateImage("flagship", url)}
                pathPrefix="products"
              />
              <p className="text-center text-[11px] font-semibold text-[#002548]/70">ขนาดแนะนำ: 1200 x 900 px</p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden transition-all duration-700">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002548] text-white shadow-lg">
                <span className="text-lg font-black">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Showcase / Brands Management</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-black mt-1">Interactive Drag & Drop Interface</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-100">
                {page.showcaseItems.length} Brand Modules
              </span>
            </div>
          </div>
          
          <div className="p-8 space-y-10">
            {/* Header Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100/50">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-2 block">Section Title</label>
                <input 
                  className="w-full px-6 py-4.5 bg-white rounded-2xl border-none shadow-sm focus:ring-4 focus:ring-[#002548]/5 font-bold text-slate-800" 
                  value={page.showcaseTitle} 
                  onChange={(e) => updatePageField("showcaseTitle", e.target.value)} 
                  placeholder="e.g. Our Premium Brands" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 px-2 block">Section Description</label>
                <textarea 
                  rows={2}
                  className="w-full px-6 py-4.5 bg-white rounded-2xl border-none shadow-sm focus:ring-4 focus:ring-[#002548]/5 text-slate-600 font-medium" 
                  value={page.showcaseBody} 
                  onChange={(e) => updatePageField("showcaseBody", e.target.value)} 
                  placeholder="Briefly describe your brand portfolio..." 
                />
              </div>
            </div>

            {/* Draggable Brand Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {page.showcaseItems.map((item, index) => (
                <div 
                  key={`brand-card-${index}`}
                  draggable
                  onDragStart={(e) => onDragStartBrand(e, index)}
                  onDragOver={(e) => onDragOverBrand(e, index)}
                  onDragEnd={() => setDraggedBrandIndex(null)}
                  className={`group relative overflow-hidden rounded-[3rem] border-2 p-8 transition-all duration-700 cursor-grab active:cursor-grabbing ${
                    draggedBrandIndex === index 
                      ? "opacity-20 border-[#D4AF37] scale-95 shadow-inner bg-slate-50" 
                      : "border-transparent bg-white shadow-[0_15px_40px_rgba(0,37,72,0.03)] hover:shadow-[0_25px_60px_rgba(0,37,72,0.08)] hover:-translate-y-2"
                  }`}
                >
                  {/* Drag Indicator Overlay */}
                  <div className="absolute right-8 top-8 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-300 transition-all group-hover:bg-[#002548] group-hover:text-white group-hover:shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21 9-9-9-9 9"/><path d="M12 0v24"/><path d="m3 15 9 9 9-9"/></svg>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-10">
                    {/* Visual Section */}
                    <div className="relative group/image">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="h-1 w-6 rounded-full bg-[#D4AF37]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Visual Identity</span>
                      </div>
                      <CmsAssetUploadButton
                        src={item.image || (index === 0 ? pageContent.images.showcaseOne : pageContent.images.showcaseTwo)}
                        alt={item.title}
                        aspectClassName="aspect-video"
                        className="rounded-[2.5rem] shadow-xl ring-[12px] ring-slate-50 transition-all group-hover:ring-[#002548]/5 duration-700"
                        imageClassName="object-contain p-8"
                        onUploaded={(url) => {
                          updateShowcaseItem(index, "image", url);
                          updateImage(index === 0 ? "showcaseOne" : "showcaseTwo", url);
                        }}
                        pathPrefix="products"
                      />
                      <p className="mt-2 text-center text-[11px] font-semibold text-[#002548]/70">ขนาดแนะนำ: 1600 x 900 px</p>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label className="mb-3 block px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Brand Name</label>
                          <input 
                            className="w-full rounded-2xl border-none bg-slate-50 px-6 py-4 font-bold text-slate-800 shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 transition-all" 
                            value={item.title} 
                            onChange={(e) => updateShowcaseItem(index, "title", e.target.value)} 
                            placeholder="Brand name..." 
                          />
                        </div>
                        <div>
                          <label className="mb-3 block px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Background Hex</label>
                          <input 
                            className="w-full rounded-2xl border-none bg-slate-50 px-6 py-4 font-mono text-xs font-bold text-[#D4AF37] shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 transition-all" 
                            value={item.imageBg} 
                            onChange={(e) => updateShowcaseItem(index, "imageBg", e.target.value)} 
                            placeholder="#FFFFFF" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-3 block px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Brand Vision / Story</label>
                        <textarea 
                          rows={4}
                          className="w-full resize-none rounded-2xl border-none bg-slate-50 px-6 py-5 text-sm font-medium leading-relaxed text-slate-600 shadow-inner focus:ring-4 focus:ring-[#D4AF37]/10 transition-all" 
                          value={item.body} 
                          onChange={(e) => updateShowcaseItem(index, "body", e.target.value)} 
                          placeholder="Tell the brand's story..." 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden transition-all duration-700">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold text-slate-800">4. Product Inventory Dashboard</h3>
              <div className="flex items-center gap-2">
                {autoSaveStatus === "saving" && <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#002548] bg-[#002548]/5 px-3 py-1 rounded-full"><div className="w-2 h-2 bg-[#002548] rounded-full animate-pulse" /> Saving order...</span>}
                {autoSaveStatus === "success" && <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">✓ Order Synchronized</span>}
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              {products.length} Items Listed
            </span>
          </div>
          
          <div className="p-8 md:p-12 bg-slate-50/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDragEnd={onDragEnd}
                  onClick={() => openEditModal(product)}
                  className={`group relative flex flex-col overflow-hidden rounded-[2.5rem] border-2 bg-white transition-all duration-700 cursor-grab active:cursor-grabbing ${
                    draggedIndex === index ? "opacity-30 border-[#D4AF37] scale-95 shadow-inner" : "border-transparent shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,37,72,0.1)] hover:-translate-y-2"
                  }`}
                >
                  {/* Product Preview Image */}
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                    <Image src={product.image_url} alt="" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002548]/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    
                    {/* Seasonal/Status Indicator */}
                    <div className="absolute left-5 top-5 flex flex-col gap-2">
                      <div className={`w-fit rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${product.is_in_season ? "bg-emerald-500/90 text-white" : "bg-slate-500/90 text-white"}`}>
                        {product.is_in_season ? "In Season" : "Off Season"}
                      </div>
                    </div>

                    {/* Drag Handle Icon */}
                    <div className="absolute right-5 top-5 h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-slate-400 opacity-0 shadow-xl transition-all duration-500 group-hover:opacity-100 flex">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21 9-9-9-9 9"/><path d="M12 0v24"/><path d="m3 15 9 9 9-9"/></svg>
                    </div>
                  </div>

                  {/* Product Summary */}
                  <div className="flex flex-1 flex-col p-7">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-1 w-6 rounded-full bg-[#D4AF37]" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Position {index + 1}</span>
                    </div>
                    <h4 className="line-clamp-1 text-lg font-bold text-slate-800 transition-colors group-hover:text-[#002548]">{product[activeLang].name}</h4>
                    <p className="mt-3 line-clamp-2 text-xs font-medium leading-relaxed text-slate-400">{product[activeLang].description}</p>
                    
                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#002548]">
                        Edit Product
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-[#002548] group-hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {isModalOpen && editingProduct && (
        <AdminPortal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => productSaveStatus !== "saving" && setIsModalOpen(false)}></div>
            <div className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-[#002548]"><ShoppingBasket className="w-6 h-6" /></div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Edit Product</h3>
                    <p className="text-slate-400 font-medium text-sm mt-0.5">Update product copy in each language</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-300 hover:text-red-400 transition-all">×</button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <LanguageTabs activeLang={activeLang} onChange={setActiveLang} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={editingProduct[activeLang].name} onChange={(e) => handleUpdateProduct("name", e.target.value, activeLang)} placeholder="Product name" />
                    <input className="w-full px-5 py-4 bg-slate-50 rounded-2xl" value={editingProduct[activeLang].price_range || ""} onChange={(e) => handleUpdateProduct("price_range", e.target.value, activeLang)} placeholder="Price range" />
                    <CmsAssetUploadButton
                      src={editingProduct.image_url}
                      alt={editingProduct[activeLang].name}
                      aspectClassName="aspect-square"
                      onUploaded={(url) => setEditingProduct({ ...editingProduct, image_url: url })}
                      pathPrefix="products"
                    />
                    <p className="mt-2 text-center text-[11px] font-semibold text-[#002548]/70">ขนาดแนะนำ: 1200 x 1200 px</p>
                    <label className="flex items-center gap-3 text-sm text-slate-600">
                      <input type="checkbox" checked={editingProduct.is_in_season} onChange={() => setEditingProduct({ ...editingProduct, is_in_season: !editingProduct.is_in_season })} />
                      In season
                    </label>
                  </div>
                  <div className="space-y-4">
                    <textarea className="w-full px-5 py-4 bg-slate-50 rounded-2xl min-h-[220px]" value={editingProduct[activeLang].description} onChange={(e) => handleUpdateProduct("description", e.target.value, activeLang)} placeholder="Description" />
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-50 bg-white flex items-center justify-between">
                <button onClick={() => setIsModalOpen(false)} className="px-10 py-4 text-slate-400 font-bold uppercase tracking-widest text-sm hover:text-slate-600">Cancel</button>
                <button onClick={handleSaveProduct} className="px-12 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl bg-[#002548] text-white hover:bg-slate-800 transition-all">
                  {productSaveStatus === "saving" ? "Saving..." : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        </AdminPortal>
      )}
    </div>
  );
}

