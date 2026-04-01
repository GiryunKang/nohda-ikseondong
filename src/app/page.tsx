import Link from "next/link";

import Image from "next/image";

import { ArrowRight, MapPin } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS } from "@/lib/constants";
import { getServerDictionary } from "@/lib/i18n/server";
import { ArticleCover } from "@/components/article-cover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const AREA_SPOTS = [
  { name: "익선동 한옥마을", emoji: "🏘️", desc: "1930년대 한옥 골목" },
  { name: "낙원상가", emoji: "🎵", desc: "악기와 LP의 성지" },
  { name: "종묘", emoji: "🏛️", desc: "유네스코 세계유산" },
  { name: "광장시장", emoji: "🍢", desc: "서울 대표 전통시장" },
] as const;

export default async function HomePage() {
  const { t } = await getServerDictionary();
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, slug, category, excerpt, cover_image_url, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(6);

  const featured = articles?.[0];
  const rest = articles?.slice(1, 5) ?? [];

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero — 익선동 중심 */}
        <section className="relative overflow-hidden bg-gradient-to-b from-accent to-background px-4 py-16 md:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <Badge variant="secondary" className="mb-4">
                  서울 종로 · 익선동
                </Badge>
                <h1 className="font-heading text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
                  익선동의 모든 것,
                  <br />
                  한 곳에서
                </h1>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
                  서울에서 가장 오래된 한옥마을, 익선동.
                  <br />
                  맛집, 카페, 문화공간, 숨은 이야기까지.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="text-base" render={<Link href="/magazine" />}>
                    익선동 가이드
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="text-base" render={<Link href="/about" />}>
                    놓다 보관함 안내
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {AREA_SPOTS.map((spot) => (
                  <Card key={spot.name} className="border-none shadow-sm">
                    <CardContent className="p-4 text-center">
                      <span className="text-3xl">{spot.emoji}</span>
                      <p className="mt-2 text-sm font-medium">{spot.name}</p>
                      <p className="text-xs text-muted-foreground">{spot.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {featured && (
          <section className="px-4 py-12 md:py-16">
            <div className="mx-auto max-w-5xl">
              <Link href={`/magazine/${featured.slug}`}>
                <Card className="group overflow-hidden border-none shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="grid p-0 md:grid-cols-2">
                    <ArticleCover
                      category={featured.category}
                      coverImageUrl={featured.cover_image_url}
                      size="lg"
                    />
                    <div className="flex flex-col justify-center p-6 md:p-8">
                      <Badge variant="secondary" className="mb-2 w-fit">
                        {CATEGORY_LABELS[featured.category] ?? featured.category}
                      </Badge>
                      <h2 className="font-heading text-xl font-bold group-hover:text-primary md:text-2xl">
                        {featured.title}
                      </h2>
                      <p className="mt-2 text-muted-foreground">
                        {featured.excerpt}
                      </p>
                      <p className="mt-4 text-sm font-medium text-primary">
                        읽어보기 →
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>
        )}

        {/* Magazine Grid */}
        <section className="bg-card px-4 py-12 md:py-16">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold md:text-3xl">
                  {t.magazine.weeklyPick}
                </h2>
                <p className="mt-1 text-muted-foreground">
                  {t.magazine.subtitle}
                </p>
              </div>
              <Link
                href="/magazine"
                className="hidden text-sm font-medium text-primary hover:underline sm:block"
              >
                {t.magazine.viewAll}
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {rest.map((article) => (
                <Link key={article.id} href={`/magazine/${article.slug}`}>
                  <Card className="group h-full cursor-pointer border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    <CardContent className="p-0">
                      <ArticleCover
                        category={article.category}
                        coverImageUrl={article.cover_image_url}
                        size="md"
                      />
                      <div className="p-4">
                        <Badge variant="outline" className="text-xs">
                          {CATEGORY_LABELS[article.category] ?? article.category}
                        </Badge>
                        <h3 className="mt-2 font-heading text-sm font-semibold leading-snug group-hover:text-primary">
                          {article.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {article.excerpt}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/magazine"
                className="text-sm font-medium text-primary hover:underline"
              >
                {t.magazine.viewAll}
              </Link>
            </div>
          </div>
        </section>

        {/* 놓다 — 자연스러운 소개 (광고가 아닌 동네 인프라 느낌) */}
        <section className="px-4 py-12 md:py-16">
          <div className="mx-auto max-w-5xl">
            <Card className="overflow-hidden border-none bg-gradient-to-r from-accent to-background shadow-sm">
              <CardContent className="grid items-center gap-6 p-6 md:grid-cols-5 md:p-8">
                <div className="flex flex-col items-center gap-3 md:col-span-2">
                  <Image
                    src="/logo-transparent-vertical.png"
                    alt="놓다 물품보관함"
                    width={120}
                    height={120}
                    className="h-24 w-auto"
                  />
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-card/80 px-2 py-2">
                      <span className="text-lg">🎒</span>
                      <p className="text-[10px] text-muted-foreground">{t.locker.small}</p>
                    </div>
                    <div className="rounded-lg bg-card/80 px-2 py-2">
                      <span className="text-lg">🧳</span>
                      <p className="text-[10px] text-muted-foreground">{t.locker.medium}</p>
                    </div>
                    <div className="rounded-lg bg-card/80 px-2 py-2">
                      <span className="text-lg">🛄</span>
                      <p className="text-[10px] text-muted-foreground">{t.locker.large}</p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>익선동 바로 맞은편 · 종로3가역 4번 출구 도보 1분</span>
                  </div>
                  <h3 className="mt-2 font-heading text-xl font-bold">
                    짐은 놓다에, 발걸음은 익선동에
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    캐리어 끌고 좁은 골목을 걸을 필요 없어요.
                    24시간 무인 보관함 약 220개, 카카오페이·네이버페이·삼성페이로 간편 결제.
                    맡기고 가볍게 익선동을 즐기세요.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Button size="sm" render={<a href="https://놓다.com" target="_blank" rel="noopener noreferrer" />}>
                      {t.locker.ctaUse}
                    </Button>
                    <Button variant="ghost" size="sm" render={<Link href="/about" />}>
                      {t.locker.ctaDetail} →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 동네 이야기 */}
        <section className="bg-card px-4 py-12 md:py-16">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="font-heading text-2xl font-bold">종로3가, 알고 보면</h2>
            <p className="mt-2 text-muted-foreground">
              익선동을 넘어 종로3가 일대의 매력을 발견해보세요
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Card className="border-none shadow-sm">
                <CardContent className="p-6 text-center">
                  <span className="text-4xl">🏘️</span>
                  <h3 className="mt-3 font-heading font-semibold">익선동 한옥마을</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    1930년대 한옥이 카페, 레스토랑, 소품샵으로.
                    서울에서 가장 작고 아름다운 한옥 골목.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-6 text-center">
                  <span className="text-4xl">🎵</span>
                  <h3 className="mt-3 font-heading font-semibold">낙원상가</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    악기 거리와 LP 레코드샵.
                    음악을 좋아한다면 놓칠 수 없는 공간.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-6 text-center">
                  <span className="text-4xl">🍢</span>
                  <h3 className="mt-3 font-heading font-semibold">광장시장</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    빈대떡, 마약김밥, 육회.
                    서울 최고의 먹거리 시장, 도보 10분.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
