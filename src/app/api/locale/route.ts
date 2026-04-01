import { NextResponse } from "next/server";

import { COOKIE_NAME, LOCALES } from "@/lib/i18n/config";

import type { NextRequest } from "next/server";
import type { Locale } from "@/lib/i18n/config";

export async function POST(request: NextRequest) {
  const { locale } = (await request.json()) as { locale: string };

  if (!LOCALES.includes(locale as Locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true, locale });
  response.cookies.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}
