import Link from "next/link";

import { Clock } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS } from "@/lib/constants";
import { ArticleCover } from "@/components/article-cover";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "매거진 | 놓다 익선동",
  description:
    "익선동과 종로3가의 맛집, 카페, 문화공간, 코스 추천. 놓다가 전하는 동네 이야기.",
};

const CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "restaurant", label: "맛집" },
  { key: "cafe", label: "카페" },
  { key: "culture", label: "문화" },
  { key: "course", label: "코스추천" },
  { key: "event", label: "행사" },
  { key: "story", label: "동네 이야기" },
] as const;

interface MagazinePageProps {
  searchParams: Promise<{ category?: string }>;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function MagazinePage({ searchParams }: MagazinePageProps) {
  const { category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("articles")
    .select("id, title, slug, category, excerpt, cover_image_url, published_at, view_count")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data: articles } = await query;

  const featured = articles?.[0];
  const rest = articles?.slice(1) ?? [];

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-border/60 px-4 pb-6 pt-10 md:pt-14">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Magazine
            </p>
            <h1 className="mt-2 font-heading text-3xl font-extrabold md:text-4xl">
              익선동 이야기
            </h1>
            <p className="mt-2 max-w-lg text-muted-foreground">
              맛집, 카페, 문화공간부터 숨은 골목 이야기까지. 익선동과 종로3가를 깊이 있게 전합니다.
            </p>

            {/* Category Filter */}
            <div className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = cat.key === (category ?? "all");
                return (
                  <Link
                    key={cat.key}
                    href={
                      cat.key === "all"
                        ? "/magazine"
                        : `/magazine?category=${cat.key}`
                    }
                    className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-10 md:py-14">
          <div className="mx-auto max-w-5xl">
            {/* Featured Article — Editorial Hero */}
            {featured && (
              <Link href={`/magazine/${featured.slug}`} className="group mb-12 block">
                <article className="relative overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-lg">
                  <ArticleCover
                    category={featured.category}
                    coverImageUrl={featured.cover_image_url}
                    size="lg"
                    overlay
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 md:p-10">
                    <Badge className="mb-3 w-fit border-none bg-white/20 text-white backdrop-blur-sm">
                      {CATEGORY_LABELS[featured.category] ?? featured.category}
                    </Badge>
                    <h2 className="font-heading text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
                      {featured.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
                      {featured.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-white/60">
                      {featured.published_at && (
                        <time>{formatDate(featured.published_at)}</time>
                      )}
                      {featured.view_count > 0 && (
                        <span>조회 {featured.view_count.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Article Grid — Editorial Cards */}
            {rest.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <Link key={article.id} href={`/magazine/${article.slug}`}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border/50 transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/20">
                      <ArticleCover
                        category={article.category}
                        coverImageUrl={article.cover_image_url}
                        size="md"
                      />
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-normal">
                            {CATEGORY_LABELS[article.category] ?? article.category}
                          </Badge>
                          {article.published_at && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(article.published_at)}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 font-heading text-base font-semibold leading-snug group-hover:text-primary">
                          {article.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {article.excerpt}
                        </p>
                        <p className="mt-4 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          자세히 읽기 →
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              !featured && (
                <div className="flex flex-col items-center py-24 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-lg font-medium text-foreground">아직 등록된 콘텐츠가 없습니다</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    곧 익선동의 새로운 이야기가 찾아옵니다
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
