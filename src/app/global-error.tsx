"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            backgroundColor: "#F7F2ED",
            color: "#2A1F1A",
          }}
        >
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
              예상치 못한 오류가 발생했습니다
            </h1>
            <p style={{ marginTop: "0.75rem", color: "#635647" }}>
              사이트 전체에 문제가 생겼어요. 잠시 후 다시 시도해 주세요.
            </p>
            {error.digest && (
              <p
                style={{
                  marginTop: "0.5rem",
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: "rgba(99, 86, 71, 0.6)",
                }}
              >
                Error ID: {error.digest}
              </p>
            )}
            <button
              onClick={() => reset()}
              style={{
                marginTop: "2rem",
                padding: "0.625rem 1.25rem",
                backgroundColor: "#C65D28",
                color: "#FFFCF9",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
