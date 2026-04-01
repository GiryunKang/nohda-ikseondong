import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

import { getLocale } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/context";
import { FloatingCta } from "@/components/floating-cta";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "익선동 가이드 | 맛집, 카페, 문화 · 놓다",
  description:
    "익선동과 종로3가의 맛집, 카페, 문화공간, 숨은 이야기. 물품보관함 놓다와 함께 가볍게 즐기는 익선동 여행 가이드.",
  keywords: ["익선동", "익선동 맛집", "익선동 카페", "종로", "한옥마을", "서울 관광", "물품보관함", "놓다", "luggage storage", "Ikseon-dong"],
  openGraph: {
    title: "익선동 가이드 | 맛집, 카페, 문화 · 놓다",
    description: "익선동과 종로3가의 맛집, 카페, 문화공간. 물품보관함 놓다와 함께 가볍게.",
    locale: "ko_KR",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${plusJakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <I18nProvider locale={locale}>
          {children}
          <FloatingCta />
        </I18nProvider>
      </body>
    </html>
  );
}
