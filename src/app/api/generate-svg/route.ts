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

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) console.error("Auth check failed:", authError);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Require admin profile — prevents any authenticated user from burning Quiver credits
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

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
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
    // Basic UUID format check to prevent obvious injection
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(article_id)) {
      return NextResponse.json({ error: "유효하지 않은 article_id입니다" }, { status: 400 });
    }

    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

    const { data: updated, error: updateError } = await supabase
      .from("articles")
      .update({ cover_image_url: svgDataUrl })
      .eq("id", article_id)
      .select("id")
      .single();

    if (updateError) {
      console.error("Article SVG update failed:", updateError);
      return NextResponse.json({ error: "커버 이미지 저장에 실패했습니다" }, { status: 500 });
    }
    if (!updated) {
      return NextResponse.json({ error: "기사를 찾을 수 없습니다" }, { status: 404 });
    }
  }

  return NextResponse.json({
    success: true,
    svg,
    prompt: finalPrompt,
  });
}
