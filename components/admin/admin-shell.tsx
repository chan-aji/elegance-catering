"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import {
  BarChart3,
  LayoutDashboard,
  Layers3,
  Menu,
  MessageSquareQuote,
  PanelLeftClose,
  PackageSearch,
  ReceiptText,
  Settings,
  ShoppingBasket,
  Users
} from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Menu", icon: ShoppingBasket },
  { href: "/admin/kategori", label: "Kategori", icon: Layers3 },
  { href: "/admin/pesanan", label: "Pesanan", icon: ReceiptText },
  { href: "/admin/pelanggan", label: "Pelanggan", icon: Users },
  { href: "/admin/testimoni", label: "Testimoni", icon: MessageSquareQuote },
  { href: "/admin/banner", label: "Banner", icon: PackageSearch },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/laporan", label: "Laporan", icon: BarChart3 }
];

export function AdminShell({
  children,
  title,
  subtitle
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#edf5ea]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-brand-700/10 bg-brand-800 px-4 py-4 text-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/55">Admin Panel</p>
              <h1 className="mt-2 font-display text-[1.6rem] font-semibold tracking-[-0.02em] lg:text-[1.9rem]">
                CATRING
              </h1>
              <p className="mt-3 hidden max-w-[210px] text-sm leading-6 text-white/60 lg:block">
                Kelola menu, order, pelanggan, dan konten website catering Anda.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white transition hover:bg-white/15 lg:hidden"
              aria-label={open ? "Tutup menu admin" : "Buka menu admin"}
            >
              {open ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          <nav className={cn("mt-5 space-y-2 lg:mt-10", open ? "block" : "hidden lg:block")}>
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-[0.94rem] font-medium transition",
                    pathname === item.href || (item.href === "/admin/dashboard" && pathname === "/admin")
                      ? "bg-white text-brand-800 shadow-card"
                      : "text-white/78 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className={cn("mt-6 lg:mt-8", open ? "block" : "hidden lg:block")}>
            <LogoutButton />
          </div>
        </aside>
        <main className="px-3 py-4 sm:px-5 sm:py-5 lg:px-8">
          <div className="rounded-[32px] bg-white p-6 shadow-card sm:p-8">
            <div className="mb-8 flex flex-col gap-2 border-b border-brand-700/10 pb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">
                Admin Dashboard
              </p>
              <h2 className="font-display text-[1.7rem] font-semibold tracking-[-0.03em] text-ink sm:text-[2.15rem]">
                {title}
              </h2>
              <p className="max-w-[780px] text-sm leading-6 text-ink/60">{subtitle}</p>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
