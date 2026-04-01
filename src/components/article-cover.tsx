import {
  UtensilsCrossed,
  Coffee,
  Palette,
  Map,
  Sparkles,
  Lock,
  BookOpen,
  FileText,
} from "lucide-react";

import { CATEGORY_GRADIENTS } from "@/lib/constants";

import type { LucideIcon } from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  restaurant: UtensilsCrossed,
  cafe: Coffee,
  culture: Palette,
  course: Map,
  event: Sparkles,
  locker_tip: Lock,
  story: BookOpen,
};

interface ArticleCoverProps {
  category: string;
  coverImageUrl?: string | null;
  size?: "sm" | "md" | "lg";
  overlay?: boolean;
}

export function ArticleCover({
  category,
  coverImageUrl,
  size = "md",
  overlay = false,
}: ArticleCoverProps) {
  const heights: Record<string, string> = {
    sm: "h-32",
    md: "h-44",
    lg: "h-56 md:h-72",
  };

  const iconSizes: Record<string, string> = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const gradient = CATEGORY_GRADIENTS[category] ?? "from-stone-400/90 to-stone-600/90";
  const Icon = CATEGORY_ICONS[category] ?? FileText;

  if (coverImageUrl?.startsWith("data:image/svg+xml") || coverImageUrl?.startsWith("http")) {
    return (
      <div className={`relative overflow-hidden ${heights[size]}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImageUrl}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${heights[size]}`}
    >
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }} />
      <Icon className={`${iconSizes[size]} text-white/90 drop-shadow-sm`} strokeWidth={1.5} />
    </div>
  );
}
