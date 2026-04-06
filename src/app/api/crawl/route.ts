import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { crawlKakao } from "@/lib/crawlers/kakao";
import { crawlGoogle } from "@/lib/crawlers/google";

import type { CrawledPlace } from "@/lib/crawlers/types";
import type { NextRequest } from "next/server";

export const maxDuration = 60;

// Vercel Cron calls GET
export async function GET(request: NextRequest) {
  return handleCrawl(request);
}

export async function POST(request: NextRequest) {
  return handleCrawl(request);
}

async function handleCrawl(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let supabase;

  // Path 1: Cron job with service role key
  if (cronSecret && authHeader === `Bearer ${cronSecret}` && serviceRoleKey) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );
  }
  // Path 2: Admin session auth
  else {
    const cookieStore = await cookies();
    supabase = createServerClient(
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
  }

  const results = {
    kakao: { fetched: 0, upserted: 0, errors: 0 },
    google: { fetched: 0, upserted: 0, errors: 0 },
  };

  // Crawl from Kakao
  try {
    const kakaoPlaces = await crawlKakao();
    results.kakao.fetched = kakaoPlaces.length;
    const upserted = await upsertPlaces(supabase, kakaoPlaces);
    results.kakao.upserted = upserted;
  } catch (error) {
    console.error("Kakao crawl error:", error);
    results.kakao.errors = 1;
  }

  // Crawl from Google
  try {
    const googlePlaces = await crawlGoogle();
    results.google.fetched = googlePlaces.length;
    const upserted = await upsertPlaces(supabase, googlePlaces);
    results.google.upserted = upserted;
  } catch (error) {
    console.error("Google crawl error:", error);
    results.google.errors = 1;
  }

  const totalFetched = results.kakao.fetched + results.google.fetched;
  const totalUpserted = results.kakao.upserted + results.google.upserted;

  return NextResponse.json({
    success: true,
    summary: {
      total_fetched: totalFetched,
      total_upserted: totalUpserted,
      timestamp: new Date().toISOString(),
    },
    details: results,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function upsertPlaces(
  supabase: { from: (table: string) => any },
  places: CrawledPlace[]
): Promise<number> {
  if (places.length === 0) return 0;

  let upsertedCount = 0;

  for (let i = 0; i < places.length; i += 50) {
    const chunk = places.slice(i, i + 50).map((place) => ({
      ...place,
      crawled_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("places")
      .upsert(chunk, {
        onConflict: "source,source_id",
        ignoreDuplicates: false,
      });

    if (error) {
      console.error("Upsert error:", error);
    } else {
      upsertedCount += chunk.length;
    }
  }

  return upsertedCount;
}
