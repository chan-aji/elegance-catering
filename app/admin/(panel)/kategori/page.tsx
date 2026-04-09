import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryManager } from "@/components/admin/category-manager";
import { getAllCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminKategoriPage() {
  const categories = await getAllCategories();

  return (
    <AdminShell title="Kelola Kategori" subtitle="Atur kategori menu yang tampil pada frontend dan paket catering.">
      <CategoryManager categories={categories} />
    </AdminShell>
  );
}
