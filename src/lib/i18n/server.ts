import { cookies, headers } from "next/headers";

import { COOKIE_NAME, DEFAULT_LOCALE, detectLocale } from "./config";
import { getDictionary } from "./dictionaries";

import type { Locale } from "./config";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = cookieStore.get(COOKIE_NAME)?.value as Locale | undefined;

  if (saved && ["ko", "en", "zh", "ja"].includes(saved)) {
    return saved;
  }

  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");
  return detectLocale(acceptLanguage);
}

export async function getServerDictionary() {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}
