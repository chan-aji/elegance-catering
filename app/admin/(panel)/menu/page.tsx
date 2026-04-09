import { AdminShell } from "@/components/admin/admin-shell";
import { MenuManager } from "@/components/admin/menu-manager";
import { getAllCategories, getAllMenuItems } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const [categories, menuItems] = await Promise.all([
    getAllCategories(),
    getAllMenuItems()
  ]);

  return (
    <AdminShell title="Kelola Menu" subtitle="Tambah, edit, hapus menu catering dan preview gambar 1:1.">
      <MenuManager categories={categories} menuItems={menuItems} />
    </AdminShell>
  );
}
