import LogisticsPage from "@/app/logistics/page";
import { locales, type Locale } from "@/lib/locale";

type LocalizedPageProps = {
  params: Promise<{ lang: Locale }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocalizedLogisticsPage({
  params,
}: LocalizedPageProps) {
  const { lang } = await params;

  return <LogisticsPage searchParams={Promise.resolve({ lang })} />;
}
