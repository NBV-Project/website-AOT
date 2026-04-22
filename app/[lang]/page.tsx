import HomePage from "@/app/page";
import { type Locale } from "@/lib/locale";

type LocalizedPageProps = {
  params: Promise<{ lang: Locale }>;
};

export const dynamic = "force-dynamic";

export default async function LocalizedHomePage({
  params,
}: LocalizedPageProps) {
  const { lang } = await params;

  return <HomePage searchParams={Promise.resolve({ lang })} />;
}
