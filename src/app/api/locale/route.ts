import { NextResponse } from "next/server";

import { COOKIE_NAME, LOCALES } from "@/lib/i18n/config";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

import type { NextRequest } from "next/server";
import type { Locale } from "@/lib/i18n/config";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rl = checkRateLimit(`locale:${ip}`, { limit: 20, windowSeconds: 60 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  let locale: string;
  try {
    const body = await request.json();
    locale = body.locale;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!locale || !LOCALES.includes(locale as Locale)) {
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
