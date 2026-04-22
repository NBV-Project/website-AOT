import LogisticsPage from "@/app/logistics/page";
import { type Locale } from "@/lib/locale";

type LocalizedPageProps = {
  params: Promise<{ lang: Locale }>;
};

export const dynamic = "force-dynamic";

export default async function LocalizedLogisticsPage({
  params,
}: LocalizedPageProps) {
  const { lang } = await params;

  return <LogisticsPage searchParams={Promise.resolve({ lang })} />;
}
