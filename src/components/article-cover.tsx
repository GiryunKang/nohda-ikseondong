import { CATEGORY_EMOJI } from "@/lib/constants";

interface ArticleCoverProps {
  category: string;
  coverImageUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

export function ArticleCover({
  category,
  coverImageUrl,
  size = "md",
}: ArticleCoverProps) {
  const heights = {
    sm: "h-32",
    md: "h-40",
    lg: "h-48 md:h-64",
  };

  const emojiSizes = {
    sm: "text-4xl",
    md: "text-5xl",
    lg: "text-6xl",
  };

  if (coverImageUrl?.startsWith("data:image/svg+xml")) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden bg-muted ${heights[size]}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImageUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (coverImageUrl?.startsWith("http")) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden bg-muted ${heights[size]}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImageUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-muted ${emojiSizes[size]} ${heights[size]}`}
    >
      {CATEGORY_EMOJI[category] ?? "📄"}
    </div>
  );
}
