import { AdminShell } from "@/components/admin/admin-shell";
import { ChartCard } from "@/components/admin/chart-card";
import { getReports } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminLaporanPage() {
  const reports = await getReports();

  return (
    <AdminShell title="Laporan" subtitle="Laporan harian dan bulanan dengan grafik performa order dan pendapatan.">
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Laporan Harian" data={reports.daily} />
        <ChartCard title="Laporan Bulanan" data={reports.monthly} />
      </div>
    </AdminShell>
  );
}
