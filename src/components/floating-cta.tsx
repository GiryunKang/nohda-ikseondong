"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import { X } from "lucide-react";

export function FloatingCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a
        href="https://놓다.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full bg-card px-4 py-2.5 shadow-lg ring-1 ring-border/50 transition-shadow hover:shadow-xl"
      >
        <Image src="/logo-icon.png" alt="놓다" width={24} height={24} className="h-6 w-auto" />
        <span className="text-sm font-medium">짐 맡기기</span>
      </a>
      <button
        onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-foreground hover:text-background"
        aria-label="닫기"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
