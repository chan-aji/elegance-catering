"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { SiteSettings } from "@/types";
import { Button } from "@/components/shared/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu Catering" },
  { href: "/paket", label: "Paket" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" }
];

export function SiteHeader({ settings }: { settings: SiteSettings | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      <div
        className={cn(
          "px-4 py-3 transition-all duration-300 sm:px-6 lg:px-10",
          scrolled
            ? "border-b border-brand-700/8 bg-cream/68 backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <div className="flex items-center justify-between gap-4 rounded-full border border-white/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.68))] px-4 py-3 shadow-[0_16px_34px_rgba(25,56,28,0.08)] sm:px-5">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2f7f34_0%,#3d9647_100%)] text-sm font-bold tracking-[0.18em] text-white shadow-[0_10px_24px_rgba(29,73,33,0.22)]">
              CT
            </span>
            <span className="font-display text-[1rem] font-bold tracking-[0.22em] text-ink sm:text-[1.08rem]">
              {settings?.logoText ?? "CATRING"}
            </span>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  pathname === item.href
                    ? "bg-brand-100 text-brand-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                    : "text-[0.94rem] text-ink/72 hover:-translate-y-0.5 hover:bg-brand-50 hover:text-brand-700"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/checkout">
              <Button className="hidden px-6 shadow-soft sm:inline-flex">
                Pesan Sekarang
              </Button>
            </Link>
            <button
              type="button"
              className="inline-flex rounded-full border border-brand-700/10 bg-white p-3 text-ink shadow-card transition hover:bg-brand-50 md:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Tutup menu" : "Buka menu"}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div
          className={cn(
            "mt-3 overflow-hidden rounded-[28px] border border-brand-700/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,252,245,0.96))] shadow-[0_18px_40px_rgba(25,56,28,0.1)] transition-all duration-300 md:hidden",
            open ? "max-h-[420px] p-3 opacity-100" : "max-h-0 border-transparent p-0 opacity-0"
          )}
        >
          {open ? (
            <>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300",
                      pathname === item.href
                        ? "bg-brand-100 text-brand-800"
                        : "text-ink/72 hover:bg-brand-50 hover:text-brand-700"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Link href="/checkout" onClick={() => setOpen(false)} className="mt-3 block">
                <Button className="w-full">Pesan Sekarang</Button>
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
