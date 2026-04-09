"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/shared/button";
import { FallbackImage } from "@/components/shared/fallback-image";
import { Input, Textarea } from "@/components/shared/field";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { getMenuImage } from "@/lib/media";
import { formatCurrency } from "@/lib/utils";
import { Category, MenuItem } from "@/types";

type FormState = {
  id?: string;
  categoryId: string;
  name: string;
  description: string;
  price: string;
  image: string;
  badge: string;
  calories: string;
  sortOrder: string;
  active: boolean;
  featured: boolean;
};

const initialState: FormState = {
  categoryId: "",
  name: "",
  description: "",
  price: "",
  image: "",
  badge: "",
  calories: "",
  sortOrder: "0",
  active: true,
  featured: true
};

export function MenuManager({
  categories,
  menuItems
}: {
  categories: Category[];
  menuItems: MenuItem[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(initialState);

  function resetForm() {
    setForm(initialState);
  }

  async function submitForm() {
    if (!form.name.trim()) {
      toast.error("Nama menu wajib diisi.");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Deskripsi wajib diisi.");
      return;
    }

    if (!form.image.trim()) {
      toast.error("Gambar menu wajib diupload.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      toast.error("Harga belum valid. Masukkan angka lebih dari 0.");
      return;
    }

    const payload = {
      categoryId: form.categoryId || null,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      image: form.image.trim(),
      badge: form.badge.trim() || null,
      calories: form.calories ? Number(form.calories) : null,
      sortOrder: Number(form.sortOrder || 0),
      active: form.active,
      featured: form.featured
    };

    const endpoint = form.id ? `/api/admin/menu/${form.id}` : "/api/admin/menu";
    const method = form.id ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      toast.error(result?.error || "Gagal menyimpan menu.");
      return;
    }

    toast.success(form.id ? "Menu berhasil diupdate." : "Menu berhasil ditambahkan.");
    resetForm();
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[430px_1fr]">
        <div className="rounded-[26px] border border-white/70 bg-[linear-gradient(180deg,#fbfdf8_0%,#f3f8ec_100%)] p-4 shadow-sm sm:p-5">
          <h3 className="font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-ink">
            {form.id ? "Edit Menu" : "Tambah Menu"}
          </h3>
          <p className="mt-1.5 text-[0.82rem] leading-5 text-ink/55 sm:text-sm">
            Upload foto produk, atur kategori, lalu simpan. Data tetap sinkron ke frontend customer.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-[172px_minmax(0,1fr)] sm:items-start">
            <ImageUploadField
              value={form.image}
              onChange={(value) => setForm((current) => ({ ...current, image: value }))}
              compact
              uploadType="menu"
            />
            <div className="space-y-3">
              <Field label="Nama Menu">
                <Input
                  className="h-11 px-3.5"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Kategori">
                  <select
                    className="h-11 w-full rounded-2xl border border-brand-700/10 bg-white px-3.5 text-sm text-ink shadow-sm outline-none transition-all duration-300 focus:-translate-y-0.5 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:shadow-[0_14px_30px_rgba(25,56,28,0.08)]"
                    value={form.categoryId}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, categoryId: event.target.value }))
                    }
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Harga">
                  <Input
                    className="h-11 px-3.5"
                    type="number"
                    value={form.price}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, price: event.target.value }))
                    }
                  />
                </Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Kalori">
                  <Input
                    className="h-11 px-3.5"
                    type="number"
                    value={form.calories}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, calories: event.target.value }))
                    }
                  />
                </Field>
                <Field label="Urutan">
                  <Input
                    className="h-11 px-3.5"
                    type="number"
                    value={form.sortOrder}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, sortOrder: event.target.value }))
                    }
                  />
                </Field>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-brand-700/8 bg-white px-3.5 py-2.5 text-[0.82rem] font-medium text-ink/78 shadow-sm">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, active: event.target.checked }))
                    }
                  />
                  Aktif
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-brand-700/8 bg-white px-3.5 py-2.5 text-[0.82rem] font-medium text-ink/78 shadow-sm">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, featured: event.target.checked }))
                    }
                  />
                  Featured
                </label>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
              <Field label="Deskripsi">
                <Textarea
                  className="min-h-[96px] px-3.5 py-3"
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                />
              </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Badge">
                <Input
                  className="h-11 px-3.5"
                  value={form.badge}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, badge: event.target.value }))
                  }
                />
              </Field>
              <div className="rounded-2xl border border-dashed border-brand-700/12 bg-white/55 px-3.5 py-3 text-[0.76rem] leading-5 text-ink/48">
                Gunakan badge singkat seperti <span className="font-semibold text-brand-700">Best Seller</span> atau <span className="font-semibold text-brand-700">Promo</span> agar card frontend tetap rapi.
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <Button
                disabled={isPending}
                className="px-4 py-2.5"
                onClick={() => startTransition(submitForm)}
              >
                {form.id ? "Update Menu" : "Tambah Menu"}
              </Button>
              <Button variant="secondary" className="px-4 py-2.5" onClick={resetForm}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {menuItems.map((item) => (
            <article key={item.id} className="rounded-[26px] border border-brand-700/10 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card">
              <div className="aspect-square overflow-hidden rounded-[20px] bg-brand-50">
                <FallbackImage
                  src={item.image}
                  fallbackSrc={getMenuImage(item.image, item.id)}
                  alt={item.name}
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3.5">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-700">
                  {item.categoryName ?? "Tanpa kategori"}
                </p>
                <h3 className="mt-2 font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/60">{item.description}</p>
                <div className="mt-3.5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-brand-800">
                    {formatCurrency(item.price)}
                  </span>
                  <span className="text-[0.82rem] text-ink/45">{item.calories ?? "-"} kcal</span>
                </div>
                <div className="mt-3.5 flex gap-2.5">
                  <Button
                    variant="secondary"
                    className="flex-1 px-3.5 py-2.5"
                    onClick={() =>
                      setForm({
                        id: item.id,
                        categoryId: item.categoryId ?? "",
                        name: item.name,
                        description: item.description,
                        price: String(item.price),
                        image: item.image,
                        badge: item.badge ?? "",
                        calories: item.calories ? String(item.calories) : "",
                        sortOrder: String(item.sortOrder),
                        active: item.active,
                        featured: item.featured
                      })
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 px-3.5 py-2.5"
                    onClick={() =>
                      startTransition(async () => {
                        await fetch(`/api/admin/menu/${item.id}`, { method: "DELETE" });
                        toast.success("Menu dihapus.");
                        router.refresh();
                      })
                    }
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.82rem] font-medium text-ink/68">{label}</span>
      {children}
    </label>
  );
}
