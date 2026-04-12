"use client";

import { useCallback, useSyncExternalStore } from "react";

import { Sun, Moon } from "lucide-react";

import { Button } from "@/components/ui/button";

function getThemeSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(callback: () => void): () => void {
  // Ensure dark class matches localStorage on mount (guards against SSR mismatch)
  const stored = localStorage.getItem("nohda-theme");
  const shouldBeDark =
    stored === "dark" ||
    (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const isDark = document.documentElement.classList.contains("dark");
  if (shouldBeDark && !isDark) document.documentElement.classList.add("dark");
  if (!shouldBeDark && isDark) document.documentElement.classList.remove("dark");

  // Listen for class changes on <html>
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // Listen for system theme changes
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => {
    if (!localStorage.getItem("nohda-theme")) {
      if (mql.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };
  mql.addEventListener("change", handleChange);

  return () => {
    observer.disconnect();
    mql.removeEventListener("change", handleChange);
  };
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next = !dark;
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("nohda-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("nohda-theme", "light");
    }
  }, [dark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className="h-8 w-8"
    >
      {dark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
