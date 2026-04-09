"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { FallbackImage } from "@/components/shared/fallback-image";
import { Reveal } from "@/components/shared/reveal";
import { TextReveal } from "@/components/shared/text-reveal";
import { toast } from "sonner";
import { Button } from "@/components/shared/button";
import { getMenuImage } from "@/lib/media";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { MenuItem } from "@/types";

export function MenuSection({ items }: { items: MenuItem[] }) {
  const { addItem, openCart } = useCart();

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-[620px] text-center">
        <TextReveal
          as="p"
          lines={["Our Products"]}
          delay={0.04}
          soft
          className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-700 sm:text-xs"
        />
        <TextReveal
          as="h2"
          lines={["Menu sehat dengan", "tampilan premium"]}
          delay={0.08}
          step={0.08}
          className="mt-2 font-display text-[1.62rem] font-semibold tracking-[-0.03em] text-ink sm:text-[1.95rem]"
        />
        <TextReveal
          as="p"
          lines={[
            "Kurasi paket catering harian dan event dengan plating rapi, komposisi seimbang, dan rasa yang tetap nyaman untuk rutinitas."
          ]}
          delay={0.18}
          soft
          className="mt-2 text-[0.9rem] leading-5 text-ink/65 sm:text-[0.92rem] sm:leading-6"
        />
      </div>
      <div className="mt-7 grid gap-3.5 sm:mt-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-4">
        {items.map((item, index) => (
          <Reveal key={item.id} delay={Math.min(0.08 * ((index % 4) + 1), 0.24)}>
            <article className="group mx-auto flex h-full w-full max-w-[270px] flex-col rounded-[22px] border border-white/70 bg-[linear-gradient(180deg,#f6f1e6_0%,#f4efe3_100%)] p-3 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(25,56,28,0.1)] sm:max-w-none">
              <div className="overflow-hidden rounded-[18px] bg-white/80 ring-1 ring-black/5">
                <FallbackImage
                  src={item.image}
                  fallbackSrc={getMenuImage(item.image, item.id)}
                  alt={item.name}
                  width={800}
                  height={800}
                  className="aspect-square h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col px-0.5 pb-0.5 pt-2.5">
                {item.badge ? (
                  <span className="w-fit rounded-full border border-white/70 bg-white/78 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-700 shadow-sm">
                    {item.badge}
                  </span>
                ) : null}
                <h3 className="mt-2 font-display text-[1rem] font-semibold tracking-[-0.02em] text-ink sm:text-[1.05rem]">
                  {item.name}
                </h3>
                <p className="mt-1 line-clamp-3 min-h-[50px] text-[0.8rem] leading-5 text-ink/65">
                  {item.description}
                </p>
                <div className="mt-auto pt-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[0.92rem] font-semibold tracking-[-0.02em] text-brand-800 sm:text-[0.98rem]">
                      {formatCurrency(item.price)}
                    </p>
                    {item.calories ? (
                      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-ink/45 sm:text-[10px]">
                        {item.calories} kcal
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
                    <Button
                      className="w-full flex-1 px-3.5 py-2.25 text-[0.76rem]"
                      onClick={() => {
                        addItem(item);
                        toast.success(`${item.name} ditambahkan ke keranjang.`);
                      }}
                    >
                      Tambah ke Keranjang
                    </Button>
                    <Link href="/checkout" className="w-full flex-1">
                      <Button
                        variant="secondary"
                        className="w-full border border-brand-700/10 bg-white px-3.5 py-2.25 text-[0.76rem]"
                        onClick={() => {
                          addItem(item);
                          openCart();
                        }}
                      >
                        Pesan
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      {items.length === 0 ? (
        <div className="mt-6 rounded-[24px] border border-dashed border-brand-700/20 bg-white px-6 py-9 text-center text-sm text-ink/60">
          Belum ada menu tersedia saat ini.
        </div>
      ) : null}
      <div className="mt-3.5 flex justify-center">
        <button
          onClick={openCart}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-700/10 bg-white px-4 py-2.5 text-[0.8rem] font-semibold text-ink shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50"
        >
          <ShoppingBag className="h-4 w-4 text-brand-700" />
          Lihat Keranjang
        </button>
      </div>
    </section>
  );
}
