"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/shared/button";
import { FallbackImage } from "@/components/shared/fallback-image";
import { Input, Textarea } from "@/components/shared/field";
import { getBannerImage } from "@/lib/media";
import { Banner } from "@/types";

type FormState = {
  id?: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  image: string;
  active: boolean;
};

const initialState: FormState = {
  title: "",
  subtitle: "",
  buttonText: "",
  buttonHref: "",
  image: "",
  active: true
};

export function BannerManager({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [isPending, startTransition] = useTransition();

  async function submitForm() {
    const endpoint = form.id ? `/api/admin/banners/${form.id}` : "/api/admin/banners";
    const method = form.id ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      toast.error("Gagal menyimpan banner.");
      return;
    }

    toast.success(form.id ? "Banner diupdate." : "Banner ditambahkan.");
    setForm(initialState);
    router.refresh();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <div className="rounded-[26px] border border-white/70 bg-[linear-gradient(180deg,#fbfdf8_0%,#f3f8ec_100%)] p-4 shadow-sm sm:p-5">
        <h3 className="font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-ink">
          {form.id ? "Edit Banner" : "Tambah Banner"}
        </h3>
        <p className="mt-1.5 text-[0.82rem] leading-5 text-ink/55 sm:text-sm">
          Upload visual hero dan simpan URL banner yang langsung dipakai di homepage.
        </p>
        <div className="mt-4">
          <ImageUploadField
            value={form.image}
            onChange={(value) => setForm((current) => ({ ...current, image: value }))}
            compact
            uploadType="banner"
          />
        </div>
        <div className="mt-4 space-y-3">
          <Field label="Judul">
            <Input
              className="h-11 px-3.5"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
            />
          </Field>
          <Field label="Subtitle">
            <Textarea
              className="min-h-[96px] px-3.5 py-3"
              value={form.subtitle}
              onChange={(event) =>
                setForm((current) => ({ ...current, subtitle: event.target.value }))
              }
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Button Text">
              <Input
                className="h-11 px-3.5"
                value={form.buttonText}
                onChange={(event) =>
                  setForm((current) => ({ ...current, buttonText: event.target.value }))
                }
              />
            </Field>
            <Field label="Button Link">
              <Input
                className="h-11 px-3.5"
                value={form.buttonHref}
                onChange={(event) =>
                  setForm((current) => ({ ...current, buttonHref: event.target.value }))
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
          <div className="flex gap-2.5 pt-1">
            <Button
              disabled={isPending}
              className="px-4 py-2.5"
              onClick={() => startTransition(submitForm)}
            >
              {form.id ? "Update Banner" : "Tambah Banner"}
            </Button>
            <Button variant="secondary" className="px-4 py-2.5" onClick={() => setForm(initialState)}>
              Reset
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {banners.map((item) => (
          <article key={item.id} className="rounded-[26px] border border-brand-700/10 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card">
            <div className="overflow-hidden rounded-[20px] bg-brand-50">
              <FallbackImage
                src={item.image}
                fallbackSrc={getBannerImage(item.image)}
                alt={item.title}
                width={1200}
                height={720}
                className="h-[200px] w-full object-cover"
              />
            </div>
            <h3 className="mt-3.5 font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/65">{item.subtitle}</p>
            <div className="mt-3.5 flex gap-2.5">
              <Button
                variant="secondary"
                className="flex-1 px-3.5 py-2.5"
                onClick={() =>
                  setForm({
                    id: item.id,
                    title: item.title,
                    subtitle: item.subtitle,
                    buttonText: item.buttonText,
                    buttonHref: item.buttonHref,
                    image: item.image,
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
                    await fetch(`/api/admin/banners/${item.id}`, { method: "DELETE" });
                    toast.success("Banner dihapus.");
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
