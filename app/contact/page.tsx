import Image from "next/image";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ContactForm } from "@/components/contact-form";
import { ContactSupportSection } from "@/components/contact-support-section";
import {
  brandByLocale,
  type Locale,
  navigationByLocale,
  resolveLocale,
} from "@/lib/locale";
import { supabase } from "@/lib/supabase";

const heroImage =
  "/images/contact-hero-new.jpg";
const officeImage =
  "/images/contact-office.jpg";

type ContactCopy = {
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
  supportPoints: { id: string; text: string }[];
};

const copyByLocale: Record<Locale, ContactCopy> = {
  th: {
    heroTitle: ["สอบถามสินค้า", "และการส่งออก"],
    heroBody:
      "เราพร้อมให้ข้อมูลด้านสินค้า การส่งออก และระบบโลจิสติกส์ เพื่อช่วยให้คุณวางแผนการสั่งซื้อและขยายตลาดได้อย่างมั่นใจ",
    primaryCta: "ส่งคำถาม",
    secondaryCta: "ดูข้อมูลสินค้า",
    introTitle: "ติดต่อทีมงานที่ดูแลสินค้า การส่งออก และปลายทางตลาดจีน",
    introBody:
      "ไม่ว่าคุณต้องการสอบถามสินค้ารายการใด ขอข้อมูลการจัดส่ง หรือวางแผนคำสั่งซื้อระยะยาว ทีมของเราพร้อมตอบกลับด้วยข้อมูลที่ชัดเจนและเหมาะกับธุรกิจของคุณ",
    officeTitle: "สำนักงานใหญ่",
    address: [
      "388/65-388/66 ถนนนวลจันทร์",
      "แขวงนวลจันทร์ เขตบึงกุ่ม",
      "กรุงเทพมหานคร 10230",
    ],
    contactTitle: "ช่องทางติดต่อ",
    contactLines: ["085-289-2451", "contact@asianoverseas.co.th"],
    formTitle: "ส่งรายละเอียดเบื้องต้น",
    formBody:
      "แจ้งประเภทสินค้า ปริมาณ หรือช่วงเวลาที่ต้องการ แล้วทีมงานจะติดต่อกลับเพื่อให้ข้อมูลที่เหมาะกับแผนการสั่งซื้อของคุณ",
    formLabels: {
      name: "ชื่อผู้ติดต่อ",
      email: "อีเมล",
      inquiryType: "ประเภทการสอบถาม",
      timeline: "ช่วงเวลาที่ต้องการ",
      details: "รายละเอียดความต้องการ",
    },
    placeholders: {
      name: "ชื่อ-นามสกุล",
      email: "กรอกอีเมลของคุณ",
      timeline: "ระบุช่วงเวลาหรือกำหนดส่ง",
      details: "อธิบายประเภทสินค้า ปริมาณ ตลาดปลายทาง หรือข้อมูลเพิ่มเติมที่ต้องการ",
    },
    options: ["สอบถามสินค้า", "สอบถามการส่งออก", "สอบถามโลจิสติกส์", "สอบถามทั่วไป"],
    submit: "ส่งข้อมูลติดต่อ",
    supportTitle: "เราช่วยตอบคำถามด้านใดบ้าง",
    supportBody:
      "หน้าติดต่อควรพาคุณไปสู่คำตอบที่เร็วที่สุด เราจึงสรุปขอบเขตการดูแลไว้ชัดเจนเพื่อให้การประสานงานเริ่มต้นได้ง่าย",
    supportPoints: [
      { id: "products", text: "ข้อมูลสินค้าและปริมาณที่เหมาะกับคำสั่งซื้อ" },
      { id: "shipping", text: "แนวทางการจัดส่ง" },
      { id: "coordination", text: "การประสานงานเบื้องต้นสำหรับคำสั่งซื้อและรอบจัดส่ง" },
    ],
  },
  en: {
    heroTitle: ["Product Inquiry", "and Export Support"],
    heroBody:
      "We are ready to provide product, export, and logistics information so you can plan sourcing and market expansion with confidence.",
    primaryCta: "Send Inquiry",
    secondaryCta: "View Products",
    introTitle: "Contact the team behind products, exports, and destination-market coordination",
    introBody:
      "Whether you need product details, export information, or support for long-term purchasing plans, our team is ready to respond with clear and practical guidance.",
    officeTitle: "Head Office",
    address: ["388/65-388/66 Nuanchan Road", "Nuanchan, Bueng Kum", "Bangkok 10230"],
    contactTitle: "Contact Channels",
    contactLines: ["085-289-2451", "contact@asianoverseas.co.th"],
    formTitle: "Share Your Initial Brief",
    formBody:
      "Tell us your product category, quantity, or preferred timing and our team will respond with the information that best fits your sourcing plan.",
    formLabels: {
      name: "Contact Name",
      email: "Email",
      inquiryType: "Inquiry Type",
      timeline: "Preferred Timeline",
      details: "Project Details",
    },
    placeholders: {
      name: "Full name",
      email: "Your email address",
      timeline: "Target timing or delivery window",
      details: "Describe product type, volume, destination market, or any additional requirements",
    },
    options: ["Product Inquiry", "Export Support", "Logistics Support", "General Inquiry"],
    submit: "Submit Inquiry",
    supportTitle: "What we can help answer",
    supportBody:
      "The contact page should move people toward clear next steps, so we summarize the main topics our team can support from the start.",
    supportPoints: [
      { id: "products", text: "Product information and suitable order volume" },
      { id: "shipping", text: "Shipping Guidelines" },
      { id: "coordination", text: "Initial coordination for purchase plans and shipping rounds" },
    ],
  },
  zh: {
    heroTitle: ["咨询产品信息", "与出口安排"],
    heroBody:
      "我们可提供产品、出口与物流相关信息，帮助您更有把握地规划采购与市场拓展。",
    primaryCta: "发送咨询",
    secondaryCta: "查看产品",
    introTitle: "联系负责产品、出口与中国终端市场衔接的团队",
    introBody:
      "无论您需要产品资料、出口信息，还是长期采购计划支持，我们的团队都会提供清晰且实用的回复。",
    officeTitle: "总部办公室",
    address: ["388/65-388/66 Nuanchan Road", "Nuanchan, Bueng Kum", "Bangkok 10230"],
    contactTitle: "联系方式",
    contactLines: ["085-289-2451", "contact@asianoverseas.co.th"],
    formTitle: "提交初步需求",
    formBody:
      "告诉我们产品类别、数量或期望时间，我们的团队将根据您的采购计划提供更合适的信息。",
    formLabels: {
      name: "联系人姓名",
      email: "电子邮件",
      inquiryType: "咨询类型",
      timeline: "期望时间",
      details: "需求说明",
    },
    placeholders: {
      name: "姓名",
      email: "您的邮箱地址",
      timeline: "时间或交付窗口",
      details: "请说明产品类型、数量、目标市场或其他需求",
    },
    options: ["产品咨询", "出口支持", "物流支持", "一般咨询"],
    submit: "提交咨询",
    supportTitle: "我们可以协助哪些问题",
    supportBody:
      "联系页面应帮助客户更快进入下一步，因此我们先清楚说明团队可支持的重点内容。",
    supportPoints: [
      { id: "products", text: "产品信息与合适的采购数量" },
      { id: "shipping", text: "运输指南" },
      { id: "coordination", text: "采购计划 with 发运批次的初步协调" },
    ],
  },
};

type ContactPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: ContactPageProps) {
  const resolvedSearchParams = await searchParams;
  const lang = resolveLocale(resolvedSearchParams.lang);
  const copy = copyByLocale[lang];

  return {
    title: `${copy.heroTitle.join(" ")} | Asian Overseas Trading`,
    description: copy.heroBody,
  };
}

export const dynamic = "force-dynamic";


export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedSearchParams = await searchParams;
  const lang = resolveLocale(resolvedSearchParams.lang);
  const navigation = navigationByLocale[lang];
  const brand = brandByLocale[lang];
  const { data: pageData } = await supabase
    .from("page_content")
    .select("content")
    .eq("page_name", "contact")
    .maybeSingle();
  const dbContent = pageData?.content || {};
  const langContent = dbContent[lang] || {};
  const defaultCopy = copyByLocale[lang];
  const copy = {
    ...defaultCopy,
    ...langContent,
    heroTitle: langContent.heroTitle || defaultCopy.heroTitle,
    address: langContent.address || defaultCopy.address,
    contactLines: langContent.contactLines || defaultCopy.contactLines,
    options: langContent.options || defaultCopy.options,
    supportPoints: langContent.supportPoints || defaultCopy.supportPoints,
  };
  const images = {
    hero: dbContent.images?.hero || heroImage,
    office: dbContent.images?.office || officeImage,
  };

  return (
    <>
      <main className="bg-[var(--brand-bg)] font-[family-name:var(--font-open-sans)] text-[var(--brand-text)] transition-colors duration-500">
        <SiteHeader activeHref="/contact" brand={brand} currentLocale={lang} navigation={navigation} />

        <section className="relative h-screen min-h-[600px] overflow-hidden bg-[var(--brand-primary)]">
          <div className="absolute inset-0">
            <Image 
              src={images.hero} 
              alt="Contact hero" 
              fill 
              priority 
              sizes="(max-width: 1536px) 100vw, 1536px" 
              className="object-cover" 
              loading="eager"
              quality={90}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.64)_0%,rgba(0,0,0,0.32)_38%,rgba(0,0,0,0.08)_100%)]" />
          </div>

          <div className="relative z-10 mx-auto flex h-full w-full max-w-screen-2xl items-center px-4 py-12 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <div className="max-w-4xl reveal mt-20">
              <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-7xl">
                {copy.heroTitle.map((line: string) => (
                  <span key={line} className="block md:whitespace-nowrap">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-[1.7] text-white/84 md:text-lg reveal-delayed-1">
                {copy.heroBody}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row reveal-delayed-2">
                <a
                  href="#contact-form"
                  className="inline-flex min-w-[9.5rem] items-center justify-center rounded-md border-2 border-white bg-white px-7 py-4 text-center font-[family-name:var(--font-montserrat)] text-base font-medium text-[var(--brand-primary)] transition duration-300 hover:-translate-y-0.5 hover:bg-transparent hover:text-white hover:shadow-md"
                >
                  {copy.primaryCta}
                </a>
              </div>
            </div>
          </div>
        </section>

        <ContactSupportSection locale={lang} copy={copy} />

        <section id="contact-form" className="bg-[var(--brand-bg)] px-4 py-12 md:py-24 sm:px-6 md:px-8 lg:px-10 lg:py-24 xl:px-12">
          <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <ContactForm copy={copy} lang={lang} />

            <div className="space-y-8 lg:col-span-5">
              <div className="bg-[var(--brand-primary)] p-8 text-white sm:p-10">
                <h3 className="font-[family-name:var(--font-montserrat)] text-2xl font-semibold tracking-[-0.02em]">{copy.officeTitle}</h3>
                <div className="mt-5 space-y-1 text-base leading-[1.7] text-white/78">
                  {copy.address.map((line: string) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>

                <div className="mt-8">
                  <h4 className="font-[family-name:var(--font-montserrat)] text-lg font-semibold tracking-[-0.02em] text-white">
                    {copy.contactTitle}
                  </h4>
                  <div className="mt-4 space-y-3 text-base text-white/84">
                    {copy.contactLines.map((line: string) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.75rem] border border-[#d8dfce] bg-white shadow-[0_18px_48px_rgba(0,37,72,0.08)]">
                <div className="relative min-h-[20rem] overflow-hidden bg-[#eef2e6]">
                  <Image
                    src={images.office}
                    alt={copy.officeTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 41vw, 600px"
                    className="object-cover transition duration-700 hover:scale-[1.02]"
                    quality={85}
                  />
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[#d8dfce] bg-[#f7f8f2] p-8 shadow-[0_10px_26px_rgba(0,37,72,0.05)]">
                <h4 className="font-[family-name:var(--font-montserrat)] text-2xl font-semibold tracking-[-0.02em] text-[var(--brand-primary)]">
                  {copy.supportTitle}
                </h4>
                  <p className="mt-4 text-base leading-[1.7] text-slate-500">{copy.supportBody}</p>
                </div>
            </div>
          </div>
        </section>

        <SiteFooter locale={lang} />
      </main>
    </>
  );
}
