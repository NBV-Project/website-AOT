"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface ActivityItem {
  name: string;
  info: string;
  time: string;
  type: string;
  path: string;
}

const dashboardTranslations = {
  th: {
    welcome: "ยินดีต้อนรับสู่ศูนย์บริหารจัดการ",
    company: "เอเชียน โอเวอร์ซี เทรดดิ้ง",
    portalLabel: "พอร์ทัลบริหารจัดการองค์กร",
    sub: "ระบบบริหารจัดการเนื้อหาและภาพลักษณ์องค์กรระดับพรีเมียม เพื่อการส่งออกสู่ตลาดโลก",
    networkStatus: "เครือข่ายออนไลน์ทั่วโลก",
    serverLabel: "เซิร์ฟเวอร์",
    stats: [
      { label: "พอร์ตผลิตภัณฑ์", value: "08", unit: "รายการ", trend: "พร้อมจำหน่าย" },
      { label: "ข้อความติดต่อ", value: "12", unit: "ข้อความ", trend: "รอการตรวจสอบ" },
      { label: "ความเสถียรระบบ", value: "99.9", unit: "%", trend: "ดีเยี่ยม" },
      { label: "ภูมิภาคที่รองรับ", value: "03", unit: "ภาษา", trend: "Global Reach" },
    ],
    managementTitle: "ส่วนงานบริหารจัดการ",
    managementSub: "เลือกโมดูลที่ต้องการบริหารจัดการเพื่ออัปเดตข้อมูลบนเว็บไซต์ทันที",
    modules: [
      { title: "Landing & Story", desc: "หน้าแรกและส่วนต้อนรับหลัก", path: "/superadmin/home", tag: "Main" },
      { title: "Product Catalog", desc: "จัดการรายการ ฤดูกาล และราคา", path: "/superadmin/products", tag: "Catalog" },
      { title: "Logistics Hub", desc: "เส้นทางและเครือข่ายส่งออก", path: "/superadmin/logistics", tag: "Global" },
      { title: "Corporate Profile", desc: "ข้อมูลองค์กรและรายชื่อทีมงาน", path: "/superadmin/about", tag: "Profile" },
      { title: "Inquiry Center", desc: "จัดการข้อความและการตอบกลับ", path: "/superadmin/contact", tag: "Inbox" },
    ],
    moduleAction: "เปิดโมดูล",
    recentTitle: "กิจกรรมล่าสุด",
    viewAll: "ดูทั้งหมด",
    activityData: [
      { name: "Zhang Wei", info: "สอบถาม: ทุเรียนหมอนทอง", time: "5 นาทีที่แล้ว", type: "inquiry", path: "/superadmin/contact" },
      { name: "Global Trade", info: "อัปเดตเส้นทางขนส่ง", time: "1 ชม. ที่แล้ว", type: "update", path: "/superadmin/logistics" },
      { name: "Admin", info: "เปลี่ยนสถานะสินค้า", time: "3 ชม. ที่แล้ว", type: "status", path: "/superadmin/products" },
    ],
    supportTitle: "สนับสนุนด้านเทคนิค",
    supportDesc: "หากต้องการเพิ่มฟีเจอร์หรือพบปัญหาการใช้งาน กรุณาติดต่อทีมพัฒนา",
    supportBtn: "คู่มือการใช้งานระบบ"
  },
  en: {
    welcome: "Welcome to Central Management",
    company: "Asian Overseas Trading",
    portalLabel: "Enterprise Portal",
    sub: "Premium corporate content and brand management platform for global export markets.",
    viewLive: "Visit Main Website",
    networkStatus: "Global Network Online",
    serverLabel: "Server",
    stats: [
      { label: "Product Portfolio", value: "08", unit: "Items", trend: "In Stock" },
      { label: "Inquiries", value: "12", unit: "Msgs", trend: "Pending" },
      { label: "Uptime", value: "99.9", unit: "%", trend: "Optimal" },
      { label: "Localization", value: "03", unit: "Langs", trend: "Global Reach" },
    ],
    managementTitle: "Management Suite",
    managementSub: "Select a module to manage your corporate assets and site content.",
    modules: [
      { title: "Landing & Story", desc: "Manage homepage and hero sections", path: "/superadmin/home", tag: "Main" },
      { title: "Product Catalog", desc: "Manage items, seasons, and prices", path: "/superadmin/products", tag: "Catalog" },
      { title: "Logistics Hub", desc: "Control export routes and maps", path: "/superadmin/logistics", tag: "Global" },
      { title: "About Corporate", desc: "Manage corporate history and team", path: "/superadmin/about", tag: "Profile" },
      { title: "Inquiry Center", desc: "Manage customer messages", path: "/superadmin/contact", tag: "Inbox" },
    ],
    moduleAction: "Launch Module",
    recentTitle: "Recent Activity",
    viewAll: "View All",
    activityData: [
      { name: "Zhang Wei", info: "Inquiry: Monthong Durian", time: "5m ago", type: "inquiry", path: "/superadmin/contact" },
      { name: "Global Trade", info: "Route Updated", time: "1h ago", type: "update", path: "/superadmin/logistics" },
      { name: "Admin", info: "Stock Status Changed", time: "3h ago", type: "status", path: "/superadmin/products" },
    ],
    supportTitle: "Technical Support",
    supportDesc: "Need help or new features? Contact the development team.",
    supportBtn: "Technical Documentation"
  },
  zh: {
    welcome: "欢迎使用中央管理系统",
    company: "亚洲海外贸易",
    portalLabel: "企业管理门户",
    sub: "面向全球出口市场的优质企业内容与品牌管理平台。",
    viewLive: "访问主网站",
    networkStatus: "全球网络在线",
    serverLabel: "服务器",
    stats: [
      { label: "产品组合", value: "08", unit: "项目", trend: "在线" },
      { label: "咨询消息", value: "12", unit: "消息", trend: "待处理" },
      { label: "系统稳定性", value: "99.9", unit: "%", trend: "稳定" },
      { label: "支持语言", value: "03", unit: "语言", trend: "全球覆盖" },
    ],
    managementTitle: "管理套件",
    managementSub: "选择模块以管理您的企业资产和网站内容。",
    modules: [
      { title: "首页与故事", desc: "管理首页与主视觉部分", path: "/superadmin/home", tag: "首页" },
      { title: "产品目录", desc: "管理产品列表、产季与价格", path: "/superadmin/products", tag: "目录" },
      { title: "物流中心", desc: "控制出口路线与地图", path: "/superadmin/logistics", tag: "物流" },
      { title: "公司简介", desc: "管理企业历史与团队成员", path: "/superadmin/about", tag: "公司" },
      { title: "咨询中心", desc: "管理客户消息与回复", path: "/superadmin/contact", tag: "收件箱" },
    ],
    moduleAction: "打开模块",
    recentTitle: "近期活动",
    viewAll: "查看全部",
    activityData: [
      { name: "张伟", info: "咨询：金枕头榴莲", time: "5分钟前", type: "inquiry", path: "/superadmin/contact" },
      { name: "全球贸易", info: "物流航线已更新", time: "1小时前", type: "update", path: "/superadmin/logistics" },
      { name: "管理员", info: "库存状态已更改", time: "3小时前", type: "status", path: "/superadmin/products" },
    ],
    supportTitle: "技术支持",
    supportDesc: "需要帮助或新功能？请联系开发团队。",
    supportBtn: "技术文档手册"
  }
};

type DashboardLocale = "th" | "en" | "zh";

export default function SuperAdminDashboard() {
  const [lang, setLang] = useState<DashboardLocale>(() => {
    if (typeof window === "undefined") return "th";
    return (localStorage.getItem("admin_lang") as DashboardLocale | null) ?? "th";
  });

  useEffect(() => {
    const syncLang = () => {
      const savedLang = localStorage.getItem("admin_lang") as DashboardLocale | null;
      if (savedLang) {
        setLang((prev) => (prev !== savedLang ? savedLang : prev));
      }
    };

    window.addEventListener("admin_lang_changed", syncLang);
    return () => {
      window.removeEventListener("admin_lang_changed", syncLang);
    };
  }, []);

  const t = dashboardTranslations[lang];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-1000 p-1 font-kanit text-[16px]">
      
      {/* 1. MODERN EXECUTIVE HUB */}
      <section className="relative overflow-hidden rounded-[3rem] bg-white border border-slate-100 p-8 md:p-14 lg:p-16 shadow-[0_20px_50px_rgba(0,37,72,0.04)] group">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-[#002548]/5 rounded-full blur-[80px]"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
          <div className="flex-1 space-y-8">
             <div className="flex items-center">
                <span className="text-[#002548] text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">{t.welcome}</span>
             </div>

             <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#002548] tracking-tight leading-tight">
                  {t.company}
                </h1>
                <p className="text-slate-500 font-medium text-base md:text-lg max-w-2xl leading-relaxed">
                   {t.sub}
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* 2. LIGHT ANALYTICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {t.stats.map((stat, i) => (
          <div key={i} className="group bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between min-h-[180px]">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">{stat.label}</p>
             <div className="mt-4 flex items-baseline gap-2">
                <h4 className="text-5xl font-bold text-[#002548] tracking-tighter group-hover:text-[#D4AF37] transition-colors">{stat.value}</h4>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{stat.unit}</span>
             </div>
          </div>
        ))}
      </div>

      {/* 3. MODULAR WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden flex flex-col">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <div>
              <h3 className="text-xl font-bold text-[#002548] tracking-tight">{t.managementTitle}</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">{t.managementSub}</p>
            </div>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.map((item, i) => (
              <Link key={i} href={item.path} className="group flex flex-col p-8 rounded-[2rem] bg-white hover:bg-slate-50 border border-slate-50 hover:border-[#D4AF37]/20 transition-all duration-500 text-[16px]">
                <div className="flex items-center justify-between mb-4">
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">{item.tag}</span>
                   <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                   </div>
                </div>
                <h4 className="text-lg font-bold text-[#002548] tracking-tight mb-2 group-hover:text-[#D4AF37] transition-colors">{item.title}</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                   <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">{t.moduleAction}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm flex-1 text-[16px]">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-[#002548] tracking-tight">{t.recentTitle}</h3>
              <Link href="/superadmin/contact" className="text-[10px] font-bold text-[#002548] uppercase tracking-widest hover:opacity-70 transition-opacity">
                {t.viewAll}
              </Link>
            </div>
            
            <div className="space-y-8 text-[16px]">
              {t.activityData.map((item: ActivityItem, i: number) => (
                <Link key={i} href={item.path} className="flex gap-4 group cursor-pointer hover:bg-slate-50/50 p-2 -m-2 rounded-2xl transition-all duration-300 text-[16px]">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 shadow-sm ${
                    item.type === 'inquiry' ? 'bg-emerald-500' : 
                    item.type === 'update' ? 'bg-blue-500' : 'bg-[#D4AF37]'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center w-full gap-4">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-[#002548] transition-colors truncate">{item.name}</p>
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-1 truncate">{item.info}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-[#002548] rounded-[3rem] p-10 text-white relative overflow-hidden group text-[16px]">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>
            <h4 className="text-lg font-bold mb-4 tracking-tight text-[#D4AF37]">{t.supportTitle}</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-8 opacity-80">{t.supportDesc}</p>
            <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all">
              {t.supportBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
