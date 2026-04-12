"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { Menu, X } from "lucide-react";

import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/magazine", label: t.nav.magazine },
    { href: "/about", label: t.nav.about },
  ];

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/logo-transparent-horizontal.png"
            alt="놓다 물품보관함"
            width={120}
            height={40}
            className="h-9 w-auto"
            priority
          />
          <span className="text-xs text-muted-foreground">익선동</span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`text-sm font-medium transition-colors hover:text-foreground ${isActive(item.href) ? "text-foreground" : "text-muted-foreground"}`}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          <LocaleSwitcher />
          <Button size="sm" render={<a href="https://놓다.com" target="_blank" rel="noopener noreferrer" />}>
            {t.nav.useLocker}
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <LocaleSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" aria-label={open ? "메뉴 닫기" : "메뉴 열기"} />}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`text-lg font-medium transition-colors hover:text-primary ${isActive(item.href) ? "text-primary" : "text-foreground"}`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button className="mt-4" render={<a href="https://놓다.com" target="_blank" rel="noopener noreferrer" />}>
                  {t.nav.useLocker}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
