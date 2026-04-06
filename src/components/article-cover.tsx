import Image from "next/image";

import { CATEGORY_LABELS } from "@/lib/constants";

const CATEGORY_ILLUSTRATIONS: Record<string, string> = {
  restaurant: "/illustrations/restaurant.svg",
  cafe: "/illustrations/cafe.svg",
  culture: "/illustrations/culture.svg",
  course: "/illustrations/course.svg",
  event: "/illustrations/event.svg",
  locker_tip: "/illustrations/locker.svg",
  story: "/illustrations/story.svg",
};

interface ArticleCoverProps {
  category: string;
  coverImageUrl?: string | null;
  size?: "sm" | "md" | "lg";
  overlay?: boolean;
  title?: string;
}

export function ArticleCover({
  category,
  coverImageUrl,
  size = "md",
  overlay = false,
  title,
}: ArticleCoverProps) {
  const heights: Record<string, string> = {
    sm: "h-36",
    md: "h-48",
    lg: "h-64 md:h-80",
  };

  const hasRealImage =
    coverImageUrl?.startsWith("http") ||
    coverImageUrl?.startsWith("data:image/svg+xml");

  const altText = title ?? CATEGORY_LABELS[category] ?? category;

  if (hasRealImage) {
    const isDataUrl = coverImageUrl!.startsWith("data:");
    return (
      <div className={`relative overflow-hidden ${heights[size]}`}>
        {isDataUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={coverImageUrl!}
            alt={altText}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <Image
            src={coverImageUrl!}
            alt={altText}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        )}
      </div>
    );
  }

  const illustration =
    CATEGORY_ILLUSTRATIONS[category] ?? "/illustrations/story.svg";

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-accent ${heights[size]}`}
    >
      <Image
        src={illustration}
        alt={altText}
        width={400}
        height={300}
        className="h-full w-full object-cover opacity-90"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/30 to-transparent" />
      )}
    </div>
  );
}
