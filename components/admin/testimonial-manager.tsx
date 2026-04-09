"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/shared/button";
import { FallbackImage } from "@/components/shared/fallback-image";
import { Input, Textarea } from "@/components/shared/field";
import { getBannerImage } from "@/lib/media";
import { Testimonial } from "@/types";

type FormState = {
  id?: string;
  name: string;
  role: string;
  content: string;
  rating: string;
  avatar: string;
  active: boolean;
};

const initialState: FormState = {
  name: "",
  role: "",
  content: "",
  rating: "5",
  avatar: "",
  active: true
};

export function TestimonialManager({
  testimonials
}: {
  testimonials: Testimonial[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [isPending, startTransition] = useTransition();

  async function submitForm() {
    const endpoint = form.id
      ? `/api/admin/testimonials/${form.id}`
      : "/api/admin/testimonials";
    const method = form.id ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        role: form.role,
        content: form.content,
        rating: Number(form.rating),
        avatar: form.avatar || null,
        active: form.active
      })
    });

    if (!response.ok) {
      toast.error("Gagal menyimpan testimoni.");
      return;
    }

    toast.success(form.id ? "Testimoni diupdate." : "Testimoni ditambahkan.");
    setForm(initialState);
    router.refresh();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <div className="rounded-[26px] border border-white/70 bg-[linear-gradient(180deg,#fbfdf8_0%,#f3f8ec_100%)] p-4 shadow-sm sm:p-5">
        <h3 className="font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-ink">
          {form.id ? "Edit Testimoni" : "Tambah Testimoni"}
        </h3>
        <p className="mt-1.5 text-[0.82rem] leading-5 text-ink/55 sm:text-sm">
          Tambahkan testimonial pelanggan lengkap dengan avatar agar tampil lebih meyakinkan di frontend.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-[172px_minmax(0,1fr)] sm:items-start">
          <ImageUploadField
            value={form.avatar}
            onChange={(value) => setForm((current) => ({ ...current, avatar: value }))}
            compact
            uploadType="testimonial"
          />
          <div className="space-y-3">
            <Field label="Nama">
              <Input
                className="h-11 px-3.5"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
              />
            </Field>
            <Field label="Role">
              <Input
                className="h-11 px-3.5"
                value={form.role}
                onChange={(event) =>
                  setForm((current) => ({ ...current, role: event.target.value }))
                }
              />
            </Field>
            <Field label="Rating">
              <Input
                className="h-11 px-3.5"
                type="number"
                min="1"
                max="5"
                value={form.rating}
                onChange={(event) =>
                  setForm((current) => ({ ...current, rating: event.target.value }))
                }
              />
            </Field>
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
          <Field label="Isi Testimoni">
            <Textarea
              className="min-h-[110px] px-3.5 py-3"
              value={form.content}
              onChange={(event) =>
                setForm((current) => ({ ...current, content: event.target.value }))
              }
            />
          </Field>
          <div className="rounded-2xl border border-dashed border-brand-700/12 bg-white/55 px-3.5 py-3 text-[0.76rem] leading-5 text-ink/48">
            Avatar bersifat opsional, tetapi sangat membantu agar review di homepage terasa lebih profesional.
          </div>
          <div className="flex gap-2.5 pt-1">
            <Button
              disabled={isPending}
              className="px-4 py-2.5"
              onClick={() => startTransition(submitForm)}
            >
              {form.id ? "Update" : "Tambah"}
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
      <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
        {testimonials.map((item) => (
          <article
            key={item.id}
            className="rounded-[26px] border border-brand-700/10 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-brand-50">
                <FallbackImage
                  src={item.avatar}
                  fallbackSrc={getBannerImage(item.avatar)}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-700">
                  {"★★★★★".slice(0, item.rating)}
                </p>
                <h3 className="mt-1 font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">
                  {item.name}
                </h3>
              </div>
            </div>
            <p className="mt-1 text-sm text-ink/50">{item.role}</p>
            <p className="mt-3 text-sm leading-6 text-ink/65">{item.content}</p>
            <div className="mt-3.5 flex gap-2.5">
              <Button
                variant="secondary"
                className="flex-1 px-3.5 py-2.5"
                onClick={() =>
                  setForm({
                    id: item.id,
                    name: item.name,
                    role: item.role,
                    content: item.content,
                    rating: String(item.rating),
                    avatar: item.avatar ?? "",
                    active: item.active
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
                    await fetch(`/api/admin/testimonials/${item.id}`, { method: "DELETE" });
                    toast.success("Testimoni dihapus.");
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
