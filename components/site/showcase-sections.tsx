import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Leaf,
  ShieldCheck,
  Sparkles,
  WalletCards
} from "lucide-react";
import { Button } from "@/components/shared/button";
import { FallbackImage } from "@/components/shared/fallback-image";
import { ParallaxLayer } from "@/components/shared/parallax-layer";
import { Reveal } from "@/components/shared/reveal";
import { TextReveal } from "@/components/shared/text-reveal";
import { getBannerImage, getCategoryImage } from "@/lib/media";
import { getInitials } from "@/lib/utils";
import { Category, SiteSettings, Testimonial } from "@/types";

export function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <section className="px-4 pb-10 sm:px-6 lg:px-10">
      <div className="grid gap-5 lg:grid-cols-2">
        {categories.map((category, index) => (
          <Reveal key={category.id} delay={0.06 * (index + 1)}>
            <article className="relative overflow-hidden rounded-[34px] border border-brand-700/8 bg-[linear-gradient(135deg,#eef8e8_0%,#dceecf_100%)] p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_44px_rgba(25,56,28,0.12)] sm:p-6">
              <ParallaxLayer
                speed={12}
                mobileFactor={0.24}
                className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-white/25 blur-3xl"
              />
              <div className="grid items-center gap-5 md:grid-cols-[0.8fr_1fr]">
                <ParallaxLayer speed={10} mobileFactor={0.2}>
                  <div className="rounded-[30px] bg-white/65 p-4 shadow-sm ring-1 ring-white/65">
                    <FallbackImage
                      src={category.image}
                      fallbackSrc={getCategoryImage(category.image, category.type, category.id)}
                      alt={category.name}
                      width={640}
                      height={420}
                      className="aspect-[5/4] h-full w-full object-cover sm:aspect-[4/3]"
                    />
                  </div>
                </ParallaxLayer>
                <div className="relative">
                  <TextReveal
                    as="p"
                    lines={[index === 0 ? "Daily Catering" : "Event Catering"]}
                    delay={0.05}
                    soft
                    className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-700 sm:text-xs"
                  />
                  <TextReveal
                    as="h3"
                    lines={[category.name]}
                    delay={0.11}
                    className="mt-3 font-display text-[1.7rem] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[2rem]"
                  />
                  <TextReveal
                    as="p"
                    lines={[category.description]}
                    delay={0.18}
                    soft
                    className="mt-3 max-w-[360px] text-sm leading-6 text-ink/70 sm:leading-7"
                  />
                  <Link href="/paket" className="mt-6 inline-block">
                    <Button variant="secondary" className="border border-brand-700/10 bg-white">
                      Pilih Paket
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function AdvantagesSection() {
  const items = [
    {
      title: "Fresh",
      icon: Leaf,
      text: "Bahan segar harian dengan komposisi sehat dan rasa yang tetap comfort."
    },
    {
      title: "Higienis",
      icon: ShieldCheck,
      text: "Standar persiapan bersih, terukur, dan konsisten untuk kebutuhan harian maupun event."
    },
    {
      title: "Tepat waktu",
      icon: Clock3,
      text: "Produksi dan pengiriman diatur agar tiba rapi sesuai jadwal rumah atau kantor."
    },
    {
      title: "Terjangkau",
      icon: WalletCards,
      text: "Pilihan paket fleksibel dengan kualitas presentasi yang tetap premium."
    }
  ];

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="rounded-[38px] bg-white p-6 shadow-card sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <TextReveal
              as="p"
              lines={["Keunggulan"]}
              delay={0.04}
              soft
              className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700"
            />
            <TextReveal
              as="h2"
              lines={["Value bisnis yang terasa", "premium, rapi, dan konsisten."]}
              delay={0.08}
              step={0.08}
              className="mt-2 font-display text-[1.95rem] font-semibold tracking-[-0.03em] text-ink sm:text-[2.45rem]"
            />
          </div>
          <TextReveal
            as="p"
            lines={[
              "Kami menjaga keseimbangan antara tampilan makanan, kualitas bahan, dan pengalaman order supaya brand catering Anda terasa profesional sejak kunjungan pertama."
            ]}
            delay={0.18}
            soft
            className="max-w-[620px] text-sm leading-6 text-ink/64 sm:leading-7"
          />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.05 * (index + 1)}>
                <div className="group rounded-[28px] border border-brand-700/8 bg-[#f8fbf4] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <div className="inline-flex rounded-full bg-white p-3 text-brand-700 shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function TestimonialSection({
  testimonials
}: {
  testimonials: Testimonial[];
}) {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="rounded-[38px] bg-[#f7f2e7] p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <TextReveal
              as="p"
              lines={["Testimoni"]}
              delay={0.04}
              soft
              className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700"
            />
            <TextReveal
              as="h2"
              lines={["Dipercaya untuk kebutuhan", "harian sampai event profesional."]}
              delay={0.08}
              step={0.08}
              className="mt-2 font-display text-[1.95rem] font-semibold tracking-[-0.03em] text-ink sm:text-[2.45rem]"
            />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Review pelanggan nyata
          </div>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={0.06 * (index + 1)}>
              <article className="rounded-[28px] bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_rgba(25,56,28,0.12)]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-semibold text-brand-700">
                      {testimonial.avatar ? (
                        <FallbackImage
                          src={testimonial.avatar}
                          fallbackSrc={getBannerImage(testimonial.avatar)}
                          alt={testimonial.name}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitials(testimonial.name)
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-ink sm:text-[0.98rem]">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-ink/55">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                    5.0
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-ink/72 sm:text-[0.97rem]">
                  {testimonial.content}
                </p>
                <div className="mt-5 text-sm font-semibold tracking-[0.25em] text-brand-700">
                  {"★★★★★".slice(0, testimonial.rating)}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection({ settings }: { settings: SiteSettings | null }) {
  return (
    <section id="kontak" className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="relative grid gap-5 overflow-hidden rounded-[38px] bg-[linear-gradient(135deg,#2f7f34_0%,#27692b_100%)] px-5 py-7 text-white shadow-soft sm:px-6 sm:py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <ParallaxLayer
          speed={16}
          mobileFactor={0.24}
          className="pointer-events-none absolute -right-14 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"
        />
        <ParallaxLayer speed={8} mobileFactor={0.18}>
          <div>
            <TextReveal
              as="p"
              lines={["Konsultasi Menu"]}
              delay={0.04}
              soft
              className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70"
            />
            <TextReveal
              as="h2"
              lines={["Siapkan catering sehat yang", "terlihat premium sejak order pertama."]}
              delay={0.08}
              step={0.08}
              className="mt-3 font-display text-[1.95rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[2.45rem]"
            />
            <TextReveal
              as="p"
              lines={[
                "Tim kami siap bantu menyusun menu, budget, jadwal pengiriman, dan kebutuhan event atau kantor dengan proses yang cepat."
              ]}
              delay={0.18}
              soft
              className="mt-4 max-w-[520px] text-sm leading-6 text-white/78 sm:text-base sm:leading-7"
            />
          </div>
        </ParallaxLayer>
        <ParallaxLayer speed={12} mobileFactor={0.2}>
          <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard label="WhatsApp" value={settings?.whatsapp ?? "-"} />
              <InfoCard label="Email" value={settings?.email ?? "-"} />
            </div>
            <div className="mt-4 rounded-[24px] bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">Alamat</p>
              <p className="mt-2 text-sm leading-6 text-white/88">{settings?.address ?? "-"}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/checkout">
                <Button className="w-full bg-white text-brand-800 hover:bg-brand-100 sm:w-auto">
                  Pesan Sekarang
                </Button>
              </Link>
              <a href={`https://wa.me/${settings?.whatsapp ?? ""}`} target="_blank" rel="noreferrer">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 sm:w-auto"
                >
                  WhatsApp Admin
                </Button>
              </a>
            </div>
          </div>
        </ParallaxLayer>
      </div>
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-white/10 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-white/50">{label}</p>
      <p className="mt-2 text-sm font-medium text-white sm:text-[0.96rem]">{value}</p>
    </div>
  );
}
