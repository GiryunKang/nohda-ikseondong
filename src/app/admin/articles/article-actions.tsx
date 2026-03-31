"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { updateArticleStatus, deleteArticle } from "./actions";

interface ArticleActionsProps {
  articleId: string;
  currentStatus: string;
}

export function ArticleActions({ articleId, currentStatus }: ArticleActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (status: "draft" | "review" | "published" | "archived") => {
    setLoading(true);
    await updateArticleStatus(articleId, status);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    await deleteArticle(articleId);
    setLoading(false);
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      {currentStatus !== "published" && (
        <Button
          size="sm"
          disabled={loading}
          onClick={() => handleStatusChange("published")}
        >
          발행
        </Button>
      )}
      {currentStatus === "published" && (
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={() => handleStatusChange("archived")}
        >
          보관
        </Button>
      )}
      {currentStatus === "archived" && (
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={() => handleStatusChange("draft")}
        >
          복원
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        disabled={loading}
        onClick={handleDelete}
        className="text-red-500 hover:text-red-600"
      >
        삭제
      </Button>
    </div>
  );
}
