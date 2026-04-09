import { HeroSection } from "@/components/site/hero-section";
import { MenuSection } from "@/components/site/menu-section";
import {
  AdvantagesSection,
  CategorySection,
  CtaSection,
  TestimonialSection
} from "@/components/site/showcase-sections";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SiteShell } from "@/components/site/site-shell";
import { WhatsappFloat } from "@/components/site/whatsapp-float";
import { Reveal } from "@/components/shared/reveal";
import { getSiteContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { banner, categories, menuItems, settings, testimonials } =
    await getSiteContent();

  return (
    <SiteShell>
      <SiteHeader settings={settings} />
      <HeroSection settings={settings} banner={banner} />
      <Reveal delay={0.04}>
        <MenuSection items={menuItems.slice(0, 4)} />
      </Reveal>
      <Reveal delay={0.06}>
        <CategorySection categories={categories} />
      </Reveal>
      <Reveal delay={0.08}>
        <AdvantagesSection />
      </Reveal>
      <Reveal delay={0.1}>
        <TestimonialSection testimonials={testimonials} />
      </Reveal>
      <Reveal delay={0.12}>
        <CtaSection settings={settings} />
      </Reveal>
      <SiteFooter settings={settings} />
      <WhatsappFloat whatsapp={settings?.whatsapp} />
    </SiteShell>
  );
}
