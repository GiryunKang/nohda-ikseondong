import { notFound } from "next/navigation";
import Link from "next/link";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Share2 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) return { title: "글을 찾을 수 없습니다" };

  return {
    title: `${article.title} | 놓다 익선동`,
    description: article.excerpt ?? "",
    openGraph: {
      title: article.title,
      description: article.excerpt ?? "",
      type: "article",
      locale: "ko_KR",
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) notFound();

  // Increment view count (fire-and-forget)
  supabase
    .from("articles")
    .update({ view_count: (article.view_count ?? 0) + 1 })
    .eq("id", article.id)
    .then();

  // Related articles
  const { data: related } = await supabase
    .from("articles")
    .select("id, title, slug, category, excerpt, published_at")
    .eq("status", "published")
    .eq("category", article.category)
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(3);

  const readTime = Math.max(1, Math.ceil(article.content.length / 500));

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Article Header */}
        <section className="bg-gradient-to-b from-accent to-background px-4 py-8 md:py-12">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/magazine"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              매거진으로 돌아가기
            </Link>

            <div className="mt-4">
              <Badge variant="secondary">
                {CATEGORY_LABELS[article.category] ?? article.category}
              </Badge>
              <h1 className="mt-3 font-heading text-2xl font-extrabold leading-tight md:text-4xl">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="mt-3 text-lg text-muted-foreground">
                  {article.excerpt}
                </p>
              )}
              <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                <span>
                  {article.published_at &&
                    new Date(article.published_at).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </span>
                <span>·</span>
                <span>{readTime}분 읽기</span>
                <span>·</span>
                <span>조회 {article.view_count ?? 0}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="px-4 py-8 md:py-12">
          <div className="mx-auto max-w-3xl">
            <article className="prose prose-neutral max-w-none prose-headings:font-heading prose-headings:font-bold prose-h2:mt-8 prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-a:text-primary prose-blockquote:border-l-primary prose-blockquote:bg-accent prose-blockquote:px-4 prose-blockquote:py-3 prose-blockquote:not-italic prose-strong:text-foreground prose-li:marker:text-primary">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            </article>

            {/* Tags */}
            {article.sns_hashtags && article.sns_hashtags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.sns_hashtags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* CTA */}
            <Card className="mt-8 border-none bg-primary">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center md:p-8">
                <span className="text-3xl">🐶</span>
                <p className="font-heading text-lg font-bold text-primary-foreground">
                  짐이 많다면? 놓다 보관함에 맡기세요!
                </p>
                <p className="text-sm text-primary-foreground/90">
                  익선동 바로 맞은편, 종로3가역 4번 출구 도보 2분
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  render={
                    <a
                      href="https://놓다.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  보관함 이용하기
                </Button>
              </CardContent>
            </Card>

            {/* Share */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">공유하기</span>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {related && related.length > 0 && (
          <section className="bg-card px-4 py-12">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-heading text-lg font-bold">
                이런 글도 있어요
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.id} href={`/magazine/${r.slug}`}>
                    <Card className="group h-full border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                      <CardContent className="p-4">
                        <Badge variant="outline" className="text-xs">
                          {CATEGORY_LABELS[r.category] ?? r.category}
                        </Badge>
                        <h3 className="mt-2 font-heading text-sm font-semibold leading-snug group-hover:text-primary">
                          {r.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {r.excerpt}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
