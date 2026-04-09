"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { FallbackImage } from "@/components/shared/fallback-image";
import { Button } from "@/components/shared/button";
import { Textarea } from "@/components/shared/field";
import { getMenuImage } from "@/lib/media";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    openCart,
    removeItem,
    totalItems,
    totalPrice,
    updateNote,
    updateQuantity
  } = useCart();

  return (
    <>
      <button
        onClick={openCart}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#2f7f34_0%,#3f984a_100%)] px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(29,73,33,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(29,73,33,0.34)] active:scale-[0.98] sm:bottom-6 sm:right-6"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/14">
          <ShoppingBag className="h-4 w-4" />
        </span>
        <span className="flex flex-col items-start leading-none">
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/70">Cart</span>
          <span>{totalItems} item</span>
        </span>
      </button>
      {isOpen ? (
        <div className="fixed inset-0 z-50 bg-brand-900/38 backdrop-blur-md" onClick={closeCart}>
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-[500px] overflow-y-auto border-l border-white/50 bg-[linear-gradient(180deg,#fffdf7_0%,#f6faef_100%)] p-5 shadow-[0_24px_80px_rgba(17,35,20,0.26)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
                  Keranjang
                </p>
                <h2 className="mt-1 font-display text-3xl font-semibold text-ink">
                  Order Summary
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="rounded-full border border-brand-700/10 bg-white p-3 text-ink shadow-card transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(25,56,28,0.12)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {items.length === 0 ? (
              <div className="mt-10 rounded-[28px] border border-dashed border-brand-700/20 bg-white/85 px-6 py-10 text-center text-ink/60 shadow-card">
                Keranjang masih kosong.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="rounded-[28px] border border-white/80 bg-white/92 p-4 shadow-card"
                  >
                    <div className="flex gap-4">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[22px] bg-brand-50 ring-1 ring-brand-700/6">
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
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-ink">{item.name}</h3>
                            <p className="mt-1 text-sm text-brand-700">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.menuItemId)}
                            className="rounded-full bg-brand-50 p-2 text-brand-700 transition hover:bg-brand-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-4">
                          <div className="inline-flex items-center gap-3 rounded-full border border-brand-700/8 bg-brand-50 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                            <button
                              onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                              className="rounded-full p-1 transition hover:bg-white"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                              className="rounded-full p-1 transition hover:bg-white"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="font-semibold text-ink">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Textarea
                      value={item.note}
                      onChange={(event) => updateNote(item.menuItemId, event.target.value)}
                      placeholder="Catatan item, misalnya tanpa sambal atau ekstra sayur"
                      className="mt-4 min-h-[88px]"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 rounded-[28px] border border-brand-700/10 bg-[linear-gradient(180deg,#eef8ea_0%,#e5f3e2_100%)] p-5 shadow-card">
              <div className="flex items-center justify-between text-sm text-ink/70">
                <span>Total Item</span>
                <span>{totalItems}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-lg font-semibold text-ink">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <Link href="/checkout" className="mt-5 block">
                <Button className="w-full">Lanjut Checkout</Button>
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
