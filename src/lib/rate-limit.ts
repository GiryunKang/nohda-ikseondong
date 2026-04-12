import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Production-grade rate limiter backed by Upstash Redis.
 * Falls back to in-memory Map when Upstash env vars are not configured.
 */

interface RateLimitConfig {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

// --- Upstash Redis backend ---

const hasUpstash =
  typeof process.env.UPSTASH_REDIS_REST_URL === "string" &&
  typeof process.env.UPSTASH_REDIS_REST_TOKEN === "string";

const redis = hasUpstash
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const limiterCache = new Map<string, Ratelimit>();

function getUpstashLimiter(prefix: string, config: RateLimitConfig): Ratelimit {
  const cacheKey = `${prefix}:${config.limit}:${config.windowSeconds}`;
  const cached = limiterCache.get(cacheKey);
  if (cached) return cached;

  const limiter = new Ratelimit({
    redis: redis!,
    limiter: Ratelimit.slidingWindow(config.limit, `${config.windowSeconds} s`),
    prefix: `ratelimit:${prefix}`,
    analytics: false,
  });
  limiterCache.set(cacheKey, limiter);
  return limiter;
}

// --- In-memory fallback (dev environment) ---

interface MemoryEntry {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, MemoryEntry>();

function checkMemoryRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  const entry = memoryStore.get(key);

  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs;
    memoryStore.set(key, { count: 1, resetAt });
    return { success: true, remaining: config.limit - 1, resetAt };
  }

  if (entry.count >= config.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

// --- Public API ---

export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  if (redis) {
    try {
      const prefix = key.split(":")[0] ?? "default";
      const limiter = getUpstashLimiter(prefix, config);
      const result = await limiter.limit(key);
      return {
        success: result.success,
        remaining: result.remaining,
        resetAt: result.reset,
      };
    } catch (err) {
      console.error("Upstash rate limit error, falling back to memory:", err);
      return checkMemoryRateLimit(key, config);
    }
  }

  return checkMemoryRateLimit(key, config);
}

/**
 * Extract client identifier from request.
 * Uses X-Forwarded-For (Vercel), falls back to X-Real-IP, then "unknown".
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
