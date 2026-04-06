import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { CrawlButton } from "./crawl-button";

export default async function AdminPlacesPage() {
  const supabase = await createClient();

  const { data: places, count, error: placesError } = await supabase
    .from("places")
    .select("id, name, category, address, rating, review_count, source, crawled_at, is_featured", { count: "exact" })
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(50);
  if (placesError) console.error("Admin places query failed:", placesError);

  const sourceLabels: Record<string, string> = {
    kakao: "카카오",
    google: "구글",
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">장소 관리</h1>
          <p className="mt-1 text-muted-foreground">
            크롤링된 장소 {count ?? 0}개 (놓다 반경 500m)
          </p>
        </div>
        <CrawlButton />
      </div>

      <div className="mt-6 space-y-2">
        {places && places.length > 0 ? (
          places.map((place) => (
            <Card key={place.id} className="border shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{place.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {CATEGORY_LABELS[place.category] ?? place.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      via {sourceLabels[place.source] ?? place.source}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {place.address}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  {place.rating && (
                    <p className="text-sm font-medium">
                      ⭐ {place.rating.toFixed(1)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    리뷰 {place.review_count}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border shadow-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              아직 크롤링된 장소가 없습니다. &ldquo;크롤링 실행&rdquo; 버튼을 눌러보세요.
              <br />
              <span className="text-xs">
                (KAKAO_REST_API_KEY 또는 GOOGLE_PLACES_API_KEY 설정 필요)
              </span>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
