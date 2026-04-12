import Link from "next/link";
import Image from "next/image";

import { createClient } from "@/lib/supabase/server";
import { getServerDictionary } from "@/lib/i18n/server";
import { CATEGORY_LABELS, DATE_LOCALE_MAP } from "@/lib/constants";
import { ArticleCover } from "@/components/article-cover";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "매거진",
  description:
    "익선동과 종로3가의 맛집, 카페, 문화공간, 코스 추천. 놓다가 전하는 동네 이야기.",
};

const CATEGORY_KEYS = ["all", "restaurant", "cafe", "culture", "course", "event", "story"] as const;

interface MagazinePageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

const PAGE_SIZE = 10;

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function MagazinePage({ searchParams }: MagazinePageProps) {
  const { category, page: pageParam } = await searchParams;
  const pageNum = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const offset = (pageNum - 1) * PAGE_SIZE;
  const supabase = await createClient();
  const { locale, t } = await getServerDictionary();
  const dateLocale = DATE_LOCALE_MAP[locale] ?? "ko-KR";

  const categoryLabels: Record<string, string> = {
    all: t.magazine.all,
    restaurant: t.categories.restaurant,
    cafe: t.categories.cafe,
    culture: t.categories.culture,
    course: t.categories.course,
    event: t.categories.event,
    story: t.categories.story,
  };

  let query = supabase
    .from("articles")
    .select("id, title, slug, category, excerpt, cover_image_url, published_at, view_count", {
      count: "exact",
    })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data: articles, error: articlesError, count } = await query;
  if (articlesError) console.error("Magazine articles query failed:", articlesError);

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;
  const isFirstPage = pageNum === 1;
  const featured = isFirstPage ? articles?.[0] : undefined;
  const rest = isFirstPage ? (articles?.slice(1) ?? []) : (articles ?? []);

  return (
    <>
      <Header />

      <main id="main-content" className="flex-1">
        {/* Page Header */}
        <section className="px-5 pb-6 pt-12 md:pt-16">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Magazine
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold md:text-4xl">
              {t.magazine.title}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              {t.magazine.subtitle}
            </p>

            {/* Category Filter */}
            <div className="mt-8 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORY_KEYS.map((key) => {
                const isActive = key === (category ?? "all");
                return (
                  <Link
                    key={key}
                    href={
                      key === "all"
                        ? "/magazine"
                        : `/magazine?category=${key}`
                    }
                    className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-all ${
                      isActive
                        ? "bg-primary font-medium text-primary-foreground"
                        : "bg-accent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {categoryLabels[key] ?? key}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-5 py-10 md:py-14">
          <div className="mx-auto max-w-5xl">
            {/* Featured Article — Magazine cover style */}
            {featured && (
              <Link href={`/magazine/${featured.slug}`} className="group mb-14 block">
                <article className="relative overflow-hidden rounded-lg">
                  <ArticleCover
                    category={featured.category}
                    coverImageUrl={featured.cover_image_url}
                    size="lg"
                    overlay
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                    <Badge className="mb-3 w-fit border-none bg-white/15 text-white backdrop-blur-sm">
                      {CATEGORY_LABELS[featured.category] ?? featured.category}
                    </Badge>
                    <h2 className="font-heading text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
                      {featured.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-white/75 md:text-base">
                      {featured.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-white/50">
                      {featured.published_at && (
                        <time>{formatDate(featured.published_at, dateLocale)}</time>
                      )}
                      {featured.view_count > 0 && (
                        <span>조회 {featured.view_count.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Article Grid — Asymmetric editorial */}
            {rest.length > 0 ? (
              <div className="space-y-6">
                {/* Row: large + small */}
                {rest.length >= 2 && (
                  <div className="grid gap-5 md:grid-cols-5">
                    <Link
                      href={`/magazine/${rest[0].slug}`}
                      className="group md:col-span-3"
                    >
                      <article className="relative h-full overflow-hidden rounded-lg">
                        <ArticleCover
                          category={rest[0].category}
                          coverImageUrl={rest[0].cover_image_url}
                          size="md"
                          overlay
                        />
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-5">
                          <Badge className="mb-2 w-fit border-none bg-white/15 text-white backdrop-blur-sm text-xs">
                            {CATEGORY_LABELS[rest[0].category] ?? rest[0].category}
                          </Badge>
                          <h3 className="font-heading text-lg font-semibold text-white">
                            {rest[0].title}
                          </h3>
                        </div>
                      </article>
                    </Link>
                    <Link
                      href={`/magazine/${rest[1].slug}`}
                      className="group md:col-span-2"
                    >
                      <article className="flex h-full flex-col overflow-hidden rounded-lg bg-card ring-1 ring-border/40 transition-all hover:ring-primary/20">
                        <ArticleCover
                          category={rest[1].category}
                          coverImageUrl={rest[1].cover_image_url}
                          size="sm"
                        />
                        <div className="flex flex-1 flex-col justify-center p-5">
                          <Badge variant="outline" className="w-fit text-xs font-normal">
                            {CATEGORY_LABELS[rest[1].category] ?? rest[1].category}
                          </Badge>
                          <h3 className="mt-2 font-heading text-base font-medium leading-snug group-hover:text-primary">
                            {rest[1].title}
                          </h3>
                          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                            {rest[1].excerpt}
                          </p>
                        </div>
                      </article>
                    </Link>
                  </div>
                )}

                {/* Remaining cards — horizontal */}
                {rest.slice(2).map((article) => (
                  <Link key={article.id} href={`/magazine/${article.slug}`} className="group">
                    <article className="grid overflow-hidden rounded-lg bg-card ring-1 ring-border/40 transition-all hover:ring-primary/20 md:grid-cols-3">
                      <div className="md:col-span-1">
                        <ArticleCover
                          category={article.category}
                          coverImageUrl={article.cover_image_url}
                          size="md"
                        />
                      </div>
                      <div className="flex flex-col justify-center p-5 md:col-span-2 md:p-6">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs font-normal">
                            {CATEGORY_LABELS[article.category] ?? article.category}
                          </Badge>
                          {article.published_at && (
                            <span className="text-xs text-muted-foreground">
                              {formatDate(article.published_at, dateLocale)}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 font-heading text-base font-medium group-hover:text-primary md:text-lg">
                          {article.title}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                          {article.excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              !featured && (
                <div className="flex flex-col items-center py-24 text-center">
                  <Image
                    src="/illustrations/story.svg"
                    alt=""
                    width={200}
                    height={150}
                    className="opacity-60"
                  />
                  <p className="mt-6 font-heading text-lg font-medium">
                    {t.magazine.noContent}
                  </p>
                </div>
              )
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="mt-12 flex items-center justify-center gap-2"
                aria-label="페이지 네비게이션"
              >
                {pageNum > 1 && (
                  <Link
                    href={{
                      pathname: "/magazine",
                      query: {
                        ...(category && category !== "all" ? { category } : {}),
                        ...(pageNum > 2 ? { page: String(pageNum - 1) } : {}),
                      },
                    }}
                    className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:border-primary hover:text-primary"
                    rel="prev"
                  >
                    ← 이전
                  </Link>
                )}
                <span className="px-3 text-sm text-muted-foreground">
                  {pageNum} / {totalPages}
                </span>
                {pageNum < totalPages && (
                  <Link
                    href={{
                      pathname: "/magazine",
                      query: {
                        ...(category && category !== "all" ? { category } : {}),
                        page: String(pageNum + 1),
                      },
                    }}
                    className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:border-primary hover:text-primary"
                    rel="next"
                  >
                    다음 →
                  </Link>
                )}
              </nav>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
