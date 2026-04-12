import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  description: "놓다 익선동 웹사이트 이용약관입니다.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="px-5 py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-heading text-3xl font-bold">이용약관</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              최종 수정일: 2026년 4월 12일
            </p>

            <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground">
              <section>
                <h2 className="font-heading text-lg font-semibold">1. 서비스 개요</h2>
                <p className="mt-2 text-muted-foreground">
                  놓다 익선동(이하 &ldquo;서비스&rdquo;)은 익선동 및 종로3가 일대의
                  맛집, 카페, 문화공간 정보를 제공하는 매거진형 웹사이트입니다.
                  서비스는 (주)프레이머가 운영합니다.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-lg font-semibold">2. 콘텐츠 이용</h2>
                <p className="mt-2 text-muted-foreground">
                  서비스에 게시된 콘텐츠(글, 이미지, 일러스트)의 저작권은
                  (주)프레이머에 있습니다. 개인적 비상업적 용도로만 이용할 수 있으며,
                  무단 복제·배포는 금지됩니다.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-lg font-semibold">3. 보관함 서비스</h2>
                <p className="mt-2 text-muted-foreground">
                  물품보관함 &ldquo;놓다&rdquo;의 이용 약관은 놓다.com에서 별도로
                  확인하시기 바랍니다. 본 웹사이트는 보관함 서비스의 직접 운영과는
                  독립적인 정보 제공 사이트입니다.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-lg font-semibold">4. 면책</h2>
                <p className="mt-2 text-muted-foreground">
                  서비스에 포함된 장소 정보(가격, 영업시간, 메뉴 등)는 변경될 수 있으며,
                  최신 정보는 각 장소에 직접 확인하시기 바랍니다.
                  서비스는 정보의 정확성을 보장하지 않습니다.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-lg font-semibold">5. 문의</h2>
                <p className="mt-2 text-muted-foreground">
                  이용약관 관련 문의: smtlocker@naver.com
                  <br />
                  운영사: (주)프레이머 (사업자등록번호: 213-86-43972)
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
