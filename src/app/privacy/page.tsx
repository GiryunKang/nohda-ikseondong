import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "놓다 익선동의 개인정보처리방침입니다.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="px-5 py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-heading text-3xl font-bold">개인정보처리방침</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              최종 수정일: 2026년 4월 12일
            </p>

            <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground">
              <section>
                <h2 className="font-heading text-lg font-semibold">1. 수집하는 개인정보</h2>
                <p className="mt-2 text-muted-foreground">
                  놓다 익선동은 서비스 운영을 위해 최소한의 정보만 수집합니다.
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  <li>관리자 로그인: 이메일, 비밀번호 (Supabase Auth를 통해 안전하게 관리)</li>
                  <li>웹사이트 방문: 쿠키 (언어 설정 저장 목적)</li>
                  <li>기사 조회수: 익명 집계 (개인 식별 불가)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-lg font-semibold">2. 개인정보 이용 목적</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  <li>관리자 인증 및 콘텐츠 관리</li>
                  <li>사용자 언어 환경 설정 유지</li>
                  <li>서비스 이용 통계 분석 (익명)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-lg font-semibold">3. 개인정보 보유 기간</h2>
                <p className="mt-2 text-muted-foreground">
                  관리자 계정 정보는 계정 삭제 시까지 보유합니다.
                  쿠키 정보는 1년간 보유하며, 만료 후 자동 삭제됩니다.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-lg font-semibold">4. 제3자 제공</h2>
                <p className="mt-2 text-muted-foreground">
                  수집된 개인정보는 제3자에게 제공하지 않습니다.
                  단, 법률에 의해 요구되는 경우는 예외로 합니다.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-lg font-semibold">5. 문의</h2>
                <p className="mt-2 text-muted-foreground">
                  개인정보 관련 문의: smtlocker@naver.com
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
