import { AdminShell } from "@/components/admin/admin-shell";
import { formatCurrency } from "@/lib/utils";
import { getAllCustomers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminPelangganPage() {
  const customers = await getAllCustomers();

  return (
    <AdminShell title="Pelanggan" subtitle="Daftar pelanggan yang masuk dari checkout frontend.">
      <div className="overflow-hidden rounded-[28px] border border-brand-700/10">
        <table className="min-w-full divide-y divide-brand-700/10">
          <thead className="bg-[#f8fbf4]">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">Nama</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">WhatsApp</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">Email</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">Order</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-700/10 bg-white">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-5 py-4 text-sm text-ink">{customer.name}</td>
                <td className="px-5 py-4 text-sm text-ink/70">{customer.whatsapp}</td>
                <td className="px-5 py-4 text-sm text-ink/70">{customer.email ?? "-"}</td>
                <td className="px-5 py-4 text-sm text-ink/70">{customer.ordersCount}</td>
                <td className="px-5 py-4 text-sm font-medium text-brand-800">{formatCurrency(customer.totalSpent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
