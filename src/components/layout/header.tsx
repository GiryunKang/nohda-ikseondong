"use client";

import { useState } from "react";
import Link from "next/link";

import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/magazine", label: "매거진" },
  { href: "/about", label: "놓다 소개" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐶</span>
          <span className="font-heading text-xl font-bold text-foreground">
            놓다
          </span>
          <span className="text-sm text-muted-foreground">익선동</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Button size="sm" render={<a href="https://놓다.com" target="_blank" rel="noopener noreferrer" />}>
            보관함 이용하기
          </Button>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
            render={<Button variant="ghost" size="icon" />}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="mt-8 flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
              <Button className="mt-4" render={<a href="https://놓다.com" target="_blank" rel="noopener noreferrer" />}>
                보관함 이용하기
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
