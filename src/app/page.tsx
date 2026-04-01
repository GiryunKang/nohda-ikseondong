import Link from "next/link";

import { MapPin, Clock, Coins, ArrowRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS } from "@/lib/constants";
import { ArticleCover } from "@/components/article-cover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const FEATURES = [
  {
    icon: MapPin,
    title: "익선동 바로 맞은편",
    description: "종로3가역 4번 출구에서 도보 2분",
  },
  {
    icon: Clock,
    title: "24시간 무인 보관",
    description: "언제든 맡기고 언제든 찾아가세요",
  },
  {
    icon: Coins,
    title: "합리적 가격",
    description: "소형부터 대형까지 다양한 사이즈",
  },
] as const;

const STEPS = [
  { number: "01", title: "보관함 선택", description: "사이즈에 맞는 보관함을 골라주세요" },
  { number: "02", title: "짐 넣기", description: "문이 열리면 짐을 안전하게 넣어주세요" },
  { number: "03", title: "가볍게 출발!", description: "익선동을 자유롭게 즐기세요" },
] as const;

export default async function HomePage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, slug, category, excerpt, cover_image_url, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(4);
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-accent to-background px-4 py-20 md:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <span className="text-6xl md:text-8xl">🐶</span>
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              익선동,
              <br />
              <span className="text-primary">가볍게</span> 즐기세요
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
              짐은 놓다에 맡기고, 익선동을 자유롭게.
              <br />
              맛집, 카페, 문화공간 추천까지 한 곳에서.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="text-base" render={<a href="https://놓다.com" target="_blank" rel="noopener noreferrer" />}>
                보관함 이용하기
              </Button>
              <Button variant="outline" size="lg" className="text-base" render={<Link href="/magazine" />}>
                익선동 가이드 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-heading text-2xl font-bold md:text-3xl">
              왜 <span className="text-primary">놓다</span>일까요?
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {FEATURES.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-none bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Magazine Preview */}
        <section className="bg-card px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-end justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">
                  매거진
                </Badge>
                <h2 className="font-heading text-2xl font-bold md:text-3xl">
                  이번 주 익선동 픽
                </h2>
              </div>
              <Link
                href="/magazine"
                className="hidden text-sm font-medium text-primary hover:underline sm:block"
              >
                전체보기 →
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(articles ?? []).map((article) => (
                <Link key={article.id} href={`/magazine/${article.slug}`}>
                  <Card className="group cursor-pointer border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
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
                전체보기 →
              </Link>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-heading text-2xl font-bold md:text-3xl">
              이용 방법
            </h2>
            <p className="mt-2 text-center text-muted-foreground">
              3단계로 간단하게
            </p>

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <div key={step.number} className="relative text-center">
                  {index < STEPS.length - 1 && (
                    <div className="absolute right-0 top-8 hidden h-px w-full translate-x-1/2 bg-border md:block" />
                  )}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
                    {step.number}
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" render={<a href="https://놓다.com" target="_blank" rel="noopener noreferrer" />}>
                지금 보관함 이용하기
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <Card className="border-none bg-primary">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center md:p-12">
                <span className="text-4xl">🐶</span>
                <h2 className="font-heading text-2xl font-bold text-primary-foreground md:text-3xl">
                  짐이 많으신가요?
                </h2>
                <p className="max-w-md text-primary-foreground/90">
                  놓다 보관함에 맡기고 가볍게 익선동을 즐기세요.
                  <br />
                  익선동 바로 맞은편, 종로3가역 4번 출구 도보 2분.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-2"
                  render={<a href="https://놓다.com" target="_blank" rel="noopener noreferrer" />}
                >
                  보관함 이용하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
