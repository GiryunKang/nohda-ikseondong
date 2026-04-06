"use client";

import { useState } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  { value: "restaurant", label: "맛집" },
  { value: "cafe", label: "카페" },
  { value: "culture", label: "문화" },
  { value: "course", label: "코스추천" },
  { value: "event", label: "행사" },
  { value: "story", label: "동네 이야기" },
  { value: "locker_tip", label: "보관함 꿀팁" },
] as const;

const TONES = [
  { value: "friendly", label: "친근한" },
  { value: "informative", label: "정보 전달" },
  { value: "emotional", label: "감성적" },
] as const;

interface GeneratedArticle {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  sns_summary_x: string;
  sns_summary_instagram: string;
  sns_hashtags: string[];
}

export default function AIWriterPage() {
  const [category, setCategory] = useState("cafe");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("friendly");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState<GeneratedArticle | null>(null);
  const [error, setError] = useState("");
  const [saveResult, setSaveResult] = useState<string | null>(null);
  const [coverSvg, setCoverSvg] = useState<string | null>(null);
  const [generatingSvg, setGeneratingSvg] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setArticle(null);
    setSaveResult(null);
    setCoverSvg(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, topic, tone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "생성에 실패했습니다.");
        return;
      }

      setArticle(data.article);
    } catch (err) {
      console.error("Article generation failed:", err);
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSvg = async () => {
    setGeneratingSvg(true);
    setError("");
    try {
      const response = await fetch("/api/generate-svg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });

      const data = await response.json();
      if (data.success) {
        setCoverSvg(data.svg);
      } else {
        setError(data.error ?? "커버 일러스트 생성에 실패했습니다.");
      }
    } catch (err) {
      console.error("SVG 생성 실패:", err);
      setError("커버 일러스트 생성 중 오류가 발생했습니다.");
    } finally {
      setGeneratingSvg(false);
    }
  };

  const handleSave = async (status: "review" | "published") => {
    if (!article) return;
    setSaving(true);
    setSaveResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, topic, tone, save: true }),
      });

      const data = await response.json();

      if (data.saved) {
        setSaveResult(
          status === "published"
            ? "발행되었습니다!"
            : "검토 대기로 저장되었습니다."
        );
      } else {
        setSaveResult(`저장 실패: ${data.save_error ?? "알 수 없는 오류"}`);
      }
    } catch (err) {
      console.error("Article save failed:", err);
      setSaveResult("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">AI 글쓰기</h1>
      <p className="mt-1 text-muted-foreground">
        주제를 입력하면 AI가 매거진 기사를 생성합니다
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Left: Input */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="border shadow-sm">
            <CardContent className="space-y-4 p-5">
              <div className="space-y-2">
                <Label id="category-label">카테고리</Label>
                <div className="flex flex-wrap gap-2" role="group" aria-labelledby="category-label">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                        category === cat.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">주제 / 키워드</Label>
                <Input
                  id="topic"
                  placeholder="예: 익선동 새로 오픈한 디저트 카페"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) handleGenerate();
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label id="tone-label">톤</Label>
                <div className="flex gap-2" role="group" aria-labelledby="tone-label">
                  {TONES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTone(t.value)}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                        tone === t.value
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
              >
                {loading ? "생성 중..." : "✨ AI 초안 생성"}
              </Button>

              <Button
                className="w-full"
                variant="outline"
                onClick={handleGenerateSvg}
                disabled={generatingSvg}
              >
                {generatingSvg ? "일러스트 생성 중..." : "🎨 커버 일러스트 생성"}
              </Button>

              {coverSvg && (
                <div className="rounded-lg border bg-white p-2">
                  <p className="mb-2 text-xs text-muted-foreground">커버 일러스트</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(coverSvg)))}`}
                    alt="생성된 커버 이미지"
                    className="overflow-hidden rounded"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* SNS Preview */}
          {article && (
            <Card className="border shadow-sm">
              <CardContent className="space-y-4 p-5">
                <h3 className="font-heading text-sm font-semibold">
                  SNS 공유용 요약
                </h3>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    X (트위터) — {article.sns_summary_x.length}자
                  </Label>
                  <p className="rounded-lg bg-muted p-3 text-sm">
                    {article.sns_summary_x}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Instagram 캡션
                  </Label>
                  <p className="rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap">
                    {article.sns_summary_instagram}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {article.sns_hashtags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-3">
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-5 text-sm text-red-600">
                {error}
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card className="border shadow-sm">
              <CardContent className="flex items-center justify-center p-12">
                <div className="text-center">
                  <span className="text-4xl">✨</span>
                  <p className="mt-2 text-muted-foreground">
                    AI가 글을 쓰고 있습니다...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {article && !loading && (
            <Card className="border shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {CATEGORIES.find((c) => c.value === category)?.label}
                    </Badge>
                    <h2 className="font-heading text-xl font-bold">
                      {article.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="prose prose-neutral max-w-none prose-headings:font-heading prose-headings:font-bold prose-h2:text-lg prose-p:leading-relaxed prose-blockquote:border-l-primary prose-blockquote:bg-accent prose-blockquote:px-4 prose-blockquote:py-3 prose-blockquote:not-italic">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {article.content}
                  </ReactMarkdown>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={() => handleSave("review")}
                    disabled={saving}
                    variant="outline"
                  >
                    {saving ? "저장 중..." : "검토 대기로 저장"}
                  </Button>
                  <Button
                    onClick={() => handleSave("published")}
                    disabled={saving}
                  >
                    {saving ? "저장 중..." : "바로 발행"}
                  </Button>
                </div>

                {saveResult && (
                  <p className="mt-3 text-sm text-primary">{saveResult}</p>
                )}
              </CardContent>
            </Card>
          )}

          {!article && !loading && !error && (
            <Card className="border shadow-sm">
              <CardContent className="flex items-center justify-center p-16">
                <div className="text-center text-muted-foreground">
                  <span className="text-4xl">🐶</span>
                  <p className="mt-4">
                    주제를 입력하고 &ldquo;AI 초안 생성&rdquo;을 눌러주세요
                  </p>
                  <p className="mt-1 text-sm">
                    크롤링된 장소 데이터를 참고해서 기사를 생성합니다
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
