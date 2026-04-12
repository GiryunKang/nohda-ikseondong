# 울트라개발 계획: 상용화 강화 3건

## 1. Upstash Redis 레이트리미팅

### 문제
현재 인메모리 Map 기반 → Vercel 서버리스에서 인스턴스 간 상태 공유 불가 → 레이트리미팅 무효화

### 설계
- `@upstash/redis` + `@upstash/ratelimit` 설치
- `lib/rate-limit.ts` 전면 교체: Upstash Ratelimit (sliding window)
- env 미설정 시 인메모리 폴백 유지 (개발 환경 호환)
- 기존 `checkRateLimit(key, config)` 시그니처 유지 → 호출부 변경 없음
- `getClientIp` 함수는 변경 없이 유지
- `setInterval` 제거 (Redis가 TTL 관리)

### 파일
- `package.json` — 의존성 추가
- `src/lib/rate-limit.ts` — 전면 재작성
- `.env.local` — `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` 추가 필요

### 환경변수
- `UPSTASH_REDIS_REST_URL` (Vercel env에 등록)
- `UPSTASH_REDIS_REST_TOKEN` (Vercel env에 등록)

---

## 2. AI 글쓰기 저장 버그

### 문제
`handleSave`가 `/api/generate`를 다시 호출하여 새 기사를 생성 → 미리보기와 다른 기사가 저장됨

### 설계
- 새 Server Action `saveArticle` 생성 (`admin/articles/actions.ts`에 추가)
- `handleSave`가 이미 생성된 `article` 상태를 직접 전송
- `/api/generate`의 `save: true` 로직 제거 (단순화)
- status 파라미터도 전달하여 "review" / "published" 선택 반영

### 파일
- `src/app/admin/articles/actions.ts` — `saveGeneratedArticle` Server Action 추가
- `src/app/admin/ai-writer/page.tsx` — `handleSave` 수정
- `src/app/api/generate/route.ts` — `save` 로직 제거 (선택)

---

## 3. CSP nonce

### 문제
`layout.tsx`의 인라인 스크립트가 CSP `script-src` 정책과 충돌 가능

### 설계
- Next.js 16에서는 `next/headers`의 `headers()`로 nonce 접근 불가 (서버 컴포넌트에서)
- 대안: `next.config.ts`의 `headers()`에서 CSP 헤더 추가, `'unsafe-inline'`을 허용하되 다른 위험 소스 차단
- 인라인 스크립트는 테마 초기화 1개뿐이므로, hash 기반 CSP 적용
- 스크립트 내용이 고정이므로 SHA-256 해시를 미리 계산하여 CSP에 등록

### 파일
- `next.config.ts` — CSP 헤더 추가
