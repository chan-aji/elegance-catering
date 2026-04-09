import Link from "next/link";
import { SiteSettings } from "@/types";

export function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  return (
    <footer className="bg-brand-800 px-4 py-12 text-white sm:px-6 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.9fr_0.9fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold tracking-[0.18em] text-brand-800">
              CT
            </span>
            <h3 className="font-display text-[1.35rem] font-semibold tracking-[-0.02em]">
              {settings?.logoText ?? "CATRING"}
            </h3>
          </div>
          <p className="mt-4 max-w-[360px] text-sm leading-6 text-white/70 sm:leading-7">
            {settings?.aboutText ??
              "Catering sehat modern untuk kebutuhan harian, kantor, dan event dengan presentasi rapi serta rasa yang konsisten."}
          </p>
        </div>
        <div>
          <h3 className="font-display text-[1.15rem] font-semibold tracking-[-0.02em]">
            Navigasi
          </h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/70">
            <Link href="/">Home</Link>
            <Link href="/menu">Menu</Link>
            <Link href="/paket">Paket</Link>
            <Link href="/tentang">Tentang</Link>
          </div>
        </div>
        <div>
          <h3 className="font-display text-[1.15rem] font-semibold tracking-[-0.02em]">
            Kontak
          </h3>
          <div className="mt-3 space-y-2 text-sm text-white/70">
            <p>WhatsApp: {settings?.whatsapp ?? "-"}</p>
            <p>Email: {settings?.email ?? "-"}</p>
            <p>Alamat: {settings?.address ?? "-"}</p>
          </div>
        </div>
        <div>
          <h3 className="font-display text-[1.15rem] font-semibold tracking-[-0.02em]">
            Layanan
          </h3>
          <div className="mt-3 space-y-2 text-sm text-white/70">
            <p>Catering Harian</p>
            <p>Catering Event</p>
            <p>Corporate Meal Plan</p>
            <p>Snack Box Sehat</p>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-5 text-sm text-white/50">
        (c) 2026 {settings?.siteName ?? "Catring Healthy Catering"}. All rights reserved.
      </div>
    </footer>
  );
}
