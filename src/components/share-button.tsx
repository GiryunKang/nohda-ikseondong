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
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
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
