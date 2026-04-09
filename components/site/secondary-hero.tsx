import { FallbackImage } from "@/components/shared/fallback-image";
import { ParallaxLayer } from "@/components/shared/parallax-layer";
import { getSecondaryHeroImage } from "@/lib/media";

export function SecondaryHero({
  label,
  title,
  description,
  image
}: {
  label: string;
  title: string;
  description: string;
  image?: string | null;
}) {
  return (
    <section className="bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_42%),linear-gradient(135deg,#eef8ea_0%,#dcedd8_100%)] px-4 py-12 sm:px-6 lg:px-10">
      <div className="grid items-center gap-6 lg:grid-cols-[0.95fr_0.8fr] lg:gap-8">
        <ParallaxLayer speed={8} mobileFactor={0.18} className="max-w-[720px]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            {label}
          </p>
          <h1 className="mt-3 font-display text-[2.1rem] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[2.9rem]">
            {title}
          </h1>
          <p className="mt-4 max-w-[42rem] text-sm leading-6 text-ink/70 sm:text-base sm:leading-7">
            {description}
          </p>
        </ParallaxLayer>
        <ParallaxLayer speed={12} mobileFactor={0.22}>
          <div className="overflow-hidden rounded-[32px] border border-white/80 bg-white/60 p-3 shadow-card">
            <div className="aspect-[5/4] overflow-hidden rounded-[24px] bg-white/70 sm:aspect-[4/3]">
              <FallbackImage
                src={image}
                fallbackSrc={getSecondaryHeroImage(label)}
                alt={title}
                width={640}
                height={420}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </ParallaxLayer>
      </div>
    </section>
  );
}
