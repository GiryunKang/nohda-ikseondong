import { FileText, CheckCircle, MapPin, Share2 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: articleCount, error: e1 },
    { count: placeCount, error: e2 },
    { count: publishedCount, error: e3 },
    { count: snsCount, error: e4 },
  ] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("places").select("*", { count: "exact", head: true }),
    supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("sns_posts").select("*", { count: "exact", head: true }),
  ]);

  [e1, e2, e3, e4].forEach((e, i) => { if (e) console.error(`Dashboard query ${i} failed:`, e); });

  const stats = [
    { label: "총 콘텐츠", value: articleCount ?? 0, Icon: FileText },
    { label: "발행됨", value: publishedCount ?? 0, Icon: CheckCircle },
    { label: "등록 장소", value: placeCount ?? 0, Icon: MapPin },
    { label: "SNS 공유", value: snsCount ?? 0, Icon: Share2 },
  ];

  const { data: recentArticles, error: recentError } = await supabase
    .from("articles")
    .select("id, title, status, category, created_at")
    .order("created_at", { ascending: false })
    .limit(5);
  if (recentError) console.error("Recent articles query failed:", recentError);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">대시보드</h1>
      <p className="mt-1 text-muted-foreground">놓다 익선동 콘텐츠 관리</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <stat.Icon className="h-6 w-6 text-primary" />
                <span className="font-heading text-2xl font-bold">
                  {stat.value}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold">최근 콘텐츠</h2>
        {recentArticles && recentArticles.length > 0 ? (
          <div className="mt-4 space-y-2">
            {recentArticles.map((article) => (
              <Card key={article.id} className="border shadow-sm">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{article.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {article.category} ·{" "}
                      {new Date(article.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      article.status === "published"
                        ? "bg-green-100 text-green-700"
                        : article.status === "review"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {article.status === "published"
                      ? "발행됨"
                      : article.status === "review"
                        ? "검토 대기"
                        : article.status === "draft"
                          ? "임시저장"
                          : "보관됨"}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mt-4 border shadow-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              아직 콘텐츠가 없습니다. AI 글쓰기로 첫 콘텐츠를 만들어보세요!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
