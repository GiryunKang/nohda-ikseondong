import type { Metadata } from "next";
import { Literata, DM_Sans } from "next/font/google";
import "./globals.css";

import { getLocale } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/context";
import { FloatingCta } from "@/components/floating-cta";
import { SITE_URL, OG_LOCALE_MAP } from "@/lib/constants";

const literata = Literata({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const META_BY_LOCALE: Record<string, { title: string; description: string; keywords: string[] }> = {
  ko: {
    title: "익선동 가이드 | 맛집, 카페, 문화 · 놓다",
    description:
      "익선동과 종로3가의 맛집, 카페, 문화공간, 숨은 이야기. 물품보관함 놓다와 함께 가볍게 즐기는 익선동 여행 가이드.",
    keywords: ["익선동", "익선동 맛집", "익선동 카페", "종로", "한옥마을", "서울 관광", "물품보관함", "놓다"],
  },
  en: {
    title: "Ikseon-dong Guide | Food, Cafes, Culture · Nohda",
    description:
      "Discover Ikseon-dong and Jongno 3-ga — restaurants, cafes, cultural spaces, and hidden stories. Travel light with Nohda luggage storage.",
    keywords: ["Ikseon-dong", "Seoul travel", "Jongno", "Korean hanok", "Seoul guide", "luggage storage", "Nohda"],
  },
  zh: {
    title: "益善洞攻略 | 美食、咖啡、文化 · 놓다",
    description: "首尔益善洞与钟路3街的美食、咖啡、文化空间推荐。行李交给놓다，轻松游览益善洞。",
    keywords: ["益善洞", "首尔旅游", "钟路", "韩屋", "首尔攻略", "行李寄存", "놓다"],
  },
  ja: {
    title: "益善洞ガイド | グルメ、カフェ、文化 · 놓다",
    description:
      "ソウル益善洞と鍾路3街のグルメ、カフェ、文化スポット。荷物は놓다に預けて、益善洞を身軽に楽しもう。",
    keywords: ["益善洞", "ソウル旅行", "鍾路", "韓屋", "ソウルガイド", "荷物預け", "놓다"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = META_BY_LOCALE[locale] ?? META_BY_LOCALE.ko;
  const ogLocale = OG_LOCALE_MAP[locale] ?? "ko_KR";

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: meta.title, template: `%s | 놓다 익선동` },
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: SITE_URL,
      languages: {
        ko: `${SITE_URL}?lang=ko`,
        en: `${SITE_URL}?lang=en`,
        zh: `${SITE_URL}?lang=zh`,
        ja: `${SITE_URL}?lang=ja`,
        "x-default": SITE_URL,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: SITE_URL,
      siteName: "놓다 익선동",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${literata.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("nohda-theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <I18nProvider locale={locale}>
          {children}
          <FloatingCta />
        </I18nProvider>
      </body>
    </html>
  );
}
