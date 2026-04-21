import Image from "next/image";
import Link from "next/link";
import { type Locale, withLang } from "@/lib/locale";

type CategoryItem = {
  id: string;
  title: string;
  image: string;
  is_in_season?: boolean;
};

type ProductCategoriesHomeProps = {
  categories: CategoryItem[];
  locale: Locale;
};

export function ProductCategoriesHome({
  categories,
  locale,
}: ProductCategoriesHomeProps) {
  return (
    <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((item, index) => (
        <Link
          key={item.id}
          href={withLang("/products", locale)}
          className="group text-center transition-transform duration-200 active:scale-[0.97]"
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
              {item.is_in_season === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                  <span className="rounded-full bg-red-500/90 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg">
                    {locale === "th"
                      ? "เร็วๆ นี้"
                      : locale === "zh"
                        ? "敬请期待"
                        : "Soon"}
                  </span>
                </div>
              )}
              <div
                className={`absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  item.is_in_season === false ? "hidden" : ""
                }`}
              >
                <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                  {locale === "th"
                    ? "ดูสินค้า"
                    : locale === "zh"
                      ? "查看产品"
                      : "View Products"}
                </span>
              </div>
            </div>
          </div>
          <h3
            className={`mt-5 font-[family-name:var(--font-montserrat)] text-2xl font-semibold tracking-normal transition-colors duration-300 ${
              item.is_in_season === false
                ? "text-slate-400"
                : "text-[var(--brand-primary)] group-hover:text-[#6f9152]"
            }`}
          >
            {item.title}
          </h3>
        </Link>
      ))}
    </div>
  );
}
