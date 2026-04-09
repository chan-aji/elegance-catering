"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { CustomerOrder } from "@/types";

const statuses = [
  { value: "PENDING", label: "pending" },
  { value: "PROCESSING", label: "diproses" },
  { value: "SHIPPED", label: "dikirim" },
  { value: "COMPLETED", label: "selesai" }
];

export function OrdersManager({ orders }: { orders: CustomerOrder[] }) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(orders[0]?.id ?? null);
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filteredOrders = orders.filter((order) => {
    const matchQuery =
      order.code.toLowerCase().includes(query.toLowerCase()) ||
      order.customerName.toLowerCase().includes(query.toLowerCase()) ||
      order.whatsapp.toLowerCase().includes(query.toLowerCase());
    const matchFilter = filter === "ALL" || order.status === filter;
    return matchQuery && matchFilter;
  });

  const activeOrder =
    filteredOrders.find((order) => order.id === activeId) ?? filteredOrders[0] ?? null;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4">
        <div className="grid gap-3 rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,#fbfdf8_0%,#f3f8ec_100%)] p-4 shadow-sm sm:grid-cols-[1fr_180px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari kode, nama, atau WhatsApp"
              className="h-12 w-full rounded-2xl border border-brand-700/10 bg-white pl-11 pr-4 text-sm outline-none focus:border-brand-500"
            />
          </label>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-12 rounded-2xl border border-brand-700/10 bg-white px-4 text-sm outline-none focus:border-brand-500"
          >
            <option value="ALL">Semua status</option>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        {filteredOrders.map((order) => (
          <button
            key={order.id}
            onClick={() => setActiveId(order.id)}
            className={`w-full rounded-[28px] border p-5 text-left shadow-sm transition-all duration-300 ${
              activeId === order.id
                ? "border-brand-700/20 bg-brand-50 shadow-card"
                : "border-brand-700/10 bg-white hover:-translate-y-0.5 hover:shadow-card"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                  {order.code}
                </p>
                <h3 className="mt-2 font-semibold text-ink">{order.customerName}</h3>
                <p className="mt-1 text-sm text-ink/45">{order.whatsapp}</p>
              </div>
              <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] ${statusClass(order.status)}`}>
                {statusLabel(order.status)}
              </span>
            </div>
            <p className="mt-3 text-sm text-ink/60">{formatCurrency(order.total)}</p>
          </button>
        ))}
        {filteredOrders.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-brand-700/20 bg-white p-6 text-center text-ink/60">
            Tidak ada pesanan yang cocok dengan filter saat ini.
          </div>
        ) : null}
      </div>

      <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,#fbfdf8_0%,#f3f8ec_100%)] p-5 shadow-sm">
        {activeOrder ? (
          <>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                  Detail Order
                </p>
                <h3 className="mt-2 font-display text-3xl font-semibold text-ink">
                  {activeOrder.code}
                </h3>
              </div>
              <select
                className="h-12 rounded-2xl border border-brand-700/10 bg-white px-4 text-sm"
                value={activeOrder.status}
                onChange={(event) =>
                  startTransition(async () => {
                    await fetch(`/api/admin/orders/${activeOrder.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: event.target.value })
                    });
                    toast.success("Status pesanan diupdate.");
                    router.refresh();
                  })
                }
                disabled={isPending}
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Info label="Nama" value={activeOrder.customerName} />
              <Info label="WhatsApp" value={activeOrder.whatsapp} />
              <Info label="Email" value={activeOrder.email ?? "-"} />
              <Info label="Metode" value={activeOrder.deliveryMethod} />
              <Info label="Tanggal" value={activeOrder.deliveryDate} />
              <Info label="Jam" value={activeOrder.deliveryTime} />
            </div>
            <div className="mt-4 rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-ink/60">Alamat</p>
              <p className="mt-2 text-sm leading-6 text-ink">{activeOrder.address ?? "-"}</p>
            </div>
            <div className="mt-4 rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-ink/60">Catatan</p>
              <p className="mt-2 text-sm leading-6 text-ink">{activeOrder.note ?? "-"}</p>
            </div>
            <div className="mt-6 rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-ink/60">Item Pesanan</p>
              <div className="mt-4 space-y-3">
                {activeOrder.items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4 rounded-2xl bg-brand-50 px-4 py-3">
                    <div>
                      <p className="font-medium text-ink">{item.menuName}</p>
                      <p className="text-sm text-ink/55">
                        Qty {item.quantity} {item.note ? `| ${item.note}` : ""}
                      </p>
                    </div>
                    <p className="font-semibold text-brand-800">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-brand-700/10 pt-4">
                <span className="text-sm text-ink/60">Total</span>
                <span className="text-lg font-semibold text-ink">
                  {formatCurrency(activeOrder.total)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-ink/60">Pilih order untuk melihat detail.</div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-white p-4">
      <p className="text-sm font-medium text-ink/55">{label}</p>
      <p className="mt-2 text-base text-ink">{value}</p>
    </div>
  );
}

function statusLabel(status: string) {
  return statuses.find((item) => item.value === status)?.label ?? status.toLowerCase();
}

function statusClass(status: string) {
  if (status === "COMPLETED") return "bg-emerald-100 text-emerald-700";
  if (status === "SHIPPED") return "bg-sky-100 text-sky-700";
  if (status === "PROCESSING") return "bg-amber-100 text-amber-700";
  return "bg-white text-ink/65";
}
