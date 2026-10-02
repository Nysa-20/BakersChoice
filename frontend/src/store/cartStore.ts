import { create } from 'zustand';
import type { components } from '../api/schema';

type Item = components['schemas']['Item'];

export interface CartItem {
  item: Item;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Item, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getTotals: () => { subtotal: number; tax: number; total: number };
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (item, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.item.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.item.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
          isOpen: true,
        };
      }
      return { items: [...state.items, { item, quantity }], isOpen: true };
    });
  },
  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((i) => i.item.id !== itemId),
    }));
  },
  updateQuantity: (itemId, quantity) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.item.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  setIsOpen: (isOpen) => set({ isOpen }),
  getTotals: () => {
    const items = get().items;
    const subtotal = items.reduce((acc, i) => acc + (i.item.price * i.quantity), 0);
    const tax = subtotal * 0.18;
    return { subtotal, tax, total: subtotal + tax };
  },
}));
