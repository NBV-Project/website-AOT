import AboutPage from "@/app/about/page";
import { type Locale } from "@/lib/locale";

type LocalizedPageProps = {
  params: Promise<{ lang: Locale }>;
};

export const dynamic = "force-dynamic";

export default async function LocalizedAboutPage({
  params,
}: LocalizedPageProps) {
  const { lang } = await params;

  return <AboutPage searchParams={Promise.resolve({ lang })} />;
}
