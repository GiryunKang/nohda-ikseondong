import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/constants";

import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from("articles")
    .select("slug, published_at, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) console.error("Sitemap articles query failed:", error);

  const articleEntries: MetadataRoute.Sitemap = (articles ?? []).map((article) => ({
    url: `${SITE_URL}/magazine/${article.slug}`,
    lastModified: article.updated_at ?? article.published_at ?? new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/magazine`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...articleEntries,
  ];
}
