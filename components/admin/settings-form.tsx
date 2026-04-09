"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/shared/button";
import { Input, Textarea } from "@/components/shared/field";
import { SiteSettings } from "@/types";

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    siteName: settings?.siteName ?? "",
    logoText: settings?.logoText ?? "",
    whatsapp: settings?.whatsapp ?? "",
    primaryColor: settings?.primaryColor ?? "#E8F5E9",
    secondaryColor: settings?.secondaryColor ?? "#2E7D32",
    heroTitle: settings?.heroTitle ?? "",
    heroSubtitle: settings?.heroSubtitle ?? "",
    aboutText: settings?.aboutText ?? "",
    address: settings?.address ?? "",
    email: settings?.email ?? ""
  });

  async function handleSave() {
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      toast.error("Gagal menyimpan settings.");
      return;
    }

    toast.success("Settings berhasil diupdate.");
    router.refresh();
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-[28px] bg-[#f8fbf4] p-5 shadow-sm">
        <h3 className="font-display text-2xl font-semibold text-ink">Brand & Hero</h3>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          Ubah teks brand dan hero tanpa mengganggu layout utama homepage.
        </p>
        <div className="mt-5 space-y-4">
          <Field label="Site Name">
            <Input value={form.siteName} onChange={(event) => setForm((current) => ({ ...current, siteName: event.target.value }))} />
          </Field>
          <Field label="Logo Text">
            <Input value={form.logoText} onChange={(event) => setForm((current) => ({ ...current, logoText: event.target.value }))} />
          </Field>
          <Field label="Hero Title">
            <Input value={form.heroTitle} onChange={(event) => setForm((current) => ({ ...current, heroTitle: event.target.value }))} />
          </Field>
          <Field label="Hero Subtitle">
            <Textarea value={form.heroSubtitle} onChange={(event) => setForm((current) => ({ ...current, heroSubtitle: event.target.value }))} />
          </Field>
        </div>
      </div>
      <div className="rounded-[28px] bg-[#f8fbf4] p-5 shadow-sm">
        <h3 className="font-display text-2xl font-semibold text-ink">Kontak & Warna</h3>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          Pastikan WhatsApp, email, dan alamat selalu akurat untuk checkout dan footer.
        </p>
        <div className="mt-5 space-y-4">
          <Field label="WhatsApp">
            <Input value={form.whatsapp} onChange={(event) => setForm((current) => ({ ...current, whatsapp: event.target.value }))} />
          </Field>
          <Field label="Email">
            <Input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          </Field>
          <Field label="Alamat">
            <Textarea value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
          </Field>
          <Field label="About Text">
            <Textarea value={form.aboutText} onChange={(event) => setForm((current) => ({ ...current, aboutText: event.target.value }))} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Primary Color">
              <Input value={form.primaryColor} onChange={(event) => setForm((current) => ({ ...current, primaryColor: event.target.value }))} />
            </Field>
            <Field label="Secondary Color">
              <Input value={form.secondaryColor} onChange={(event) => setForm((current) => ({ ...current, secondaryColor: event.target.value }))} />
            </Field>
          </div>
        </div>
      </div>
      <div className="xl:col-span-2">
        <Button disabled={isPending} onClick={() => startTransition(handleSave)}>
          {isPending ? "Menyimpan..." : "Simpan Settings"}
        </Button>
        <p className="mt-3 text-sm text-ink/50">
          Setelah tersimpan, perubahan akan langsung digunakan oleh frontend yang terhubung ke Supabase.
        </p>
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
      <span className="mb-2 block text-sm font-medium text-ink/70">{label}</span>
      {children}
    </label>
  );
}
