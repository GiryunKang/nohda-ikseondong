"use client";

import { useState, useEffect } from "react";

import { X } from "lucide-react";

export function FloatingCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:w-auto">
      <div className="flex items-center gap-3 rounded-2xl bg-primary px-4 py-3 shadow-lg shadow-primary/25">
        <span className="text-2xl">🐶</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary-foreground">
            짐은 놓다에 맡기세요!
          </p>
          <p className="text-xs text-primary-foreground/80">
            익선동 맞은편 · 24시간 무인 보관함
          </p>
        </div>
        <a
          href="https://놓다.com"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
        >
          이용하기
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-primary-foreground/60 hover:text-primary-foreground"
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
