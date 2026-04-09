import { AdminShell } from "@/components/admin/admin-shell";
import { OrdersManager } from "@/components/admin/orders-manager";
import { getAllOrders } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminPesananPage() {
  const orders = await getAllOrders();

  return (
    <AdminShell title="Pesanan" subtitle="Pantau seluruh order customer, detail item, dan ubah status secara langsung.">
      <OrdersManager orders={orders} />
    </AdminShell>
  );
}
