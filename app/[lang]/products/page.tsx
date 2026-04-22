import ProductsPage from "@/app/products/page";
import { type Locale } from "@/lib/locale";

type LocalizedPageProps = {
  params: Promise<{ lang: Locale }>;
};

export const dynamic = "force-dynamic";

export default async function LocalizedProductsPage({
  params,
}: LocalizedPageProps) {
  const { lang } = await params;

  return <ProductsPage searchParams={Promise.resolve({ lang })} />;
}
