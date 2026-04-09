import { MenuSection } from "@/components/site/menu-section";
import { SecondaryHero } from "@/components/site/secondary-hero";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SiteShell } from "@/components/site/site-shell";
import { WhatsappFloat } from "@/components/site/whatsapp-float";
import { getSiteContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const { menuItems, settings } = await getSiteContent();

  return (
    <SiteShell>
      <SiteHeader settings={settings} />
      <SecondaryHero
        label="Menu Catering"
        title="Pilihan menu sehat yang siap dipesan setiap hari."
        description="Semua menu langsung terhubung ke sistem cart dan checkout WhatsApp."
        image={menuItems[0]?.image}
      />
      <MenuSection items={menuItems} />
      <SiteFooter settings={settings} />
      <WhatsappFloat whatsapp={settings?.whatsapp} />
    </SiteShell>
  );
}
