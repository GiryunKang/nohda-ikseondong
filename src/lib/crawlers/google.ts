import { NOHDA_LOCATION, CRAWL_RADIUS } from "./types";

import type { CrawledPlace } from "./types";

interface GooglePlace {
  id: string;
  displayName: { text: string };
  formattedAddress: string;
  nationalPhoneNumber?: string;
  location: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  primaryType?: string;
  primaryTypeDisplayName?: { text: string };
  photos?: Array<{ name: string }>;
}

interface GoogleResponse {
  places: GooglePlace[];
  nextPageToken?: string;
}

const GOOGLE_TYPE_MAP: Record<string, CrawledPlace["category"]> = {
  restaurant: "restaurant",
  korean_restaurant: "restaurant",
  japanese_restaurant: "restaurant",
  chinese_restaurant: "restaurant",
  cafe: "cafe",
  coffee_shop: "cafe",
  bakery: "cafe",
  art_gallery: "culture",
  museum: "culture",
  tourist_attraction: "culture",
};

const SEARCH_TYPES = ["restaurant", "cafe", "tourist_attraction"] as const;

export async function crawlGoogle(): Promise<CrawledPlace[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_PLACES_API_KEY is not set");
    return [];
  }

  const allPlaces: CrawledPlace[] = [];

  for (const type of SEARCH_TYPES) {
    try {
      const places = await searchNearby(apiKey, type);
      allPlaces.push(...places);
    } catch (error) {
      console.error(`Google Places crawl failed for type ${type}:`, error);
    }
  }

  return allPlaces;
}

async function searchNearby(
  apiKey: string,
  includedType: string
): Promise<CrawledPlace[]> {
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.location,places.rating,places.userRatingCount,places.primaryType,places.primaryTypeDisplayName,places.photos",
      },
      body: JSON.stringify({
        includedTypes: [includedType],
        locationRestriction: {
          circle: {
            center: {
              latitude: NOHDA_LOCATION.latitude,
              longitude: NOHDA_LOCATION.longitude,
            },
            radius: CRAWL_RADIUS,
          },
        },
        maxResultCount: 20,
        languageCode: "ko",
      }),
    }
  );

  if (!response.ok) {
    console.error(`Google Places API error: ${response.status}`);
    return [];
  }

  const data: GoogleResponse = await response.json();

  return (data.places ?? []).map((place) => {
    const category =
      GOOGLE_TYPE_MAP[place.primaryType ?? ""] ?? "culture";

    return {
      name: place.displayName.text,
      category,
      address: place.formattedAddress,
      phone: place.nationalPhoneNumber ?? null,
      latitude: place.location.latitude,
      longitude: place.location.longitude,
      rating: place.rating ?? null,
      review_count: place.userRatingCount ?? 0,
      source: "google",
      source_id: place.id,
      image_url: place.photos?.[0]
        ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxHeightPx=400`
        : null,
      description: place.primaryTypeDisplayName?.text ?? null,
      tags: [place.primaryTypeDisplayName?.text ?? ""].filter(Boolean),
    };
  });
}
