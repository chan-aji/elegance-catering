import { AdminShell } from "@/components/admin/admin-shell";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <AdminShell title="Settings" subtitle="Kelola logo, warna, hero text, WhatsApp, dan informasi kontak.">
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
