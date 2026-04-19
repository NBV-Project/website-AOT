"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { type Locale } from "@/lib/locale";

type ProductDetail = {
  id: string;
  title: string;
  usage: string;
  description: string;
  image: string;
  benefits: string[];
  is_in_season?: boolean;
  price_range?: string;
};

const productDetailsByLocale: Record<Locale, Record<string, ProductDetail>> = {
  th: {
    durian: {
      id: "durian",
      title: "ทุเรียน",
      usage: "เหมาะสำหรับบริโภคสด, แปรรูปเป็นทุเรียนอบแห้ง, หรือทำขนมหวานระดับพรีเมียม",
      description: "ราชาแห่งผลไม้ไทยที่มีรสชาติเข้มข้นและกลิ่นหอมเป็นเอกลักษณ์ คัดสรรจากสวนคุณภาพส่งออก",
      image: "/images/category-durian-new.jpg",
      benefits: ["คัดเกรดพรีเมียม", "รสชาติหวานมัน", "เนื้อแน่นสม่ำเสมอ"],
      is_in_season: true,
      price_range: "250 - 450 THB/KG",
    },
    coconut: {
      id: "coconut",
      title: "มะพร้าว",
      usage: "ใช้ดื่มน้ำสดเพื่อสุขภาพ, ประกอบอาหารคาวหวาน, หรืออุตสาหกรรมเครื่องดื่ม",
      description: "มะพร้าวน้ำหอมคัดเกรดที่มีความหวานหอมเป็นเอกลักษณ์ เปลือกเขียวสวย เนื้อนุ่มกำลังดี",
      image: "/images/category-coconut-modal-new.png",
      benefits: ["น้ำหวานหอมธรรมชาติ", "เนื้อชั้นดี", "เก็บรักษาความสดได้นาน"],
      is_in_season: true,
      price_range: "35 - 60 THB/Unit",
    },
    mango: {
      id: "mango",
      title: "มะม่วง",
      usage: "รับประทานสดคู่กับข้าวเหนียวมูน, ทำน้ำผลไม้สกัดเย็น, หรืออบแห้งส่งออก",
      description: "มะม่วงน้ำดอกไม้สีทองและพันธุ์ยอดนิยม สีสวย รสหวานฉ่ำ เนื้อเนียนไม่มีเสี้ยน",
      image: "/images/category-mango-v3.jpg",
      benefits: ["สีทองสวยงาม", "รสหวานฉ่ำ", "คุณภาพส่งออก 100%"],
      is_in_season: false,
      price_range: "เร็วๆ นี้",
    },
    mangosteen: {
      id: "mangosteen",
      title: "มังคุด",
      usage: "ราชินีแห่งผลไม้ นิยมรับประทานสดเพื่อความสดชื่น หรือสกัดเป็นน้ำมังคุดเข้มข้น",
      description: "มังคุดผิวมันสวย เนื้อขาวสะอาดเป็นปุย ผสมผสานรสหวานอมเปรี้ยวที่ลงตัว",
      image: "/images/category-mangosteen-v5.jpg",
      benefits: ["เนื้อขาวสะอาด", "รสชาติกลมกล่อม", "คัดไซส์มาตรฐาน"],
      is_in_season: false,
      price_range: "เร็วๆ นี้",
    },
    jackfruit: {
      id: "jackfruit",
      title: "ขนุน",
      usage: "รับประทานเป็นผลไม้สด, ใส่ในขนมหวานไทย, หรือแปรรูปเป็นขนุนทอดกรอบ",
      description: "ขนุนเนื้อหนา สีเหลืองทอง รสหวานจัดและมีกลิ่นหอม เยื่อน้อย เมล็ดเล็ก",
      image: "/images/category-jackfruit-v4.jpg",
      benefits: ["เนื้อหนาหวานหอม", "สีเหลืองทองสวย", "คัดเฉพาะเนื้อพรีเมียม"],
      is_in_season: true,
      price_range: "120 - 180 THB/KG",
    },
    pineapple: {
      id: "pineapple",
      title: "สับปะรด",
      usage: "รับประทานสด, ทำน้ำสับปะรดเข้มข้น, หรือใช้ในอุตสาหกรรมอาหารกระป๋อง",
      description: "สับปะรดรสหวานอมเปรี้ยวสดชื่น ตาโต เนื้อเหลืองสวย ฉ่ำน้ำกำลังดี",
      image: "/images/category-pineapple-v3.jpg",
      benefits: ["รสชาติสดชื่น", "เนื้อเหลืองฉ่ำ", "วิตามินสูง"],
      is_in_season: true,
      price_range: "40 - 70 THB/Unit",
    },
  },
  en: {
    durian: {
      id: "durian",
      title: "Durian",
      usage: "Best for fresh consumption, freeze-dried processing, or premium desserts.",
      description: "The King of Fruits with a rich, creamy texture and unique aroma. Selected from export-quality orchards.",
      image: "/images/category-durian-new.jpg",
      benefits: ["Premium Grade", "Creamy & Sweet", "Consistent Texture"],
      is_in_season: true,
      price_range: "8 - 14 USD/KG",
    },
    coconut: {
      id: "coconut",
      title: "Coconut",
      usage: "Ideal for fresh health drinks, culinary ingredients, or the beverage industry.",
      description: "High-grade aromatic coconuts with natural sweetness and soft, tender meat.",
      image: "/images/category-coconut-modal-new.png",
      benefits: ["Naturally Sweet", "High-Quality Meat", "Long Shelf Life"],
      is_in_season: true,
      price_range: "1.5 - 2.5 USD/Unit",
    },
    mango: {
      id: "mango",
      title: "Mango",
      usage: "Perfect for Mango Sticky Rice, cold-pressed juices, or dried fruit export.",
      description: "Golden Nam Dok Mai mangoes with a beautiful color, sweet juice, and smooth fiber-free flesh.",
      image: "/images/category-mango-v3.jpg",
      benefits: ["Beautiful Golden Color", "Sweet & Juicy", "100% Export Quality"],
      is_in_season: false,
      price_range: "Coming Soon",
    },
    mangosteen: {
      id: "mangosteen",
      title: "Mangosteen",
      usage: "The Queen of Fruits, best enjoyed fresh or as a concentrated juice extract.",
      description: "Shiny skin with snowy white flesh, offering a perfect balance of sweet and tangy flavors.",
      image: "/images/category-mangosteen-v5.jpg",
      benefits: ["Pure White Flesh", "Balanced Flavor", "Standardized Sizing"],
      is_in_season: false,
      price_range: "Coming Soon",
    },
    jackfruit: {
      id: "jackfruit",
      title: "Jackfruit",
      usage: "Enjoyed as fresh fruit, used in traditional desserts, or processed into crispy chips.",
      description: "Thick, golden-yellow flesh with intense sweetness and a pleasant aroma.",
      image: "/images/category-jackfruit-v4.jpg",
      benefits: ["Thick & Sweet", "Rich Golden Color", "Premium Selection"],
      is_in_season: true,
      price_range: "4 - 6 USD/KG",
    },
    pineapple: {
      id: "pineapple",
      title: "Pineapple",
      usage: "Great for fresh eating, concentrated juices, or the canning industry.",
      description: "Refreshing sweet and tangy pineapple with bright yellow flesh and juicy texture.",
      image: "/images/category-pineapple-v3.jpg",
      benefits: ["Refreshing Taste", "Juicy Yellow Flesh", "High in Vitamins"],
      is_in_season: true,
      price_range: "1.2 - 2.0 USD/Unit",
    },
  },
  zh: {
    durian: {
      id: "durian",
      title: "榴莲",
      usage: "最适合鲜食、冻干加工或高端甜点制作。",
      description: "果中之王，质地浓郁奶油，香气独特。选自出口级优质果园。",
      image: "/images/category-durian-new.jpg",
      benefits: ["特级品质", "口感香甜", "肉质均匀"],
      is_in_season: true,
      price_range: "60 - 100 RMB/KG",
    },
    coconut: {
      id: "coconut",
      title: "椰子",
      usage: "非常适合鲜饮、烹饪食材 or 饮料工业。",
      description: "高等级香椰，具有天然的甜味和柔软嫩滑的果肉。",
      image: "/images/category-coconut-modal-new.png",
      benefits: ["天然甜味", "优质肉质", "保鲜期长"],
      is_in_season: true,
      price_range: "10 - 18 RMB/Unit",
    },
    mango: {
      id: "mango",
      title: "芒果",
      usage: "非常适合搭配糯米饭、冷压果汁或干果出口。",
      description: "金灿灿的“水仙芒”，果色优美，汁多味甜，果肉细腻无丝。",
      image: "/images/category-mango-v3.jpg",
      benefits: ["色泽金黄", "香甜多汁", "100%出口品质"],
      is_in_season: false,
      price_range: "敬请期待",
    },
    mangosteen: {
      id: "mangosteen",
      title: "山竹",
      usage: "果中之后，最适合鲜食或作为浓缩汁提取物。",
      description: "表皮油亮，果肉雪白，甜酸味道完美平衡。",
      image: "/images/category-mangosteen-v5.jpg",
      benefits: ["肉质雪白", "味道甘甜", "标准化尺寸"],
      is_in_season: false,
      price_range: "敬请期待",
    },
    jackfruit: {
      id: "jackfruit",
      title: "菠萝蜜",
      usage: "可作为鲜果享用，用于传统甜点，或加工成脆片。",
      description: "果肉肥厚，呈金黄色，甜度极高，香气宜人。",
      image: "/images/category-jackfruit-v4.jpg",
      benefits: ["果肉肥厚", "金黄诱人", "特选级别"],
      is_in_season: true,
      price_range: "30 - 45 RMB/KG",
    },
    pineapple: {
      id: "pineapple",
      title: "菠萝",
      usage: "非常适合鲜食、浓缩果汁或罐头工业。",
      description: "清新酸甜的菠萝，果肉亮黄，水分充足。",
      image: "/images/category-pineapple-v3.jpg",
      benefits: ["口感清爽", "果肉亮黄", "富含维生素"],
      is_in_season: true,
      price_range: "8 - 15 RMB/Unit",
    },
  },
};

type ProductDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  locale: Locale;
};

export function ProductDetailModal({ isOpen, onClose, productId, locale }: ProductDetailModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = "";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isVisible || !productId) return null;

  const product = productDetailsByLocale[locale][productId];
  if (!product) return null;

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
        className={`fixed inset-0 bg-black/50 transition-opacity duration-500 ${
          isOpen ? "opacity-100 animate-modal-backdrop" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative z-[10000] w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-[var(--brand-bg)] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] ${
          isOpen ? "animate-modal-content" : "animate-modal-content-out"
        } max-h-[90vh] flex flex-col md:flex-row border border-white/20`}
      >
        {/* Left Side: Image (Full width on mobile, half on md+) */}
        <div className="relative h-64 md:h-auto md:w-1/2 min-h-[16rem] overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            priority
            className={`object-cover transition-transform duration-1000 ease-out ${isOpen ? "scale-100" : "scale-110"} ${product.is_in_season === false ? "grayscale-[0.4]" : ""}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:hidden" />
          
          {/* Seasonal Badge on Image */}
          {product.is_in_season === false && (
            <div className="absolute left-6 top-6 z-10">
              <span className="inline-flex rounded-full bg-red-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-lg">
                {locale === "th" ? "นอกฤดูกาล" : locale === "zh" ? "非产季" : "Out of Season"}
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Text Content */}
        <div className="flex-1 p-8 md:p-12 lg:p-14 overflow-y-auto bg-[var(--brand-bg)]">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/80 text-slate-500 backdrop-blur-sm transition-colors hover:bg-slate-200 hover:text-[var(--brand-primary)] z-20"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest ${product.is_in_season === false ? "bg-slate-100 text-slate-400" : "bg-[#95bb72]/10 text-[#6f9152]"}`}>
              {locale === "th" ? "รายละเอียดสินค้า" : locale === "zh" ? "产品详情" : "Product Details"}
            </span>
            {product.price_range && (
               <span className="inline-flex rounded-full bg-amber-50 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-600 border border-amber-100">
                {product.price_range}
              </span>
            )}
          </div>

          <h2 className="mt-4 font-[family-name:var(--font-montserrat)] text-4xl font-bold tracking-[-0.02em] text-[var(--brand-primary)] sm:text-5xl">
            {product.title}
          </h2>

          <p className="mt-6 text-base leading-relaxed text-slate-600 lg:text-lg">
            {product.description}
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <h4 className="font-[family-name:var(--font-montserrat)] text-sm font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                {locale === "th" ? "การนำไปใช้งาน" : locale === "zh" ? "产品用途" : "How to use"}
              </h4>
              <p className="mt-2 text-base text-slate-600">{product.usage}</p>
            </div>

            <div>
              <h4 className="font-[family-name:var(--font-montserrat)] text-sm font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                {locale === "th" ? "จุดเด่น" : locale === "zh" ? "核心优势" : "Key Benefits"}
              </h4>
              <ul className="mt-3 space-y-2">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] text-white ${product.is_in_season === false ? "bg-slate-300" : "bg-[#95bb72]"}`}>
                      ✓
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`mt-10 w-full rounded-xl py-4 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:brightness-110 active:scale-[0.98] ${product.is_in_season === false ? "bg-slate-400" : "bg-[var(--brand-primary)]"}`}
          >
            {locale === "th" ? "ปิดหน้าต่าง" : locale === "zh" ? "关闭窗口" : "Close window"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
