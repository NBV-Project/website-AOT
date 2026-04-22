import type { Metadata } from "next";
import { Prompt, Montserrat, Open_Sans } from "next/font/google";

import "./globals.css";

const fallbackSiteUrl = "http://localhost:3000";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

function getMetadataBase() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    return new URL(configuredSiteUrl);
  }

  // Keep local builds quiet; production must override this with NEXT_PUBLIC_SITE_URL.
  return new URL(fallbackSiteUrl);
}

// Montserrat: preload=true since it's used on every hero h1/h2 (LCP font)
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "800"],
  display: "swap",
  preload: true,
});

// Prompt: Thai script — preload only the weights actually used
const prompt = Prompt({
  weight: ["400", "600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-prompt",
  preload: true, // Thai hero text is part of LCP on localized pages
});

// Open Sans: body text — subset to latin only, swap display
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: getMetadataBase(),
    title: "Asian Overseas Trading | Premium Thai Fruit Export to China",
    description:
      "Connecting premium Thai fruits to global markets with professional logistics and sourcing excellence.",
    keywords: [
      "fruit export",
      "Thailand fruit",
      "durian export",
      "logistics",
      "Asian Overseas Trading",
      "ไทยผลไม้ส่งออก",
      "榴莲出口",
      "泰国水果出口",
      "泰国榴莲",
      "泰国椰子",
      "AOT Fruit",
    ],
    other: {
      "renderer": "webkit",
      "force-rendering": "webkit",
      "applicable-device": "pc,mobile",
    },
    alternates: {
      canonical: "/th",
      languages: {
        "th-TH": "/th",
        "en-US": "/en",
        "zh-CN": "/zh",
      },
    },
    openGraph: {
      title: "Asian Overseas Trading | Premium Thai Fruit Export to China",
      description:
        "Connecting premium Thai fruits to global markets with professional logistics and sourcing excellence.",
      images: ["/images/hero-home.jpg"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${prompt.variable} ${montserrat.variable} ${openSans.variable} scroll-smooth`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Preconnect to Supabase to speed up DB fetching in China/HK */}
        {supabaseUrl ? <link rel="preconnect" href={supabaseUrl} /> : null}
        {supabaseUrl ? <link rel="dns-prefetch" href={supabaseUrl} /> : null}

        {/* China Browser Engine Rendering Compatibility */}
        <meta name="renderer" content="webkit" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />

        {/* Theme Persistence Script - Prevents "Flash" on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('preferred-theme') || 'navy';
                  document.documentElement.setAttribute('data-theme', savedTheme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
