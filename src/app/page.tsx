import Link from "next/link";

import Image from "next/image";

import { MapPin, Clock, Coins, ArrowRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS } from "@/lib/constants";
import { getServerDictionary } from "@/lib/i18n/server";
import { ArticleCover } from "@/components/article-cover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default async function HomePage() {
  const { t } = await getServerDictionary();
  const supabase = await createClient();

  const FEATURES = [
    { icon: MapPin, title: t.features.location, description: t.features.locationDesc },
    { icon: Clock, title: t.features.hours, description: t.features.hoursDesc },
    { icon: Coins, title: t.features.price, description: t.features.priceDesc },
  ];

  const STEPS = [
    { number: "01", title: t.steps.step1, description: t.steps.step1Desc },
    { number: "02", title: t.steps.step2, description: t.steps.step2Desc },
    { number: "03", title: t.steps.step3, description: t.steps.step3Desc },
  ];
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
            <Image
              src="/logo-transparent-vertical.png"
              alt="놓다 물품보관함"
              width={180}
              height={180}
              className="mx-auto h-32 w-auto md:h-44"
              priority
            />
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              {t.hero.title1}
              <br />
              <span className="text-primary">{t.hero.title2}</span> {t.hero.title3}
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
              {t.hero.subtitle}
              <br />
              {t.hero.subtitle2}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="text-base" render={<a href="https://놓다.com" target="_blank" rel="noopener noreferrer" />}>
                {t.hero.ctaLocker}
              </Button>
              <Button variant="outline" size="lg" className="text-base" render={<Link href="/magazine" />}>
                {t.hero.ctaGuide}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-heading text-2xl font-bold md:text-3xl">
              {t.features.title.replace("{brand}", "")}
              <span className="text-primary">놓다</span>
              {t.features.title.includes("?") ? "?" : ""}
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

        {/* Locker Highlight */}
        <section className="bg-primary/5 px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <Badge className="mb-3">{t.locker.badge}</Badge>
                <h2 className="font-heading text-2xl font-bold leading-tight md:text-3xl">
                  {t.locker.title1}
                  <br />
                  <span className="text-primary">{t.locker.title2}</span>
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {t.locker.description}
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {[t.locker.check1, t.locker.check2, t.locker.check3, t.locker.check4].map((check) => (
                    <li key={check} className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">✓</span>
                      {check}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex gap-3">
                  <Button size="lg" render={<a href="https://놓다.com" target="_blank" rel="noopener noreferrer" />}>
                    {t.locker.ctaUse}
                  </Button>
                  <Button variant="outline" size="lg" render={<Link href="/about" />}>
                    {t.locker.ctaDetail}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 shadow-sm">
                <Image
                  src="/logo-transparent-vertical.png"
                  alt="놓다"
                  width={140}
                  height={140}
                  className="h-28 w-auto"
                />
                <div className="grid w-full grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-accent p-4">
                    <span className="text-2xl">🎒</span>
                    <p className="mt-1 text-xs font-medium">{t.locker.small}</p>
                    <p className="text-xs text-muted-foreground">{t.locker.smallDesc}</p>
                  </div>
                  <div className="rounded-xl bg-accent p-4">
                    <span className="text-2xl">🧳</span>
                    <p className="mt-1 text-xs font-medium">{t.locker.medium}</p>
                    <p className="text-xs text-muted-foreground">{t.locker.mediumDesc}</p>
                  </div>
                  <div className="rounded-xl bg-accent p-4">
                    <span className="text-2xl">🛄</span>
                    <p className="mt-1 text-xs font-medium">{t.locker.large}</p>
                    <p className="text-xs text-muted-foreground">{t.locker.largeDesc}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t.locker.checkAvail}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Magazine Preview */}
        <section className="bg-card px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-end justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {t.nav.magazine}
                </Badge>
                <h2 className="font-heading text-2xl font-bold md:text-3xl">
                  {t.magazine.weeklyPick}
                </h2>
              </div>
              <Link
                href="/magazine"
                className="hidden text-sm font-medium text-primary hover:underline sm:block"
              >
                {t.magazine.viewAll}
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
                {t.magazine.viewAll}
              </Link>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-heading text-2xl font-bold md:text-3xl">
              {t.steps.title}
            </h2>
            <p className="mt-2 text-center text-muted-foreground">
              {t.steps.subtitle}
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
                {t.steps.cta}
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <Card className="border-none bg-primary">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center md:p-12">
                <Image
                  src="/logo-icon.png"
                  alt="놓다"
                  width={64}
                  height={64}
                  className="h-16 w-auto brightness-0 invert"
                />
                <h2 className="font-heading text-2xl font-bold text-primary-foreground md:text-3xl">
                  {t.cta.title}
                </h2>
                <p className="max-w-md text-primary-foreground/90">
                  {t.cta.description}
                  <br />
                  {t.cta.location}
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-2"
                  render={<a href="https://놓다.com" target="_blank" rel="noopener noreferrer" />}
                >
                  {t.cta.button}
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
