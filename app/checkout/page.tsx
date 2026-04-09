import { CheckoutForm } from "@/components/site/checkout-form";
import { SecondaryHero } from "@/components/site/secondary-hero";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SiteShell } from "@/components/site/site-shell";
import { WhatsappFloat } from "@/components/site/whatsapp-float";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const settings = await getSettings();

  return (
    <SiteShell>
      <SiteHeader settings={settings} />
      <SecondaryHero
        label="Checkout"
        title="Lengkapi detail pesanan dan kirim otomatis ke WhatsApp admin."
        description="Form checkout ini akan menyimpan order ke dashboard admin dan membuka WhatsApp secara otomatis."
      />
      <section className="px-4 py-10 sm:px-6 lg:px-10">
        <CheckoutForm settings={settings} />
      </section>
      <SiteFooter settings={settings} />
      <WhatsappFloat whatsapp={settings?.whatsapp} />
    </SiteShell>
  );
}
