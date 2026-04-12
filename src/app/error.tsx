"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="flex min-h-[60vh] items-center justify-center px-5 py-16">
          <div className="mx-auto max-w-md text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Error
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold md:text-4xl">
              일시적인 오류가 발생했습니다
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              페이지를 불러오는 중 문제가 생겼어요.
              <br />
              잠시 후 다시 시도해 주세요.
            </p>
            {error.digest && (
              <p className="mt-2 font-mono text-xs text-muted-foreground/60">
                Error ID: {error.digest}
              </p>
            )}
            <div className="mt-8 flex justify-center gap-3">
              <Button onClick={() => reset()}>다시 시도</Button>
              <Button variant="outline" render={<Link href="/" />}>
                홈으로
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
