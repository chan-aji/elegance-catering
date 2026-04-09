import { AdvantagesSection, CtaSection } from "@/components/site/showcase-sections";
import { SecondaryHero } from "@/components/site/secondary-hero";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SiteShell } from "@/components/site/site-shell";
import { WhatsappFloat } from "@/components/site/whatsapp-float";
import { getSiteContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function TentangPage() {
  const { banner, settings } = await getSiteContent();

  return (
    <SiteShell>
      <SiteHeader settings={settings} />
      <SecondaryHero
        label="Tentang Kami"
        title="Brand catering sehat dengan visual modern dan service cepat."
        description={settings?.aboutText ?? ""}
        image={banner?.image}
      />
      <AdvantagesSection />
      <CtaSection settings={settings} />
      <SiteFooter settings={settings} />
      <WhatsappFloat whatsapp={settings?.whatsapp} />
    </SiteShell>
  );
}
