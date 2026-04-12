import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/server";
import {
  CATEGORY_LABELS,
  SITE_URL,
  NOHDA_URL,
  OG_LOCALE_MAP,
  DATE_LOCALE_MAP,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArticleCover } from "@/components/article-cover";
import { ShareButton } from "@/components/share-button";

import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article, error: metaError } = await supabase
    .from("articles")
    .select("title, excerpt, cover_image_url, published_at, updated_at, category, sns_hashtags")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (metaError) console.error("Metadata article query failed:", metaError);

  if (!article) {
    return {
      title: "글을 찾을 수 없습니다 | 놓다 익선동",
      robots: { index: false, follow: false },
    };
  }

  const locale = await getLocale();
  const ogLocale = OG_LOCALE_MAP[locale] ?? "ko_KR";
  const canonicalUrl = `${SITE_URL}/magazine/${slug}`;
  const hasHttpCover =
    typeof article.cover_image_url === "string" &&
    article.cover_image_url.startsWith("http");

  return {
    title: `${article.title} | 놓다 익선동`,
    description: article.excerpt ?? "",
    keywords: article.sns_hashtags ?? undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: article.title,
      description: article.excerpt ?? "",
      type: "article",
      locale: ogLocale,
      url: canonicalUrl,
      siteName: "놓다 익선동",
      publishedTime: article.published_at ?? undefined,
      modifiedTime: article.updated_at ?? article.published_at ?? undefined,
      ...(hasHttpCover && {
        images: [
          {
            url: article.cover_image_url!,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt ?? "",
      ...(hasHttpCover && { images: [article.cover_image_url!] }),
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const locale = await getLocale();
  const dateLocale = DATE_LOCALE_MAP[locale] ?? "ko-KR";

  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (articleError) console.error("Article page query failed:", articleError);

  if (!article) notFound();

  // Increment view count atomically via RPC (fire-and-forget)
  // Falls back gracefully if the RPC doesn't exist yet
  supabase
    .rpc("increment_article_view", { article_id: article.id })
    .then(({ error }) => {
      if (error) console.error("View count RPC failed:", error);
    });

  // Related articles
  const { data: related, error: relatedError } = await supabase
    .from("articles")
    .select("id, title, slug, category, excerpt, published_at")
    .eq("status", "published")
    .eq("category", article.category)
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(3);
  if (relatedError) console.error("Related articles query failed:", relatedError);

  const readTime = Math.max(1, Math.ceil(article.content.length / 500));

  const canonicalUrl = `${SITE_URL}/magazine/${slug}`;
  const hasHttpCover =
    typeof article.cover_image_url === "string" &&
    article.cover_image_url.startsWith("http");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt ?? "",
    ...(hasHttpCover && { image: [article.cover_image_url] }),
    datePublished: article.published_at ?? undefined,
    dateModified: article.updated_at ?? article.published_at ?? undefined,
    author: {
      "@type": "Organization",
      name: "놓다 익선동",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "놓다 익선동",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-icon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    articleSection: CATEGORY_LABELS[article.category] ?? article.category,
    keywords: article.sns_hashtags?.join(", ") ?? undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1">
        {/* Cover Image */}
        {article.cover_image_url && (
          <section className="relative">
            <ArticleCover
              category={article.category}
              coverImageUrl={article.cover_image_url}
              title={article.title}
              size="lg"
              overlay
            />
          </section>
        )}

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
                  {article.published_at && (
                    <time dateTime={article.published_at}>
                      {new Date(article.published_at).toLocaleDateString(dateLocale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  )}
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
                <Image src="/logo-icon.png" alt="놓다" width={48} height={48} className="h-12 w-auto brightness-0 invert" />
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
                      href={NOHDA_URL}
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
            <div className="mt-6 flex items-center justify-center">
              <ShareButton title={article.title} text={article.excerpt ?? undefined} />
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
