import { NextResponse } from "next/server";

import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { SYSTEM_PROMPT, buildArticlePrompt } from "@/lib/ai/prompts";

import type { NextRequest } from "next/server";

export const maxDuration = 60;

const GeneratedArticle = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string(),
  sns_summary_x: z.string(),
  sns_summary_instagram: z.string(),
  sns_hashtags: z.array(z.string()),
});

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

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) console.error("Auth check failed:", authError);
  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Admin profile query failed:", profileError);
    return NextResponse.json({ error: "처리 중 오류가 발생했습니다" }, { status: 500 });
  }

  if (!profile) {
    return NextResponse.json({ error: "Not an admin" }, { status: 403 });
  }

  const body = await request.json();
  const { category, topic, tone = "friendly", save = false } = body;

  if (!category || !topic) {
    return NextResponse.json(
      { error: "category and topic are required" },
      { status: 400 }
    );
  }

  if (typeof topic !== "string" || topic.length > 500) {
    return NextResponse.json({ error: "유효하지 않은 입력입니다" }, { status: 400 });
  }

  // Fetch related places from DB
  const { data: places } = await supabase
    .from("places")
    .select("name, category, address, rating")
    .eq("category", category)
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(10);

  const prompt = buildArticlePrompt(category, topic, tone, places ?? undefined);

  try {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      prompt,
      output: Output.object({ schema: GeneratedArticle }),
    });

    const article = result.output;

    if (save && article) {
      const { data: saved, error } = await supabase
        .from("articles")
        .insert({
          title: article.title,
          slug: article.slug + "-" + Date.now().toString(36),
          category,
          content: article.content,
          excerpt: article.excerpt,
          status: "review",
          author_id: user.id,
          sns_summary_x: article.sns_summary_x,
          sns_summary_instagram: article.sns_summary_instagram,
          sns_hashtags: article.sns_hashtags,
          is_ai_generated: true,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Save error:", error);
        return NextResponse.json({
          success: true,
          article,
          saved: false,
          save_error: error.message,
        });
      }

      return NextResponse.json({
        success: true,
        article,
        saved: true,
        article_id: saved.id,
      });
    }

    return NextResponse.json({ success: true, article, saved: false });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "AI 콘텐츠 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
