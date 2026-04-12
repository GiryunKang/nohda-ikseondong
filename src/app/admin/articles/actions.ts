"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function updateArticleStatus(
  articleId: string,
  status: "draft" | "review" | "published" | "archived"
) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) console.error("Auth check failed:", authError);
  if (!user) return { success: false, error: "인증이 필요합니다." };

  const updateData: Record<string, unknown> = { status };
  if (status === "published") {
    updateData.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("articles")
    .update(updateData)
    .eq("id", articleId);

  if (error) {
    console.error("Article operation failed:", error);
    return { success: false, error: "처리 중 오류가 발생했습니다" };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/magazine");
  revalidatePath("/");
  return { success: true };
}

export async function deleteArticle(articleId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) console.error("Auth check failed:", authError);
  if (!user) return { success: false, error: "인증이 필요합니다." };

  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", articleId);

  if (error) {
    console.error("Article operation failed:", error);
    return { success: false, error: "처리 중 오류가 발생했습니다" };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/magazine");
  revalidatePath("/");
  return { success: true };
}

export async function triggerCrawl() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) console.error("Auth check failed:", authError);
  if (!user) return { success: false, error: "인증이 필요합니다." };

  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/crawl`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    return { success: false, error: "크롤링 요청에 실패했습니다." };
  }

  const data = await response.json();
  revalidatePath("/admin/places");
  return { success: true, data };
}
