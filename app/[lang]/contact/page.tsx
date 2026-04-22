import ContactPage from "@/app/contact/page";
import { type Locale } from "@/lib/locale";

type LocalizedPageProps = {
  params: Promise<{ lang: Locale }>;
};

export const dynamic = "force-dynamic";

export default async function LocalizedContactPage({
  params,
}: LocalizedPageProps) {
  const { lang } = await params;

  return <ContactPage searchParams={Promise.resolve({ lang })} />;
}
