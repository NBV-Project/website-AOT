import HomePage from "@/app/page";
import { locales, type Locale } from "@/lib/locale";

type LocalizedPageProps = {
  params: Promise<{ lang: Locale }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocalizedHomePage({
  params,
}: LocalizedPageProps) {
  const { lang } = await params;

  return <HomePage searchParams={Promise.resolve({ lang })} />;
}
