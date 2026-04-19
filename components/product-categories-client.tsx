"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { type Locale } from "@/lib/locale";

const ProductDetailModal = dynamic(
  () => import("./product-detail-modal").then((mod) => mod.ProductDetailModal),
  { ssr: false },
);

type CategoryItem = {
  id: string;
  title: string;
  image: string;
  is_in_season?: boolean;
};

type ProductCategoriesClientProps = {
  categories: CategoryItem[];
  locale: Locale;
  // For home page grid styling
  isHomePage?: boolean;
};

export function ProductCategoriesClient({ categories, locale, isHomePage = false }: ProductCategoriesClientProps) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setIsModalOpen(true);
  };

  if (isHomePage) {
    return (
      <>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((item, index) => (
            <article
              key={item.id}
              className="group cursor-pointer text-center active:scale-[0.97] transition-transform duration-200"
              onClick={() => handleProductClick(item.id)}
            >
              <div
                className={`mx-auto flex aspect-square w-full max-w-[13rem] items-center justify-center overflow-hidden rounded-full border shadow-[0_14px_30px_rgba(31,36,32,0.08)] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_20px_36px_rgba(31,36,32,0.14)] ${
                  index === 0 ? "border-[#95bb72] ring-4 ring-[#eef4df]" : "border-[#eef1e4]"
                } ${item.is_in_season === false ? "opacity-90 grayscale-[0.6]" : ""}`}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 14vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  {/* Seasonal Badge */}
                  {item.is_in_season === false && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                      <span className="rounded-full bg-red-500/90 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg">
                        {locale === "th" ? "เร็วๆ นี้" : locale === "zh" ? "敬请期待" : "Soon"}
                      </span>
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${item.is_in_season === false ? "hidden" : ""}`}>
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                      {locale === "th" ? "ดูข้อมูล" : locale === "zh" ? "查看详情" : "View Info"}
                    </span>
                  </div>
                </div>
              </div>
              <h3 className={`mt-5 font-[family-name:var(--font-montserrat)] text-2xl font-semibold tracking-normal transition-colors duration-300 ${item.is_in_season === false ? "text-slate-400" : "text-[var(--brand-primary)] group-hover:text-[#6f9152]"}`}>
                {item.title}
              </h3>
            </article>
          ))}
        </div>

        <ProductDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productId={selectedProductId}
          locale={locale}
        />
      </>
    );
  }

  // Products Page Grid Styling
  return (
    <>
      <div className="mt-12 grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((item) => (
          <article
            key={item.id}
            className="group mx-auto flex w-full max-w-[13.5rem] cursor-pointer flex-col items-center active:scale-[0.97] transition-transform duration-200"
            onClick={() => handleProductClick(item.id)}
          >
            <div className={`relative h-36 w-36 overflow-hidden rounded-full border border-[var(--brand-border)] bg-[#f7f8f2] shadow-[0_12px_28px_rgba(0,37,72,0.08)] transition duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,37,72,0.12)] sm:h-40 sm:w-40 ${item.is_in_season === false ? "opacity-90 grayscale-[0.6]" : ""}`}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 144px, 160px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Seasonal Badge */}
              {item.is_in_season === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                  <span className="rounded-full bg-red-500/90 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg">
                    {locale === "th" ? "เร็วๆ นี้" : locale === "zh" ? "敬请期待" : "Soon"}
                  </span>
                </div>
              )}
              {/* Hover Overlay */}
              <div className={`absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${item.is_in_season === false ? "hidden" : ""}`}>
                <span className="rounded-full bg-white/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                  {locale === "th" ? "ดูข้อมูล" : locale === "zh" ? "查看详情" : "View Info"}
                </span>
              </div>
            </div>
            <h3 className={`mt-5 font-[family-name:var(--font-montserrat)] text-2xl font-semibold transition-colors duration-300 ${item.is_in_season === false ? "text-slate-400" : "text-[var(--brand-primary)] group-hover:text-[#6f9152]"}`}>
              {item.title}
            </h3>
          </article>
        ))}
      </div>

      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={selectedProductId}
        locale={locale}
      />
    </>
  );
}
