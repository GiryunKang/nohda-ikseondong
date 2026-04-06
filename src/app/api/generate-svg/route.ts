import { NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { generateSvg, CATEGORY_SVG_PROMPTS } from "@/lib/quiver/client";

import type { NextRequest } from "next/server";

export const maxDuration = 60;

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
  const { prompt, category, article_id } = body as {
    prompt?: string;
    category?: string;
    article_id?: string;
  };

  if (
    (prompt !== undefined && typeof prompt !== "string") ||
    (category !== undefined && typeof category !== "string") ||
    (article_id !== undefined && typeof article_id !== "string")
  ) {
    return NextResponse.json({ error: "유효하지 않은 입력입니다" }, { status: 400 });
  }

  const finalPrompt = prompt ?? (category ? CATEGORY_SVG_PROMPTS[category] : null);

  if (!finalPrompt) {
    return NextResponse.json(
      { error: "prompt or category is required" },
      { status: 400 }
    );
  }

  const svg = await generateSvg({ prompt: finalPrompt });

  if (!svg) {
    return NextResponse.json(
      { error: "SVG 생성에 실패했습니다." },
      { status: 500 }
    );
  }

  if (article_id) {
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

    const { error: updateError } = await supabase
      .from("articles")
      .update({ cover_image_url: svgDataUrl })
      .eq("id", article_id);

    if (updateError) {
      console.error("Article SVG update failed:", updateError);
      return NextResponse.json({ error: "커버 이미지 저장에 실패했습니다" }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    svg,
    prompt: finalPrompt,
  });
}
