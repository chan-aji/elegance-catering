import { CtaSection } from "@/components/site/showcase-sections";
import { SecondaryHero } from "@/components/site/secondary-hero";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SiteShell } from "@/components/site/site-shell";
import { WhatsappFloat } from "@/components/site/whatsapp-float";
import { getSiteContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function KontakPage() {
  const { categories, settings } = await getSiteContent();

  return (
    <SiteShell>
      <SiteHeader settings={settings} />
      <SecondaryHero
        label="Kontak"
        title="Hubungi tim catering kami untuk konsultasi menu dan jadwal."
        description="Kami siap bantu kebutuhan catering personal, kantor, dan event dengan respon cepat."
        image={categories[1]?.image ?? categories[0]?.image}
      />
      <CtaSection settings={settings} />
      <SiteFooter settings={settings} />
      <WhatsappFloat whatsapp={settings?.whatsapp} />
    </SiteShell>
  );
}
