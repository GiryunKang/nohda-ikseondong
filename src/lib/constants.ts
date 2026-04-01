export const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "맛집",
  cafe: "카페",
  culture: "문화",
  course: "코스추천",
  event: "행사",
  locker_tip: "보관함 꿀팁",
  story: "동네 이야기",
} as const;

export const CATEGORY_EMOJI: Record<string, string> = {
  restaurant: "🍚",
  cafe: "☕",
  culture: "🎨",
  course: "🗺️",
  event: "🎉",
  locker_tip: "🔐",
  story: "📖",
} as const;

export const CATEGORY_GRADIENTS: Record<string, string> = {
  restaurant: "from-orange-400/90 to-amber-600/90",
  cafe: "from-amber-500/90 to-yellow-700/90",
  culture: "from-rose-400/90 to-pink-600/90",
  course: "from-emerald-400/90 to-teal-600/90",
  event: "from-violet-400/90 to-purple-600/90",
  locker_tip: "from-sky-400/90 to-blue-600/90",
  story: "from-stone-400/90 to-stone-600/90",
} as const;

export const CATEGORY_ICON_NAMES: Record<string, string> = {
  restaurant: "UtensilsCrossed",
  cafe: "Coffee",
  culture: "Palette",
  course: "Map",
  event: "Sparkles",
  locker_tip: "Lock",
  story: "BookOpen",
} as const;
