"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Maitree } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";

const kanit = Maitree({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-kanit",
  display: "swap",
});

const translations = {
  th: {
    brand: "เอโอที แอดมิน",
    tagline: "ระบบจัดการระดับพรีเมียม",
    menuHeader: "เมนูหลัก",
    dashboard: "แดชบอร์ด",
    home: "หน้าแรก",
    about: "เกี่ยวกับเรา",
    products: "สินค้า",
    logistics: "โลจิสติกส์",
    contact: "ติดต่อเรา",
    company: "เอเชียน โอเวอร์ซี เทรดดิ้ง",
    management: "ระบบจัดการหลังบ้าน",
    status: "ระบบทำงานปกติ",
    lastUpdated: "อัปเดตล่าสุด: เมื่อครู่",
    viewSite: "ดูหน้าเว็บไซต์ →",
    adminLabel: "ผู้ดูแลระบบ",
    logout: "ออกจากระบบ",
  },
  en: {
    brand: "AOT Admin",
    tagline: "Premium Management",
    menuHeader: "Main Menu",
    dashboard: "Dashboard",
    home: "Home Page",
    about: "About Us",
    products: "Products",
    logistics: "Logistics",
    contact: "Contact Us",
    company: "Asian Overseas Trading",
    management: "Admin Management",
    status: "System Online",
    lastUpdated: "Last updated: Just now",
    viewSite: "View Website →",
    adminLabel: "Administrator",
    logout: "Sign Out",
  },
  zh: {
    brand: "AOT 管理员",
    tagline: "优质管理系统",
    menuHeader: "主菜单",
    dashboard: "控制面板",
    home: "首页",
    about: "关于我们",
    products: "产品中心",
    logistics: "物流运输",
    contact: "联系我们",
    company: "亚洲海外贸易",
    management: "后台管理",
    status: "系统稳定",
    lastUpdated: "最后更新：刚刚",
    viewSite: "查看网站 →",
    adminLabel: "管理员",
    logout: "登出",
  }
};

const languages = [
  { code: "th", label: "TH", flag: "/images/locale-th.png" },
  { code: "en", label: "EN", flag: "/images/locale-en.png" },
  { code: "zh", label: "CN", flag: "/images/locale-zh.png" },
] as const;

type AdminLocale = "th" | "en" | "zh";

export function SuperAdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<AdminLocale>(() => {
    if (typeof window === "undefined") return "th";
    return (localStorage.getItem("admin_lang") as AdminLocale | null) ?? "th";
  });
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  
  const langRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    const checkAuth = () => {
      const session = localStorage.getItem("aot_admin_session");
      const isLoginPage = pathname === "/superadmin/login";

      if (session === "active") {
        setAuthorized(true);
        if (isLoginPage) {
          router.replace("/superadmin");
        }
      } else {
        setAuthorized(false);
        if (!isLoginPage) {
          router.replace("/superadmin/login");
        }
      }
    };

    checkAuth();
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("aot_admin_session");
    setAuthorized(false);
    router.replace("/superadmin/login");
  };

  const t = translations[lang] || translations.th;
  const currentLang = languages.find(l => l.code === lang) || languages[0];

  // Language Menu Outside Click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { key: 'dashboard', name: t.dashboard, href: "/superadmin" },
    { key: 'home', name: t.home, href: "/superadmin/home" },
    { key: 'about', name: t.about, href: "/superadmin/about" },
    { key: 'products', name: t.products, href: "/superadmin/products" },
    { key: 'logistics', name: t.logistics, href: "/superadmin/logistics" },
    { key: 'contact', name: t.contact, href: "/superadmin/contact" },
  ];

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.href === pathname);
    return currentItem ? currentItem.name : t.dashboard;
  };

  // Prevent flash and wait for mount
  if (!mounted) return null;

  // Login Page special case
  if (pathname === "/superadmin/login") {
    return <div className={`${kanit.variable} ${kanit.className} font-kanit admin-theme`}>{children}</div>;
  }

  // Not authorized and not on login page
  if (!authorized) {
    return (
      <div className={`${kanit.variable} ${kanit.className} font-kanit admin-theme min-h-screen bg-[#F8FAFC] flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#002548]/10 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-[#002548] uppercase tracking-[0.2em]">Checking Security...</p>
        </div>
      </div>
    );
  }

  // Authorized Admin View
  return (
    <div className={`${kanit.variable} ${kanit.className} font-kanit admin-theme min-h-screen bg-[#F8FAFC] flex antialiased text-slate-800 text-[16px]`}>
      
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#002548] flex-shrink-0 flex flex-col z-50 shadow-2xl transition-all duration-500 lg:relative lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-white/[0.03] transition-all">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 overflow-hidden border border-white/10 relative">
                <Image src="/images/admin-avatar.jpg" alt="Admin" fill sizes="40px" className="object-cover" unoptimized />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-black text-white tracking-wider leading-none uppercase">{t.brand}</h1>
              <p className="text-[9px] text-[#D4AF37]/60 font-bold uppercase tracking-[0.3em] mt-1.5">Admin Center</p>
            </div>
          </div>
          <button className="absolute top-7 right-4 lg:hidden text-white/50" onClick={() => setIsSidebarOpen(false)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 px-6 py-8 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center px-5 py-3.5 rounded-2xl transition-all relative ${
                isActive ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" : "text-slate-200 hover:text-white hover:bg-white/8"
              }`}>
                <span className="text-[14px] font-medium tracking-wide">{item.name}</span>
                {isActive && <div className="absolute left-0 w-1.5 h-6 bg-[#D4AF37] rounded-r-full shadow-[0_0_15px_#D4AF37]"></div>}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/5">
          <button onClick={handleLogout} className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all font-bold text-[10px] uppercase tracking-[0.25em]">
            {t.logout}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 md:px-10 flex-shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl" onClick={() => setIsSidebarOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="hidden sm:flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-400">{t.company}</span>
                <span className="mt-1 text-[13px] font-semibold tracking-[0.01em] text-[#002548]">{getCurrentPageTitle()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div ref={langRef} className="relative">
              <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-2 group">
                <div className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-slate-100 shadow-sm transition-all group-hover:ring-[#D4AF37]/30">
                  <Image src={currentLang.flag} alt={currentLang.label} fill sizes="28px" className="object-cover" />
                </div>
                <span
                  aria-hidden="true"
                  className={`text-slate-400 transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="h-3 w-3"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>
              <div className={`absolute right-0 top-full mt-3 min-w-[110px] rounded-2xl bg-white p-1.5 shadow-2xl border border-slate-100 transition-all ${
                isLangOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}>
                {languages.map((l) => (
                  <button key={l.code} onClick={() => { setLang(l.code); localStorage.setItem("admin_lang", l.code); setIsLangOpen(false); window.dispatchEvent(new Event("admin_lang_changed")); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${lang === l.code ? "bg-slate-50 text-[#002548]" : "text-slate-500 hover:bg-slate-50 hover:text-[#002548]"}`}>
                    <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full shadow-inner"><Image src={l.flag} alt={l.label} fill sizes="20px" className="object-cover" /></div>
                    <span className="text-[10px] font-bold tracking-widest">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-12 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
