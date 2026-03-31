"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function CrawlButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleCrawl = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/crawl", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setResult(
          `완료! ${data.summary.total_fetched}개 수집, ${data.summary.total_upserted}개 저장`
        );
        router.refresh();
      } else {
        setResult(data.error ?? "크롤링에 실패했습니다.");
      }
    } catch {
      setResult("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {result && (
        <span className="text-sm text-muted-foreground">{result}</span>
      )}
      <Button onClick={handleCrawl} disabled={loading}>
        {loading ? "크롤링 중..." : "📍 크롤링 실행"}
      </Button>
    </div>
  );
}
