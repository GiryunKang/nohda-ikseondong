import Link from "next/link";

import Image from "next/image";

import { ArrowRight, MapPin } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS } from "@/lib/constants";
import { getServerDictionary } from "@/lib/i18n/server";
import { ArticleCover } from "@/components/article-cover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
        {/* Hero — Editorial full-bleed */}
        <section className="relative min-h-[70vh] overflow-hidden bg-secondary">
          <div className="absolute inset-0">
            <Image
              src="/illustrations/course.svg"
              alt=""
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-secondary/30" />
          </div>

          <div className="relative mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-end px-5 pb-14 pt-20">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/80 backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5" />
              서울 종로 · 익선동
            </div>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-[1.1] text-white md:text-6xl lg:text-7xl">
              익선동의
              <br />
              모든 것
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
              서울에서 가장 오래된 한옥마을.
              맛집, 카페, 문화공간, 숨은 이야기까지.
            </p>
            <div className="mt-8 flex gap-3">
              <Button size="lg" className="bg-white text-secondary hover:bg-white/90" render={<Link href="/magazine" />}>
                가이드 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" render={<Link href="/about" />}>
                놓다 보관함
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Article — Asymmetric editorial */}
        {featured && (
          <section className="px-5 py-16 md:py-24">
            <div className="mx-auto max-w-5xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Featured
              </p>
              <h2 className="mt-1 font-heading text-2xl font-semibold md:text-3xl">
                오늘의 추천
              </h2>

              <Link href={`/magazine/${featured.slug}`} className="group mt-8 block">
                <div className="grid gap-0 overflow-hidden rounded-lg md:grid-cols-5">
                  {/* Large photo — 3 cols */}
                  <div className="relative md:col-span-3">
                    <ArticleCover
                      category={featured.category}
                      coverImageUrl={featured.cover_image_url}
                      size="lg"
                      overlay
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6 md:hidden">
                      <h3 className="font-heading text-xl font-bold text-white">
                        {featured.title}
                      </h3>
                    </div>
                  </div>
                  {/* Info card — 2 cols */}
                  <div className="flex flex-col justify-center bg-card p-6 md:col-span-2 md:p-8">
                    <Badge variant="outline" className="w-fit text-xs font-normal">
                      {CATEGORY_LABELS[featured.category] ?? featured.category}
                    </Badge>
                    <h3 className="mt-3 hidden font-heading text-xl font-semibold leading-tight group-hover:text-primary md:block md:text-2xl">
                      {featured.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {featured.excerpt}
                    </p>
                    <p className="mt-4 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      자세히 읽기 →
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Magazine Grid — Asymmetric editorial */}
        {rest.length > 0 && (
          <section className="bg-card px-5 py-16 md:py-24">
            <div className="mx-auto max-w-5xl">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                    Weekly
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-semibold md:text-3xl">
                    {t.magazine.weeklyPick}
                  </h2>
                </div>
                <Link
                  href="/magazine"
                  className="hidden text-sm font-medium text-primary hover:underline sm:block"
                >
                  {t.magazine.viewAll} →
                </Link>
              </div>

              {/* Asymmetric grid: tall left + 2 small right stacked */}
              <div className="mt-10 grid gap-5 md:grid-cols-5 md:grid-rows-2">
                {rest[0] && (
                  <Link
                    href={`/magazine/${rest[0].slug}`}
                    className="group md:col-span-3 md:row-span-2"
                  >
                    <article className="relative h-full overflow-hidden rounded-lg">
                      <ArticleCover
                        category={rest[0].category}
                        coverImageUrl={rest[0].cover_image_url}
                        size="lg"
                        overlay
                      />
                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
                        <Badge className="mb-2 w-fit border-none bg-white/15 text-white backdrop-blur-sm">
                          {CATEGORY_LABELS[rest[0].category] ?? rest[0].category}
                        </Badge>
                        <h3 className="font-heading text-lg font-semibold text-white md:text-2xl">
                          {rest[0].title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-white/70">
                          {rest[0].excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                )}

                {rest.slice(1, 3).map((article) => (
                  <Link
                    key={article.id}
                    href={`/magazine/${article.slug}`}
                    className="group md:col-span-2"
                  >
                    <article className="flex h-full gap-4 overflow-hidden rounded-lg bg-background p-4 ring-1 ring-border/40 transition-all hover:ring-primary/20">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md">
                        <ArticleCover
                          category={article.category}
                          coverImageUrl={article.cover_image_url}
                          size="sm"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Badge variant="outline" className="w-fit text-[10px] font-normal">
                          {CATEGORY_LABELS[article.category] ?? article.category}
                        </Badge>
                        <h3 className="mt-1.5 font-heading text-sm font-medium leading-snug group-hover:text-primary">
                          {article.title}
                        </h3>
                      </div>
                    </article>
                  </Link>
                ))}

                {rest[3] && (
                  <Link
                    href={`/magazine/${rest[3].slug}`}
                    className="group md:col-span-5"
                  >
                    <article className="grid overflow-hidden rounded-lg bg-background ring-1 ring-border/40 transition-all hover:ring-primary/20 md:grid-cols-3">
                      <div className="md:col-span-1">
                        <ArticleCover
                          category={rest[3].category}
                          coverImageUrl={rest[3].cover_image_url}
                          size="md"
                        />
                      </div>
                      <div className="flex flex-col justify-center p-5 md:col-span-2">
                        <Badge variant="outline" className="w-fit text-xs font-normal">
                          {CATEGORY_LABELS[rest[3].category] ?? rest[3].category}
                        </Badge>
                        <h3 className="mt-2 font-heading text-base font-medium group-hover:text-primary md:text-lg">
                          {rest[3].title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {rest[3].excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                )}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Link
                  href="/magazine"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {t.magazine.viewAll} →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 놓다 — Editorial promo */}
        <section className="px-5 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="grid overflow-hidden rounded-lg bg-accent md:grid-cols-2">
              <div className="flex flex-col items-center justify-center gap-5 p-8 md:p-12">
                <Image
                  src="/logo-transparent-vertical.png"
                  alt="놓다 물품보관함"
                  width={120}
                  height={120}
                  className="h-20 w-auto"
                />
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: t.locker.small, icon: "/illustrations/locker.svg" },
                    { label: t.locker.medium, icon: "/illustrations/locker.svg" },
                    { label: t.locker.large, icon: "/illustrations/locker.svg" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-md bg-card px-3 py-2 shadow-sm">
                      <Image src={item.icon} alt="" width={28} height={28} className="mx-auto h-7 w-7" />
                      <p className="mt-1 text-[10px] font-medium text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <div className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-primary">
                  <MapPin className="h-3 w-3" />
                  종로3가역 4번 출구 도보 1분
                </div>
                <h3 className="mt-3 font-heading text-xl font-semibold md:text-2xl">
                  짐은 놓다에,
                  <br />
                  발걸음은 익선동에
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  캐리어 끌고 좁은 골목을 걸을 필요 없어요.
                  24시간 무인 보관함 약 220개, 카카오페이·네이버페이·삼성페이로 간편 결제.
                </p>
                <div className="mt-5 flex gap-3">
                  <Button size="sm" render={<a href="https://놓다.com" target="_blank" rel="noopener noreferrer" />}>
                    {t.locker.ctaUse}
                  </Button>
                  <Button variant="ghost" size="sm" render={<Link href="/about" />}>
                    {t.locker.ctaDetail} →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 동네 이야기 — Illustration cards */}
        <section className="bg-card px-5 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Neighborhood
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold md:text-3xl">
                종로3가, 알고 보면
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                익선동을 넘어 종로3가 일대의 매력을 발견해보세요
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                {
                  illustration: "/illustrations/restaurant.svg",
                  title: "익선동 한옥마을",
                  desc: "1930년대 한옥이 카페, 레스토랑, 소품샵으로. 서울에서 가장 작고 아름다운 한옥 골목.",
                },
                {
                  illustration: "/illustrations/culture.svg",
                  title: "낙원상가",
                  desc: "악기 거리와 LP 레코드샵. 음악을 좋아한다면 놓칠 수 없는 공간.",
                },
                {
                  illustration: "/illustrations/event.svg",
                  title: "광장시장",
                  desc: "빈대떡, 마약김밥, 육회. 서울 최고의 먹거리 시장, 도보 10분.",
                },
              ].map((spot) => (
                <div
                  key={spot.title}
                  className="group overflow-hidden rounded-lg bg-background ring-1 ring-border/40 transition-all hover:ring-primary/20"
                >
                  <div className="h-40 overflow-hidden">
                    <Image
                      src={spot.illustration}
                      alt={spot.title}
                      width={400}
                      height={200}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-base font-semibold">{spot.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {spot.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
