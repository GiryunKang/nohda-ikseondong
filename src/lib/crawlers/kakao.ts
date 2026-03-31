import { NOHDA_LOCATION, CRAWL_RADIUS, KAKAO_CATEGORY_MAP } from "./types";

import type { CrawledPlace } from "./types";

interface KakaoPlace {
  id: string;
  place_name: string;
  category_group_code: string;
  category_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  place_url: string;
}

interface KakaoResponse {
  documents: KakaoPlace[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

const KAKAO_CATEGORIES = ["FD6", "CE7", "CT1", "AT4"] as const;

export async function crawlKakao(): Promise<CrawledPlace[]> {
  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    console.error("KAKAO_REST_API_KEY is not set");
    return [];
  }

  const allPlaces: CrawledPlace[] = [];

  for (const categoryCode of KAKAO_CATEGORIES) {
    try {
      const places = await fetchKakaoCategory(apiKey, categoryCode);
      allPlaces.push(...places);
    } catch (error) {
      console.error(`Kakao crawl failed for category ${categoryCode}:`, error);
    }
  }

  return allPlaces;
}

async function fetchKakaoCategory(
  apiKey: string,
  categoryCode: string
): Promise<CrawledPlace[]> {
  const places: CrawledPlace[] = [];
  let page = 1;
  let isEnd = false;

  while (!isEnd && page <= 3) {
    const url = new URL(
      "https://dapi.kakao.com/v2/local/search/category.json"
    );
    url.searchParams.set("category_group_code", categoryCode);
    url.searchParams.set("x", String(NOHDA_LOCATION.longitude));
    url.searchParams.set("y", String(NOHDA_LOCATION.latitude));
    url.searchParams.set("radius", String(CRAWL_RADIUS));
    url.searchParams.set("sort", "distance");
    url.searchParams.set("page", String(page));
    url.searchParams.set("size", "15");

    const response = await fetch(url.toString(), {
      headers: { Authorization: `KakaoAK ${apiKey}` },
    });

    if (!response.ok) {
      console.error(`Kakao API error: ${response.status}`);
      break;
    }

    const data: KakaoResponse = await response.json();

    for (const doc of data.documents) {
      const category = KAKAO_CATEGORY_MAP[doc.category_group_code];
      if (!category) continue;

      places.push({
        name: doc.place_name,
        category,
        address: doc.road_address_name || doc.address_name,
        phone: doc.phone || null,
        latitude: parseFloat(doc.y),
        longitude: parseFloat(doc.x),
        rating: null,
        review_count: 0,
        source: "kakao",
        source_id: doc.id,
        image_url: null,
        description: doc.category_name,
        tags: extractTags(doc.category_name),
      });
    }

    isEnd = data.meta.is_end;
    page++;
  }

  return places;
}

function extractTags(categoryName: string): string[] {
  return categoryName
    .split(" > ")
    .filter((tag) => tag.length > 0)
    .slice(-2);
}
