"use client";

import { useRouter } from "next/navigation";

import { useI18n } from "@/lib/i18n/context";
import { LOCALES, LOCALE_FLAGS, LOCALE_LABELS } from "@/lib/i18n/config";

export function LocaleSwitcher() {
  const router = useRouter();
  const { locale: current } = useI18n();

  const handleChange = async (newLocale: string) => {
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: newLocale }),
    });
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map((loc) => (
        <button
          key={loc}
          onClick={() => handleChange(loc)}
          className={`rounded-md px-1.5 py-1 text-xs transition-colors ${
            current === loc
              ? "bg-primary/10 font-semibold text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={LOCALE_LABELS[loc]}
        >
          {LOCALE_FLAGS[loc]}
        </button>
      ))}
    </div>
  );
}
