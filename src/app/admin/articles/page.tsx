import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ArticleActions } from "./article-actions";

export default async function AdminArticlesPage() {
  const supabase = await createClient();

  const { data: articles, error: articlesError } = await supabase
    .from("articles")
    .select("id, title, slug, category, status, is_ai_generated, view_count, published_at, created_at")
    .order("created_at", { ascending: false });
  if (articlesError) console.error("Admin articles query failed:", articlesError);

  const statusLabels: Record<string, string> = {
    draft: "임시저장",
    review: "검토 대기",
    published: "발행됨",
    archived: "보관됨",
  };

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    review: "bg-yellow-100 text-yellow-700",
    published: "bg-green-100 text-green-700",
    archived: "bg-red-100 text-red-600",
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">콘텐츠 관리</h1>
          <p className="mt-1 text-muted-foreground">
            총 {articles?.length ?? 0}개의 콘텐츠
          </p>
        </div>
        <Link
          href="/admin/ai-writer"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          ✨ 새 글 쓰기
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {articles && articles.length > 0 ? (
          articles.map((article) => (
            <Card key={article.id} className="border shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {CATEGORY_LABELS[article.category] ?? article.category}
                    </Badge>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[article.status]}`}
                    >
                      {statusLabels[article.status]}
                    </span>
                    {article.is_ai_generated && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        ✨ AI
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 truncate font-medium">
                    {article.title}
                  </h3>
                  <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                    <span>
                      {new Date(article.created_at).toLocaleDateString("ko-KR")}
                    </span>
                    <span>조회 {article.view_count}</span>
                    {article.status === "published" && article.slug && (
                      <Link
                        href={`/magazine/${article.slug}`}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        보기 ↗
                      </Link>
                    )}
                  </div>
                </div>

                <ArticleActions
                  articleId={article.id}
                  currentStatus={article.status}
                />
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border shadow-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              아직 콘텐츠가 없습니다.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
