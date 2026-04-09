"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/shared/button";
import { FallbackImage } from "@/components/shared/fallback-image";
import { Input, Textarea } from "@/components/shared/field";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { getCategoryImage } from "@/lib/media";
import { Category } from "@/types";

type FormState = {
  id?: string;
  name: string;
  description: string;
  image: string;
  type: string;
  sortOrder: string;
  active: boolean;
};

const initialState: FormState = {
  name: "",
  description: "",
  image: "",
  type: "",
  sortOrder: "0",
  active: true
};

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [isPending, startTransition] = useTransition();

  async function submitForm() {
    const endpoint = form.id
      ? `/api/admin/categories/${form.id}`
      : "/api/admin/categories";
    const method = form.id ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        image: form.image,
        type: form.type,
        sortOrder: Number(form.sortOrder || 0),
        active: form.active
      })
    });

    if (!response.ok) {
      toast.error("Gagal menyimpan kategori.");
      return;
    }

    toast.success(form.id ? "Kategori diupdate." : "Kategori ditambahkan.");
    setForm(initialState);
    router.refresh();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <div className="rounded-[26px] border border-white/70 bg-[linear-gradient(180deg,#fbfdf8_0%,#f3f8ec_100%)] p-4 shadow-sm sm:p-5">
        <h3 className="font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-ink">
          {form.id ? "Edit Kategori" : "Tambah Kategori"}
        </h3>
        <p className="mt-1.5 text-[0.82rem] leading-5 text-ink/55 sm:text-sm">
          Atur kategori menu dan paket agar tampil rapi di frontend dengan visual yang konsisten.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-[172px_minmax(0,1fr)] sm:items-start">
          <ImageUploadField
            value={form.image}
            onChange={(value) => setForm((current) => ({ ...current, image: value }))}
            compact
            uploadType="category"
          />
          <div className="space-y-3">
            <Field label="Nama Kategori">
              <Input
                className="h-11 px-3.5"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
              />
            </Field>            
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Type">
                <Input
                  className="h-11 px-3.5"
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, type: event.target.value }))
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
          <div className="rounded-2xl border border-dashed border-brand-700/12 bg-white/55 px-3.5 py-3 text-[0.76rem] leading-5 text-ink/48">
            Gunakan nama kategori singkat dan jelas, misalnya <span className="font-semibold text-brand-700">Catering Harian</span> atau <span className="font-semibold text-brand-700">Catering Event</span>.
          </div>
          <div className="flex flex-wrap gap-2.5 pt-1">
            <Button
              disabled={isPending}
              className="px-4 py-2.5"
              onClick={() => startTransition(submitForm)}
            >
              {form.id ? "Update Kategori" : "Tambah Kategori"}
            </Button>
            <Button
              variant="secondary"
              className="px-4 py-2.5"
              onClick={() => setForm(initialState)}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
      <div className="grid gap-3.5 md:grid-cols-2">
        {categories.map((category) => (
          <article
            key={category.id}
            className="rounded-[26px] border border-brand-700/10 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
          >
            <div className="aspect-[1.45/1] overflow-hidden rounded-[20px] bg-brand-50">
              <FallbackImage
                src={category.image}
                fallbackSrc={getCategoryImage(category.image, category.type, category.id)}
                alt={category.name}
                width={720}
                height={520}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-3.5 flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-700">
                  {category.type || "Kategori"}
                </p>
                <h3 className="mt-1.5 font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">
                  {category.name}
                </h3>
              </div>
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[0.72rem] font-semibold text-brand-700">
                {category.active ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-ink/60">{category.description}</p>
            <div className="mt-3.5 flex items-center justify-between text-[0.78rem] text-ink/48">
              <span>Urutan: {category.sortOrder}</span>
              <span>ID: {category.id.slice(0, 8)}</span>
            </div>
            <div className="mt-3.5 flex gap-2.5">
              <Button
                variant="secondary"
                className="flex-1 px-3.5 py-2.5"
                onClick={() =>
                  setForm({
                    id: category.id,
                    name: category.name,
                    description: category.description ?? "",
                    image: category.image ?? "",
                    type: category.type ?? "",
                    sortOrder: String(category.sortOrder),
                    active: category.active
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
                    await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
                    toast.success("Kategori dihapus.");
                    router.refresh();
                  })
                }
              >
                Hapus
              </Button>
            </div>
          </article>
        ))}
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
