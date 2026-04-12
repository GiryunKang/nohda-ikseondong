import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="flex min-h-[60vh] items-center justify-center px-5 py-16">
          <div className="mx-auto max-w-md text-center">
            <Image
              src="/illustrations/story.svg"
              alt=""
              width={200}
              height={150}
              className="mx-auto opacity-60"
            />
            <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              404
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold md:text-4xl">
              페이지를 찾을 수 없습니다
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              주소가 바뀌었거나 삭제된 페이지일 수 있어요.
              <br />
              익선동의 다른 이야기를 둘러보세요.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button render={<Link href="/" />}>홈으로</Button>
              <Button variant="outline" render={<Link href="/magazine" />}>
                매거진 보기
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
