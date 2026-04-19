import ContactPage from "@/app/contact/page";
import { locales, type Locale } from "@/lib/locale";

type LocalizedPageProps = {
  params: Promise<{ lang: Locale }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocalizedContactPage({
  params,
}: LocalizedPageProps) {
  const { lang } = await params;

  return <ContactPage searchParams={Promise.resolve({ lang })} />;
}
