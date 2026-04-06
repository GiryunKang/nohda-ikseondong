"use client";

import { useState } from "react";

import { Share2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  title: string;
  text?: string;
}

export function ShareButton({ title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Share failed:", err);
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard write failed:", err);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className="gap-2 text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-sm">링크 복사됨</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          <span className="text-sm">공유하기</span>
        </>
      )}
    </Button>
  );
}
