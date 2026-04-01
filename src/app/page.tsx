import Link from "next/link";

import Image from "next/image";

import { ArrowRight, MapPin, Clock, ChevronRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS } from "@/lib/constants";
import { getServerDictionary } from "@/lib/i18n/server";
import { ArticleCover } from "@/components/article-cover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const AREA_SPOTS = [
  {
    name: "익선동 한옥마을",
    desc: "1930년대 한옥 골목",
    gradient: "from-amber-500 to-orange-600",
    icon: "🏘️",
  },
  {
    name: "낙원상가",
    desc: "악기와 LP의 성지",
    gradient: "from-violet-500 to-purple-600",
    icon: "🎵",
  },
  {
    name: "종묘",
    desc: "유네스코 세계유산",
    gradient: "from-emerald-500 to-teal-600",
    icon: "🏛️",
  },
  {
    name: "광장시장",
    desc: "서울 대표 전통시장",
    gradient: "from-rose-500 to-pink-600",
    icon: "🍢",
  },
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
        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-20 md:py-32">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-accent via-accent/50 to-background" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E8834A' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zm0-40c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zM10 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zm0-40c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }} />

          <div className="relative mx-auto max-w-5xl">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                  <MapPin className="h-3.5 w-3.5" />
                  서울 종로 · 익선동
                </div>
                <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.15] text-foreground md:text-5xl lg:text-6xl">
                  익선동의
                  <br />
                  <span className="text-primary">모든 것</span>
                </h1>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
                  서울에서 가장 오래된 한옥마을.
                  <br />
                  맛집, 카페, 문화공간, 숨은 이야기까지.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="text-base" render={<Link href="/magazine" />}>
                    가이드 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="text-base" render={<Link href="/about" />}>
                    놓다 보관함 안내
                  </Button>
                </div>
              </div>

              {/* Area Spots Grid */}
              <div className="grid grid-cols-2 gap-3">
                {AREA_SPOTS.map((spot) => (
                  <div
                    key={spot.name}
                    className="group relative overflow-hidden rounded-xl bg-card p-5 shadow-sm ring-1 ring-border/50 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className={`absolute -right-3 -top-3 h-16 w-16 rounded-full bg-gradient-to-br ${spot.gradient} opacity-10 transition-opacity group-hover:opacity-20`} />
                    <span className="text-2xl">{spot.icon}</span>
                    <p className="mt-2 text-sm font-semibold">{spot.name}</p>
                    <p className="text-xs text-muted-foreground">{spot.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Article — Editorial */}
        {featured && (
          <section className="px-4 py-14 md:py-20">
            <div className="mx-auto max-w-5xl">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-widest text-primary">
                    Featured
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-bold md:text-3xl">
                    오늘의 추천
                  </h2>
                </div>
              </div>
              <Link href={`/magazine/${featured.slug}`} className="group mt-6 block">
                <article className="relative overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-lg">
                  <ArticleCover
                    category={featured.category}
                    coverImageUrl={featured.cover_image_url}
                    size="lg"
                    overlay
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/25 to-transparent p-6 md:p-10">
                    <Badge className="mb-3 w-fit border-none bg-white/20 text-white backdrop-blur-sm">
                      {CATEGORY_LABELS[featured.category] ?? featured.category}
                    </Badge>
                    <h3 className="font-heading text-xl font-bold text-white md:text-3xl">
                      {featured.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 max-w-xl text-sm text-white/80">
                      {featured.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            </div>
          </section>
        )}

        {/* Magazine Grid */}
        {rest.length > 0 && (
          <section className="bg-card px-4 py-14 md:py-20">
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
                  className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
                >
                  {t.magazine.viewAll}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {rest.map((article) => (
                  <Link key={article.id} href={`/magazine/${article.slug}`}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-background shadow-sm ring-1 ring-border/50 transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/20">
                      <ArticleCover
                        category={article.category}
                        coverImageUrl={article.cover_image_url}
                        size="sm"
                      />
                      <div className="flex flex-1 flex-col p-4">
                        <Badge variant="outline" className="w-fit text-xs font-normal">
                          {CATEGORY_LABELS[article.category] ?? article.category}
                        </Badge>
                        <h3 className="mt-2 flex-1 font-heading text-sm font-semibold leading-snug group-hover:text-primary">
                          {article.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {article.excerpt}
                        </p>
                      </div>
                    </article>
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
        )}

        {/* 놓다 Promo — 동네 인프라 느낌 */}
        <section className="px-4 py-14 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-accent to-background ring-1 ring-border/50">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/5" />
              <div className="relative grid items-center gap-6 p-6 md:grid-cols-5 md:p-10">
                <div className="flex flex-col items-center gap-4 md:col-span-2">
                  <Image
                    src="/logo-transparent-vertical.png"
                    alt="놓다 물품보관함"
                    width={120}
                    height={120}
                    className="h-24 w-auto"
                  />
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-card px-3 py-2 shadow-sm">
                      <span className="text-lg">🎒</span>
                      <p className="text-[10px] font-medium text-muted-foreground">{t.locker.small}</p>
                    </div>
                    <div className="rounded-lg bg-card px-3 py-2 shadow-sm">
                      <span className="text-lg">🧳</span>
                      <p className="text-[10px] font-medium text-muted-foreground">{t.locker.medium}</p>
                    </div>
                    <div className="rounded-lg bg-card px-3 py-2 shadow-sm">
                      <span className="text-lg">🛄</span>
                      <p className="text-[10px] font-medium text-muted-foreground">{t.locker.large}</p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <MapPin className="h-3 w-3" />
                    종로3가역 4번 출구 도보 1분
                  </div>
                  <h3 className="mt-3 font-heading text-xl font-bold md:text-2xl">
                    짐은 놓다에, 발걸음은 익선동에
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    캐리어 끌고 좁은 골목을 걸을 필요 없어요.
                    24시간 무인 보관함 약 220개, 카카오페이·네이버페이·삼성페이로 간편 결제.
                    맡기고 가볍게 익선동을 즐기세요.
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
          </div>
        </section>

        {/* 동네 이야기 */}
        <section className="bg-card px-4 py-14 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Neighborhood
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold md:text-3xl">
                종로3가, 알고 보면
              </h2>
              <p className="mt-2 text-muted-foreground">
                익선동을 넘어 종로3가 일대의 매력을 발견해보세요
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {[
                {
                  icon: "🏘️",
                  title: "익선동 한옥마을",
                  desc: "1930년대 한옥이 카페, 레스토랑, 소품샵으로. 서울에서 가장 작고 아름다운 한옥 골목.",
                  gradient: "from-amber-500 to-orange-600",
                },
                {
                  icon: "🎵",
                  title: "낙원상가",
                  desc: "악기 거리와 LP 레코드샵. 음악을 좋아한다면 놓칠 수 없는 공간.",
                  gradient: "from-violet-500 to-purple-600",
                },
                {
                  icon: "🍢",
                  title: "광장시장",
                  desc: "빈대떡, 마약김밥, 육회. 서울 최고의 먹거리 시장, 도보 10분.",
                  gradient: "from-rose-500 to-pink-600",
                },
              ].map((spot) => (
                <div
                  key={spot.title}
                  className="group relative overflow-hidden rounded-xl bg-background p-6 shadow-sm ring-1 ring-border/50 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${spot.gradient} opacity-10 transition-opacity group-hover:opacity-20`} />
                  <span className="text-3xl">{spot.icon}</span>
                  <h3 className="mt-3 font-heading text-base font-semibold">{spot.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {spot.desc}
                  </p>
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
