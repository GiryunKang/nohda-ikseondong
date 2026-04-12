import { NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { postToX } from "@/lib/sns/x";
import { postToInstagram } from "@/lib/sns/instagram";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

import type { NextRequest } from "next/server";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rl = checkRateLimit(`sns-publish:${ip}`, { limit: 10, windowSeconds: 60 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

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

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) console.error("Auth check failed:", authError);
  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { article_id, platforms } = body as {
    article_id: string;
    platforms: Array<"x" | "instagram">;
  };

  if (!article_id || typeof article_id !== "string") {
    return NextResponse.json({ error: "유효하지 않은 입력입니다" }, { status: 400 });
  }

  const VALID_PLATFORMS = ["x", "instagram"] as const;
  if (
    !Array.isArray(platforms) ||
    platforms.length === 0 ||
    !platforms.every((p) => VALID_PLATFORMS.includes(p as (typeof VALID_PLATFORMS)[number]))
  ) {
    return NextResponse.json({ error: "유효하지 않은 입력입니다" }, { status: 400 });
  }

  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("title, slug, sns_summary_x, sns_summary_instagram, cover_image_url")
    .eq("id", article_id)
    .single();

  if (articleError) {
    console.error("Article query failed:", articleError);
    return NextResponse.json({ error: "처리 중 오류가 발생했습니다" }, { status: 500 });
  }

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

      const { error: xInsertError } = await supabase.from("sns_posts").insert({
        article_id,
        platform: "x",
        status: result.success ? "published" : "failed",
        post_id: result.post_id ?? null,
        post_url: result.post_url ?? null,
        content,
        published_at: result.success ? new Date().toISOString() : null,
        error_message: result.error ?? null,
      });
      if (xInsertError) console.error("sns_posts insert failed (x):", xInsertError);
    }

    if (platform === "instagram") {
      const caption = article.sns_summary_instagram
        ? `${article.sns_summary_instagram}\n\n🔗 ${articleUrl}`
        : `${article.title}\n\n🔗 ${articleUrl}`;

      const result = await postToInstagram(caption, article.cover_image_url ?? undefined);
      results.instagram = result;

      const { error: igInsertError } = await supabase.from("sns_posts").insert({
        article_id,
        platform: "instagram",
        status: result.success ? "published" : "failed",
        post_id: result.post_id ?? null,
        post_url: result.post_url ?? null,
        content: caption,
        published_at: result.success ? new Date().toISOString() : null,
        error_message: result.error ?? null,
      });
      if (igInsertError) console.error("sns_posts insert failed (instagram):", igInsertError);
    }
  }

  return NextResponse.json({ success: true, results });
}
