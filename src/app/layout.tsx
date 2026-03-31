import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

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
  title: "놓다 익선동 | 물품보관함 & 익선동 가이드",
  description:
    "익선동 바로 맞은편, 무인 물품보관함 놓다. 짐은 맡기고 익선동을 가볍게 즐기세요. 맛집, 카페, 문화공간 추천까지.",
  keywords: ["익선동", "물품보관함", "놓다", "종로", "짐보관", "서울 관광"],
  openGraph: {
    title: "놓다 익선동 | 물품보관함 & 익선동 가이드",
    description: "짐은 놓다에 맡기고, 익선동을 가볍게 즐기세요.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${plusJakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
