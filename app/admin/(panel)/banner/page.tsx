import { AdminShell } from "@/components/admin/admin-shell";
import { BannerManager } from "@/components/admin/banner-manager";
import { getAllBanners } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminBannerPage() {
  const banners = await getAllBanners();

  return (
    <AdminShell title="Banner" subtitle="Hero section editable dan banner promosi untuk homepage.">
      <BannerManager banners={banners} />
    </AdminShell>
  );
}
