import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function toWhatsappNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;

  return digits;
}

export function createOrderCode() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getDate()).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);

  return `CTR-${date}-${random}`;
}

export function buildWhatsappMessage(input: {
  code: string;
  customerName: string;
  whatsapp: string;
  email?: string | null;
  address?: string | null;
  deliveryDate: string;
  deliveryTime: string;
  deliveryMethod: string;
  note?: string | null;
  total: number;
  items: Array<{
    name: string;
    qty: number;
    note?: string | null;
    subtotal: number;
  }>;
}) {
  const lines = [
    "Halo Admin Catring, saya ingin konfirmasi pesanan berikut:",
    "",
    `Kode Order: ${input.code}`,
    `Nama: ${input.customerName}`,
    `WhatsApp: ${input.whatsapp}`,
    `Email: ${input.email || "-"}`,
    `Metode: ${input.deliveryMethod}`,
    `Tanggal: ${input.deliveryDate}`,
    `Jam: ${input.deliveryTime}`,
    `Alamat: ${input.address || "-"}`,
    "",
    "Detail Pesanan:"
  ];

  for (const item of input.items) {
    lines.push(
      `- ${item.name} x${item.qty} (${formatCurrency(item.subtotal)})${
        item.note ? ` | Catatan: ${item.note}` : ""
      }`
    );
  }

  lines.push("");
  lines.push(`Catatan Umum: ${input.note || "-"}`);
  lines.push(`Total: ${formatCurrency(input.total)}`);

  return encodeURIComponent(lines.join("\n"));
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
