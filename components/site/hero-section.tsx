"use client";

import Link from "next/link";
import { CSSProperties } from "react";
import { ArrowRight, Leaf, ShieldCheck, Sparkles, TimerReset } from "lucide-react";
import { Button } from "@/components/shared/button";
import { FallbackImage } from "@/components/shared/fallback-image";
import { ParallaxLayer } from "@/components/shared/parallax-layer";
import { TextReveal } from "@/components/shared/text-reveal";
import { getHeroImage } from "@/lib/media";
import { Banner, SiteSettings } from "@/types";

export function HeroSection({
  settings,
  banner
}: {
  settings: SiteSettings | null;
  banner: Banner | null;
}) {
  const heroTitle = settings?.heroTitle ?? "Healthy Catering for Your Daily Needs";
  const headingLines =
    heroTitle === "Healthy Catering for Your Daily Needs"
      ? ["Healthy Catering", "for Your Daily Needs"]
      : [heroTitle];

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(190,224,193,0.32),transparent_25%),linear-gradient(135deg,#eef8ea_0%,#d9edd5_100%)] px-4 pb-12 pt-3 sm:px-6 lg:px-10 lg:pb-16 lg:pt-4">
      <ParallaxLayer
        speed={8}
        mobileFactor={0.14}
        className="pointer-events-none absolute -left-10 top-10 h-28 w-28 rounded-full bg-white/42 blur-3xl sm:h-40 sm:w-40"
      />
      <ParallaxLayer
        speed={13}
        mobileFactor={0.18}
        className="pointer-events-none absolute -right-10 bottom-12 h-32 w-32 rounded-full bg-brand-200/38 blur-3xl sm:h-48 sm:w-48"
      />
      <div className="grid items-center gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
        <ParallaxLayer speed={5} mobileFactor={0.12} className="max-w-[480px] lg:pb-2">
          <div
            className="hero-enter mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/78 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-700 shadow-card backdrop-blur sm:text-xs"
            style={{ "--delay": "0.02s" } as CSSProperties}
          >
            <Sparkles className="h-4 w-4" />
            Organic Healthy Catering
          </div>
          <TextReveal
            as="h1"
            lines={headingLines}
            delay={0.08}
            step={0.1}
            className="max-w-[13.5ch] font-display text-[2.1rem] font-semibold leading-[0.95] tracking-[-0.05em] text-ink sm:max-w-[12ch] sm:text-[2.85rem] lg:max-w-[11.6ch] lg:text-[3.7rem] [text-wrap:balance]"
            lineClassName="[text-wrap:balance]"
          />
          <p
            className="hero-enter mt-4 max-w-[400px] text-sm leading-6 text-ink/66 sm:text-[0.97rem] sm:leading-7"
            style={{ "--delay": "0.24s" } as CSSProperties}
          >
            {settings?.heroSubtitle ??
              "Makanan sehat, higienis, dan lezat untuk kebutuhan keluarga, kantor, dan acara istimewa."}
          </p>
          <div
            className="hero-enter mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center"
            style={{ "--delay": "0.34s" } as CSSProperties}
          >
            <Link href="/checkout">
              <Button
                className="w-full min-w-[168px] px-5 py-2.5 shadow-[0_18px_36px_rgba(30,73,33,0.18)] hover:shadow-[0_22px_42px_rgba(30,73,33,0.22)] sm:w-auto"
              >
                Pesan Sekarang
              </Button>
            </Link>
            <Link href="/menu">
              <Button
                variant="secondary"
                className="w-full min-w-[154px] border border-brand-700/10 bg-white/92 px-5 py-2.5 sm:w-auto"
              >
                Lihat Menu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div
            className="hero-enter mt-7 grid gap-3 sm:grid-cols-3"
            style={{ "--delay": "0.44s" } as CSSProperties}
          >
            <StatPill icon={<ShieldCheck className="h-4 w-4" />} label="Higienis" />
            <StatPill icon={<Leaf className="h-4 w-4" />} label="Fresh Daily" />
            <StatPill icon={<TimerReset className="h-4 w-4" />} label="Tepat Waktu" />
          </div>
          {banner ? (
            <div
              className="hero-enter mt-7 grid gap-3 rounded-[28px] border border-brand-700/10 bg-white/72 p-4 shadow-card sm:grid-cols-[1fr_auto] sm:items-center sm:p-5"
              style={{ "--delay": "0.52s" } as CSSProperties}
            >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                  Highlight
                </p>
                <div className="sm:col-span-2">
                <h2 className="font-display text-[1.45rem] font-semibold tracking-[-0.02em] text-ink sm:text-[1.6rem]">
                  {banner.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink/70">{banner.subtitle}</p>
                </div>
              </div>
            ) : null}
        </ParallaxLayer>
        <div
          className="hero-enter relative mx-auto w-full max-w-[620px] pt-1 lg:ml-auto lg:pt-0"
          style={{ "--delay": "0.18s" } as CSSProperties}
        >
          <ParallaxLayer
            speed={12}
            mobileFactor={0.14}
            className="absolute inset-x-12 bottom-10 h-16 rounded-full bg-brand-900/10 blur-2xl"
          />
          <ParallaxLayer
            speed={10}
            mobileFactor={0.15}
            className="pointer-events-none absolute left-8 top-6 h-24 w-24 rounded-full border border-white/30 bg-white/16 blur-2xl"
          />
          <ParallaxLayer speed={11} mobileFactor={0.18}>
            <div className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.74),rgba(255,255,255,0.18))] p-3 shadow-[0_24px_56px_rgba(24,58,28,0.15)] transition-transform duration-300 ease-out">
              <div className="rounded-[1.85rem] border border-white/45 bg-[linear-gradient(180deg,#eff5e2_0%,#e5f0d4_100%)] p-2">
                <div className="aspect-[5/4] overflow-hidden rounded-[1.4rem] bg-white/45 sm:aspect-[4/3]">
                <FallbackImage
                  src={banner?.image}
                  fallbackSrc={getHeroImage(banner?.image)}
                  alt="Premium healthy catering illustration"
                  width={720}
                  height={540}
                  priority
                  className="h-full w-full object-cover object-center transition duration-700 hover:scale-[1.015]"
                />
                </div>
              </div>
            </div>
          </ParallaxLayer>
          <div className="hero-enter absolute left-2 top-5 sm:left-0 sm:top-6" style={{ "--delay": "0.48s" } as CSSProperties}>
            <ParallaxLayer
              speed={6}
              mobileFactor={0.1}
              className="rounded-[22px] border border-white/75 bg-white/88 px-3 py-3 shadow-card backdrop-blur sm:rounded-[26px] sm:p-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700">
                Clean Prep
              </p>
              <p className="mt-1 text-[0.92rem] font-medium text-ink">Fresh ingredients daily</p>
            </ParallaxLayer>
          </div>
          <div className="hero-enter absolute bottom-4 right-2 sm:bottom-8 sm:right-4" style={{ "--delay": "0.56s" } as CSSProperties}>
            <ParallaxLayer
              speed={12}
              mobileFactor={0.14}
              className="rounded-[22px] bg-[linear-gradient(135deg,#2f7f34_0%,#3c9346_100%)] px-4 py-3 text-white shadow-[0_20px_38px_rgba(30,73,33,0.24)] sm:rounded-[26px] sm:px-5 sm:py-4"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">Fast Response</p>
              <p className="mt-1 text-[0.92rem] font-medium">Checkout dan WhatsApp otomatis</p>
            </ParallaxLayer>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatPill({
  icon,
  label
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/60 bg-white/72 px-4 py-3 shadow-card backdrop-blur transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex items-center gap-3 text-[0.92rem] font-medium text-ink">
        <span className="rounded-full bg-brand-100 p-2 text-brand-700">{icon}</span>
        {label}
      </div>
    </div>
  );
}
