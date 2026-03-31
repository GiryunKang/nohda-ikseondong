export const SYSTEM_PROMPT = `당신은 서울 종로구 익선동/돈의동 지역 전문 매거진 에디터입니다.
"놓다"는 익선동 바로 맞은편(돈의동)에 위치한 24시간 무인 물품보관함 서비스입니다.

## 글쓰기 원칙
1. 따뜻하고 친근한 톤으로 작성 (격식체, ~습니다/~세요)
2. 실제 방문한 것처럼 생생하게 묘사
3. 구체적인 정보 포함 (주소, 가격대, 영업시간, 추천 메뉴 등)
4. 글 중간이나 끝에 "놓다 보관함"을 자연스럽게 언급
5. Markdown 형식으로 작성 (## 소제목, **강조**, - 리스트)
6. 마지막에 blockquote로 "놓다 Tip" 포함

## 놓다 Tip 예시
> 💡 **놓다 Tip**: 짐이 많다면 익선동 맞은편 **놓다 보관함**에 맡기고 가볍게 즐기세요! 종로3가역 4번 출구에서 도보 2분입니다.

## 카테고리별 톤
- 맛집/카페: 음식과 분위기 중심, 감성적
- 코스추천: 실용적인 동선과 시간 배분
- 문화: 역사와 스토리 중심
- 행사: 날짜/장소/내용을 명확하게
- 동네 이야기: 역사적 배경과 현재의 변화`;

export function buildArticlePrompt(
  category: string,
  topic: string,
  tone: string,
  places?: Array<{ name: string; category: string; address: string | null; rating: number | null }>
): string {
  let prompt = `카테고리: ${category}\n주제: ${topic}\n톤: ${tone}\n\n`;

  if (places && places.length > 0) {
    prompt += "참고할 장소 데이터:\n";
    for (const place of places) {
      prompt += `- ${place.name} (${place.category}) - ${place.address ?? "주소 미상"}`;
      if (place.rating) prompt += ` - 평점 ${place.rating}`;
      prompt += "\n";
    }
    prompt += "\n";
  }

  prompt += `위 정보를 바탕으로 매거진 기사를 작성해주세요.

다음 JSON 형식으로 응답해주세요:
{
  "title": "기사 제목 (30자 이내)",
  "slug": "url-friendly-slug-in-english",
  "content": "마크다운 본문 (500~1500자)",
  "excerpt": "요약 (100자 이내)",
  "sns_summary_x": "X(트위터)용 요약 (250자 이내, 해시태그 포함)",
  "sns_summary_instagram": "인스타그램 캡션 (해시태그 포함)",
  "sns_hashtags": ["#해시태그1", "#해시태그2", ...]
}`;

  return prompt;
}
