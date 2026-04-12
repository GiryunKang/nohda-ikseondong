import Image from "next/image";
import { MapPin, Clock, Phone, ExternalLink, Package, Backpack, Briefcase, Luggage, Train, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "놓다 소개 | 익선동 무인 물품보관함",
  description:
    "서울 종로구 돈의동, 익선동 바로 맞은편 24시간 무인 물품보관함. 위치, 가격, 이용방법 안내.",
};

const LOCKER_SIZES = [
  { size: "소형", description: "배낭, 작은 가방", Icon: Backpack },
  { size: "중형", description: "18인치 이하 캐리어", Icon: Briefcase },
  { size: "대형", description: "28인치 캐리어까지", Icon: Luggage },
] as const;

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-accent to-background px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Image
              src="/logo-transparent-vertical.png"
              alt="놓다 물품보관함"
              width={160}
              height={160}
              className="mx-auto h-28 w-auto md:h-36"
              priority
            />
            <h1 className="mt-4 font-heading text-3xl font-extrabold md:text-5xl">
              놓다
            </h1>
            <p className="mt-2 text-xl font-medium text-primary">
              무인 물품보관함
            </p>
            <p className="mt-2 text-muted-foreground">
              익선동 바로 맞은편 · 종로3가역 4번 출구 도보 1분 (35m)
              <br />
              24시간 연중무휴 · 약 220개 보관함 · 간편 결제
            </p>
            <div className="mt-6">
              <Button size="lg" className="text-base" render={<a href="https://놓다.com" target="_blank" rel="noopener noreferrer" />}>
                지금 보관함 이용하기
              </Button>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-heading text-2xl font-bold">찾아오시는 길</h2>

            <Card className="mt-6 border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">
                      서울특별시 종로구 돈화문로 11길 29, 1층 1호
                    </p>
                    <p className="text-sm text-muted-foreground">
                      (돈의동, 낙원오피스텔)
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Train className="h-5 w-5 text-primary" />
                    <p>
                      <strong>종로3가역</strong> 4번 출구에서 도보 1분 (35m)
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-primary" />
                    <p>
                      <strong>익선동 한옥마을</strong> 바로 맞은편
                    </p>
                  </div>
                </div>

                <div className="mt-6 aspect-video overflow-hidden rounded-lg bg-muted">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d791.0!2d126.9908!3d37.5725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDM0JzIxLjAiTiAxMjbCsDU5JzI3LjAiRQ!5e0!3m2!1sko!2skr!4v1"
                    className="h-full w-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="놓다 위치"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Locker Sizes */}
        <section className="bg-card px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-heading text-2xl font-bold">보관함 안내</h2>
            <p className="mt-1 text-muted-foreground">
              짐 크기에 맞는 보관함을 선택하세요
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {LOCKER_SIZES.map((locker) => (
                <Card key={locker.size} className="border shadow-sm">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <locker.Icon className="h-10 w-10 text-primary" />
                    <h3 className="mt-3 font-heading text-lg font-semibold">
                      {locker.size}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {locker.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              정확한 가격과 빈 보관함 현황은 놓다.com에서 확인하세요
            </p>
          </div>
        </section>

        {/* How to Use */}
        <section className="px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-heading text-2xl font-bold">이용 방법</h2>

            <div className="mt-6 space-y-4">
              {[
                {
                  step: 1,
                  title: "놓다.com 접속",
                  description: "스마트폰으로 놓다.com에 접속하세요",
                },
                {
                  step: 2,
                  title: '"물품보관" 선택',
                  description: "원하는 크기의 보관함을 선택하세요",
                },
                {
                  step: 3,
                  title: "짐 보관",
                  description: "보관함 문이 열리면 짐을 넣어주세요",
                },
                {
                  step: 4,
                  title: "가볍게 출발!",
                  description: "익선동을 마음껏 즐기세요",
                },
                {
                  step: 5,
                  title: "짐 찾기",
                  description: '"물품찾기 및 보관종료"를 선택하세요',
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info */}
        <section className="bg-card px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-heading text-2xl font-bold">안내 사항</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-heading font-semibold">운영 시간</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    24시간 연중무휴
                    <br />
                    무인 운영 시스템
                  </p>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <h3 className="font-heading font-semibold">고객센터</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    스마트큐브 A/S센터: 02-1661-5820
                    <br />
                    이메일: smtlocker@naver.com
                    <br />
                    <a href="https://pf.kakao.com/_xjnxcMG" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      카카오톡 채널 →
                    </a>
                  </p>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <h3 className="font-heading font-semibold">보관 가능 물품</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    캐리어, 배낭, 쇼핑백 등
                    <br />
                    위험물·귀중품 보관 불가
                  </p>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    <h3 className="font-heading font-semibold">운영사</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    (주)프레이머
                    <br />
                    사업자등록번호: 213-86-43972
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-2xl font-bold">
              지금 바로 이용해보세요
            </h2>
            <p className="mt-2 text-muted-foreground">
              스마트폰으로 놓다.com에 접속하면 바로 이용할 수 있어요
            </p>
            <Button size="lg" className="mt-6 text-base" render={<a href="https://놓다.com" target="_blank" rel="noopener noreferrer" />}>
              놓다.com 바로가기
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
