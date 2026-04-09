"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import { CartItem, MenuItem } from "@/types";

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  updateNote: (menuItemId: string, note: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "catring-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const value: CartContextValue = {
    items,
    isOpen,
    addItem: (item) =>
      setItems((current) => {
        const existing = current.find((entry) => entry.menuItemId === item.id);
        if (existing) {
          return current.map((entry) =>
            entry.menuItemId === item.id
              ? { ...entry, quantity: entry.quantity + 1 }
              : entry
          );
        }
        return [
          ...current,
          {
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
            note: ""
          }
        ];
      }),
    removeItem: (menuItemId) =>
      setItems((current) =>
        current.filter((entry) => entry.menuItemId !== menuItemId)
      ),
    updateQuantity: (menuItemId, quantity) =>
      setItems((current) =>
        current
          .map((entry) =>
            entry.menuItemId === menuItemId
              ? { ...entry, quantity: Math.max(1, quantity) }
              : entry
          )
          .filter((entry) => entry.quantity > 0)
      ),
    updateNote: (menuItemId, note) =>
      setItems((current) =>
        current.map((entry) =>
          entry.menuItemId === menuItemId ? { ...entry, note } : entry
        )
      ),
    clearCart: () => setItems([]),
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    totalItems,
    totalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
