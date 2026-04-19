import ProductsPage from "@/app/products/page";
import { locales, type Locale } from "@/lib/locale";

type LocalizedPageProps = {
  params: Promise<{ lang: Locale }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocalizedProductsPage({
  params,
}: LocalizedPageProps) {
  const { lang } = await params;

  return <ProductsPage searchParams={Promise.resolve({ lang })} />;
}
