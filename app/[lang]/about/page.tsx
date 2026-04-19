import AboutPage from "@/app/about/page";
import { locales, type Locale } from "@/lib/locale";

type LocalizedPageProps = {
  params: Promise<{ lang: Locale }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocalizedAboutPage({
  params,
}: LocalizedPageProps) {
  const { lang } = await params;

  return <AboutPage searchParams={Promise.resolve({ lang })} />;
}
