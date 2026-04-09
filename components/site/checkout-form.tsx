"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertCircle, CalendarDays, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/shared/button";
import { FallbackImage } from "@/components/shared/fallback-image";
import { Input, Textarea } from "@/components/shared/field";
import { getMenuImage } from "@/lib/media";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { SiteSettings } from "@/types";

type CheckoutFormProps = {
  settings: SiteSettings | null;
};

export function CheckoutForm({ settings }: CheckoutFormProps) {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    whatsapp: "",
    email: "",
    address: "",
    deliveryDate: "",
    deliveryTime: "",
    note: "",
    deliveryMethod: "DELIVERY"
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      toast.error("Keranjang masih kosong.");
      setErrorMessage("Tambahkan minimal satu menu sebelum checkout.");
      return;
    }

    if (!form.customerName || !form.whatsapp || !form.deliveryDate || !form.deliveryTime) {
      setErrorMessage("Mohon lengkapi nama, WhatsApp, tanggal, dan jam pengiriman.");
      return;
    }

    if (form.deliveryMethod === "DELIVERY" && !form.address.trim()) {
      setErrorMessage("Alamat wajib diisi untuk metode antar.");
      return;
    }

    setErrorMessage("");

    startTransition(async () => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            note: item.note
          }))
        })
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error ?? "Gagal membuat order.");
        return;
      }

      toast.success("Order berhasil dibuat. WhatsApp akan dibuka.");
      clearCart();
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      router.push("/");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcf7_100%)] p-6 shadow-card sm:p-8"
      >
        <div className="mb-6 flex items-start gap-3 rounded-[24px] bg-brand-50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)]">
          <div className="rounded-full bg-white p-2 text-brand-700 shadow-sm">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Checkout aman dan cepat</p>
            <p className="mt-1 text-sm leading-6 text-ink/60">
              Pesanan akan tersimpan ke dashboard admin lalu otomatis membuka WhatsApp untuk konfirmasi.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nama">
            <Input
              required
              value={form.customerName}
              onChange={(event) =>
                setForm((current) => ({ ...current, customerName: event.target.value }))
              }
              placeholder="Nama lengkap"
            />
          </Field>
          <Field label="WhatsApp">
            <Input
              required
              value={form.whatsapp}
              onChange={(event) =>
                setForm((current) => ({ ...current, whatsapp: event.target.value }))
              }
              placeholder="0812xxxxxxx"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="email@anda.com"
            />
          </Field>
          <Field label="Tanggal">
            <Input
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={form.deliveryDate}
              onChange={(event) =>
                setForm((current) => ({ ...current, deliveryDate: event.target.value }))
              }
            />
          </Field>
          <Field label="Jam">
            <Input
              type="time"
              required
              value={form.deliveryTime}
              onChange={(event) =>
                setForm((current) => ({ ...current, deliveryTime: event.target.value }))
              }
            />
          </Field>
          <Field label="Metode">
            <select
              className="h-12 w-full rounded-2xl border border-brand-700/10 bg-white px-4 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              value={form.deliveryMethod}
              onChange={(event) =>
                setForm((current) => ({ ...current, deliveryMethod: event.target.value }))
              }
            >
              <option value="DELIVERY">Antar</option>
              <option value="PICKUP">Pickup</option>
            </select>
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Alamat">
            <Textarea
              value={form.address}
              onChange={(event) =>
                setForm((current) => ({ ...current, address: event.target.value }))
              }
              placeholder="Alamat lengkap pengantaran"
              className="min-h-[110px]"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Catatan">
            <Textarea
              value={form.note}
              onChange={(event) =>
                setForm((current) => ({ ...current, note: event.target.value }))
              }
              placeholder="Catatan tambahan untuk admin"
              className="min-h-[110px]"
            />
          </Field>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
            {isPending ? "Memproses..." : "Checkout via WhatsApp"}
          </Button>
          <a
            href={`https://wa.me/${settings?.whatsapp ?? ""}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-brand-700/12 px-5 py-3 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50"
          >
            Chat Admin
          </a>
        </div>
        {errorMessage ? (
          <div className="mt-4 flex items-start gap-3 rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <span>{errorMessage}</span>
          </div>
        ) : null}
      </form>

      <div className="rounded-[32px] border border-white/60 bg-[linear-gradient(180deg,#f6f1e7_0%,#f3eee1_100%)] p-6 shadow-card sm:sticky sm:top-28 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
          Ringkasan Pesanan
        </p>
        <div className="mt-4 flex items-center gap-3 rounded-[22px] bg-white/80 px-4 py-3 text-sm text-ink/65">
          <CalendarDays className="h-4 w-4 text-brand-700" />
          Pastikan tanggal dan jam order sudah sesuai jadwal kebutuhan Anda.
        </div>
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div key={item.menuItemId} className="rounded-[24px] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[20px] bg-brand-50 ring-1 ring-brand-700/6">
                  <FallbackImage
                    src={item.image}
                    fallbackSrc={getMenuImage(item.image, item.menuItemId)}
                    alt={item.name}
                    width={800}
                    height={800}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink">{item.name}</h3>
                  <p className="mt-1 text-sm text-ink/55">Qty {item.quantity}</p>
                  {item.note ? (
                    <p className="mt-1 text-sm text-brand-700">Catatan: {item.note}</p>
                  ) : null}
                  <p className="mt-3 font-semibold text-brand-800">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-brand-700/20 bg-white p-6 text-center text-ink/60">
              Keranjang masih kosong.
            </div>
          ) : null}
        </div>
        <div className="mt-6 rounded-[24px] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm text-ink/60">
            <span>Admin WhatsApp</span>
            <span>{settings?.whatsapp}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-lg font-semibold text-ink">
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
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
      <span className="mb-2 block text-sm font-medium text-ink/70">{label}</span>
      {children}
    </label>
  );
}
