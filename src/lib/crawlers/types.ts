export interface CrawledPlace {
  name: string;
  category: "restaurant" | "cafe" | "culture" | "course" | "event" | "locker_tip" | "story";
  address: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  review_count: number;
  source: string;
  source_id: string;
  image_url: string | null;
  description: string | null;
  tags: string[];
}

// 놓다 보관함 위치 (서울 종로구 돈의동)
export const NOHDA_LOCATION = {
  latitude: 37.5725,
  longitude: 126.9908,
} as const;

// 크롤링 반경 (미터)
export const CRAWL_RADIUS = 500;

// Kakao 카테고리 → 우리 카테고리 매핑
export const KAKAO_CATEGORY_MAP: Record<string, CrawledPlace["category"]> = {
  FD6: "restaurant",
  CE7: "cafe",
  CT1: "culture",
  AT4: "culture",
} as const;
