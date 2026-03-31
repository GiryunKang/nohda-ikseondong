import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS, CATEGORY_EMOJI } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
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
        <section className="bg-gradient-to-b from-accent to-background px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <h1 className="font-heading text-3xl font-extrabold md:text-4xl">
              매거진
            </h1>
            <p className="mt-2 text-muted-foreground">
              익선동과 종로3가의 이야기를 전합니다
            </p>

            {/* Category Filter */}
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
              {CATEGORIES.map((cat) => {
                const isActive =
                  cat.key === (category ?? "all");
                return (
                  <Link
                    key={cat.key}
                    href={
                      cat.key === "all"
                        ? "/magazine"
                        : `/magazine?category=${cat.key}`
                    }
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {cat.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-8 md:py-12">
          <div className="mx-auto max-w-5xl">
            {/* Featured Article */}
            {featured && (
              <Link href={`/magazine/${featured.slug}`}>
                <Card className="group mb-8 overflow-hidden border-none shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="p-0">
                    <div className="flex h-48 items-center justify-center bg-muted text-6xl md:h-64">
                      {CATEGORY_EMOJI[featured.category] ?? "📄"}
                    </div>
                    <div className="p-6">
                      <Badge variant="secondary">
                        {CATEGORY_LABELS[featured.category] ?? featured.category}
                      </Badge>
                      <h2 className="mt-2 font-heading text-xl font-bold group-hover:text-primary md:text-2xl">
                        {featured.title}
                      </h2>
                      <p className="mt-2 text-muted-foreground">
                        {featured.excerpt}
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground">
                        {featured.published_at &&
                          new Date(featured.published_at).toLocaleDateString(
                            "ko-KR",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}

            {/* Article Grid */}
            {rest.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <Link key={article.id} href={`/magazine/${article.slug}`}>
                    <Card className="group h-full border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                      <CardContent className="p-0">
                        <div className="flex h-40 items-center justify-center rounded-t-xl bg-muted text-5xl">
                          {CATEGORY_EMOJI[article.category] ?? "📄"}
                        </div>
                        <div className="p-4">
                          <Badge variant="outline" className="text-xs">
                            {CATEGORY_LABELS[article.category] ??
                              article.category}
                          </Badge>
                          <h3 className="mt-2 font-heading text-sm font-semibold leading-snug group-hover:text-primary">
                            {article.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {article.excerpt}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {article.published_at &&
                              new Date(
                                article.published_at
                              ).toLocaleDateString("ko-KR")}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              !featured && (
                <div className="py-20 text-center text-muted-foreground">
                  아직 등록된 콘텐츠가 없습니다.
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
