"use client";

import { useState, useEffect } from "react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  sns_summary_x: string | null;
  sns_summary_instagram: string | null;
}

interface SnsPost {
  id: string;
  article_id: string;
  platform: string;
  status: string;
  post_url: string | null;
  error_message: string | null;
  published_at: string | null;
  created_at: string;
}

export default function AdminSnsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [snsPosts, setSnsPosts] = useState<SnsPost[]>([]);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const [{ data: arts }, { data: posts }] = await Promise.all([
        supabase
          .from("articles")
          .select("id, title, slug, category, status, sns_summary_x, sns_summary_instagram")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(20),
        supabase
          .from("sns_posts")
          .select("id, article_id, platform, status, post_url, error_message, published_at, created_at")
          .order("created_at", { ascending: false })
          .limit(30),
      ]);

      setArticles(arts ?? []);
      setSnsPosts(posts ?? []);
    }

    load();
  }, [result]);

  const handlePublish = async (articleId: string, platforms: Array<"x" | "instagram">) => {
    setPublishing(articleId);
    setResult(null);

    try {
      const response = await fetch("/api/sns/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: articleId, platforms }),
      });

      const data = await response.json();

      if (data.success) {
        const msgs: string[] = [];
        if (data.results.x?.success) msgs.push("X 발행 성공");
        if (data.results.x && !data.results.x.success) msgs.push(`X 실패: ${data.results.x.error}`);
        if (data.results.instagram?.success) msgs.push("Instagram 발행 성공");
        if (data.results.instagram && !data.results.instagram.success) msgs.push(`Instagram 실패: ${data.results.instagram.error}`);
        setResult(msgs.join(" / "));
      } else {
        setResult(data.error ?? "발행에 실패했습니다.");
      }
    } catch {
      setResult("네트워크 오류가 발생했습니다.");
    } finally {
      setPublishing(null);
    }
  };

  const statusLabels: Record<string, string> = {
    published: "발행됨",
    failed: "실패",
    pending: "대기",
    scheduled: "예약",
  };

  const statusColors: Record<string, string> = {
    published: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-600",
    pending: "bg-yellow-100 text-yellow-700",
    scheduled: "bg-blue-100 text-blue-700",
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">SNS 발행</h1>
      <p className="mt-1 text-muted-foreground">
        발행된 글을 Instagram, X에 공유합니다
      </p>

      {result && (
        <Card className="mt-4 border shadow-sm">
          <CardContent className="p-4 text-sm">{result}</CardContent>
        </Card>
      )}

      {/* Published articles for SNS sharing */}
      <h2 className="mt-8 font-heading text-lg font-semibold">발행된 콘텐츠</h2>
      <div className="mt-4 space-y-3">
        {articles.length > 0 ? (
          articles.map((article) => {
            const posted = snsPosts.filter((p) => p.article_id === article.id);
            const xPosted = posted.some((p) => p.platform === "x" && p.status === "published");
            const igPosted = posted.some((p) => p.platform === "instagram" && p.status === "published");

            return (
              <Card key={article.id} className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium">{article.title}</h3>
                      <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                        {xPosted && <span className="text-green-600">✓ X 발행됨</span>}
                        {igPosted && <span className="text-green-600">✓ Instagram 발행됨</span>}
                        {!xPosted && !igPosted && <span>아직 SNS에 공유되지 않음</span>}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {!xPosted && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={publishing === article.id}
                          onClick={() => handlePublish(article.id, ["x"])}
                        >
                          𝕏 공유
                        </Button>
                      )}
                      {!igPosted && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={publishing === article.id}
                          onClick={() => handlePublish(article.id, ["instagram"])}
                        >
                          📷 공유
                        </Button>
                      )}
                      {!xPosted && !igPosted && (
                        <Button
                          size="sm"
                          disabled={publishing === article.id}
                          onClick={() => handlePublish(article.id, ["x", "instagram"])}
                        >
                          {publishing === article.id ? "발행 중..." : "전체 공유"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="border shadow-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              발행된 콘텐츠가 없습니다. 먼저 글을 발행해주세요.
            </CardContent>
          </Card>
        )}
      </div>

      {/* SNS Post History */}
      <h2 className="mt-8 font-heading text-lg font-semibold">발행 이력</h2>
      <div className="mt-4 space-y-2">
        {snsPosts.length > 0 ? (
          snsPosts.map((post) => (
            <Card key={post.id} className="border shadow-sm">
              <CardContent className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {post.platform === "x" ? "𝕏" : "📷"}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${statusColors[post.status]}`}
                      >
                        {statusLabels[post.status]}
                      </Badge>
                      {post.post_url && (
                        <a
                          href={post.post_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          보기 ↗
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleString("ko-KR")}
                      {post.error_message && (
                        <span className="ml-2 text-red-500">
                          {post.error_message}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">아직 발행 이력이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
