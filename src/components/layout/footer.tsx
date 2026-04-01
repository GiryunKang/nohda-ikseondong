"use client";

import Link from "next/link";
import Image from "next/image";

import { useI18n } from "@/lib/i18n/context";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-auto border-t border-border/60 bg-card">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-1">
              <Image
                src="/logo-transparent-horizontal.png"
                alt="놓다 물품보관함"
                width={100}
                height={34}
                className="h-8 w-auto"
              />
              <span className="text-xs text-muted-foreground">익선동</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t.footer.description}
              <br />
              {t.footer.description2}
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold">{t.footer.links}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/magazine" className="text-sm text-muted-foreground hover:text-foreground">
                  {t.nav.magazine}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <a href="https://놓다.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
                  {t.footer.lockerLink}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold">{t.footer.address}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              서울시 종로구 돈화문로 11길 29
              <br />
              1층 1호 (돈의동, 낙원오피스텔)
            </p>
            <div className="mt-4 flex gap-3">
              <a href="https://www.instagram.com/storage_lockers_nota/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground transition-colors hover:text-primary">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="https://pf.kakao.com/_xjnxcMG" target="_blank" rel="noopener noreferrer" aria-label="KakaoTalk" className="text-muted-foreground transition-colors hover:text-primary">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.724 1.8 5.109 4.508 6.459-.199.744-.721 2.696-.826 3.113-.129.517.19.51.398.371.163-.109 2.594-1.758 3.651-2.473.737.104 1.494.159 2.269.159 5.523 0 10-3.463 10-7.691S17.523 3 12 3z" />
                </svg>
              </a>
              <a href="https://blog.naver.com/locker_nota" target="_blank" rel="noopener noreferrer" aria-label="Naver Blog" className="text-muted-foreground transition-colors hover:text-primary">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
