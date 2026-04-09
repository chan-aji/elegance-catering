import { CategorySection, CtaSection } from "@/components/site/showcase-sections";
import { SecondaryHero } from "@/components/site/secondary-hero";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SiteShell } from "@/components/site/site-shell";
import { WhatsappFloat } from "@/components/site/whatsapp-float";
import { getSiteContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PaketPage() {
  const { categories, settings } = await getSiteContent();

  return (
    <SiteShell>
      <SiteHeader settings={settings} />
      <SecondaryHero
        label="Paket"
        title="Catering harian sampai event kantor, semuanya fleksibel."
        description="Pilih paket rutin sehat atau kebutuhan event dengan setup yang lebih premium."
        image={categories[0]?.image}
      />
      <CategorySection categories={categories} />
      <CtaSection settings={settings} />
      <SiteFooter settings={settings} />
      <WhatsappFloat whatsapp={settings?.whatsapp} />
    </SiteShell>
  );
}
