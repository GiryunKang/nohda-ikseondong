import { NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { postToX } from "@/lib/sns/x";
import { postToInstagram } from "@/lib/sns/instagram";

import type { NextRequest } from "next/server";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { article_id, platforms } = body as {
    article_id: string;
    platforms: Array<"x" | "instagram">;
  };

  if (!article_id || !platforms?.length) {
    return NextResponse.json(
      { error: "article_id and platforms are required" },
      { status: 400 }
    );
  }

  const { data: article } = await supabase
    .from("articles")
    .select("title, slug, sns_summary_x, sns_summary_instagram, cover_image_url")
    .eq("id", article_id)
    .single();

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://nohda-ikseondong.vercel.app";
  const articleUrl = `${siteUrl}/magazine/${article.slug}`;

  const results: Record<string, { success: boolean; error?: string }> = {};

  for (const platform of platforms) {
    if (platform === "x") {
      const content = article.sns_summary_x
        ? `${article.sns_summary_x}\n\n${articleUrl}`
        : `${article.title}\n\n${articleUrl}`;

      const result = await postToX(content);
      results.x = result;

      await supabase.from("sns_posts").insert({
        article_id,
        platform: "x",
        status: result.success ? "published" : "failed",
        post_id: result.post_id ?? null,
        post_url: result.post_url ?? null,
        content,
        published_at: result.success ? new Date().toISOString() : null,
        error_message: result.error ?? null,
      });
    }

    if (platform === "instagram") {
      const caption = article.sns_summary_instagram
        ? `${article.sns_summary_instagram}\n\n🔗 ${articleUrl}`
        : `${article.title}\n\n🔗 ${articleUrl}`;

      const result = await postToInstagram(caption, article.cover_image_url ?? undefined);
      results.instagram = result;

      await supabase.from("sns_posts").insert({
        article_id,
        platform: "instagram",
        status: result.success ? "published" : "failed",
        post_id: result.post_id ?? null,
        post_url: result.post_url ?? null,
        content: caption,
        published_at: result.success ? new Date().toISOString() : null,
        error_message: result.error ?? null,
      });
    }
  }

  return NextResponse.json({ success: true, results });
}
