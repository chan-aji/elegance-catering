import { BarChart3, ReceiptText, ShoppingBasket, Users } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { formatCurrency } from "@/lib/utils";
import { getDashboardSummary } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { chartData, latestOrders, stats } = await getDashboardSummary();

  return (
    <AdminShell
      title="Dashboard Overview"
      subtitle="Ringkasan pesanan, pendapatan, dan performa catering secara real-time."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Order" value={String(stats.totalOrders)} icon={<ReceiptText className="h-5 w-5" />} />
        <StatCard label="Pendapatan" value={formatCurrency(stats.totalRevenue)} icon={<BarChart3 className="h-5 w-5" />} accent="bg-[#e8f5e9] text-brand-700" />
        <StatCard label="Pelanggan" value={String(stats.customers)} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Menu Aktif" value={String(stats.menuCount)} icon={<ShoppingBasket className="h-5 w-5" />} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <ChartCard title="Grafik Pendapatan" data={chartData} />
        <div className="rounded-[28px] border border-brand-700/10 bg-[#f8fbf4] p-5 shadow-sm">
          <h3 className="font-display text-2xl font-semibold text-ink">Pesanan Terbaru</h3>
          <div className="mt-5 space-y-3">
            {latestOrders.map((order) => (
              <div key={order.id} className="rounded-2xl bg-white px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                      {order.code}
                    </p>
                    <h4 className="mt-1 font-medium text-ink">{order.customerName}</h4>
                  </div>
                  <p className="text-sm font-semibold text-ink">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </div>
            ))}
            {latestOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-brand-700/20 bg-white px-4 py-8 text-center text-ink/60">
                Belum ada order terbaru.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
