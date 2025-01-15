import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CartStore } from "../types/cart.types";

export const useCartStore = create<CartStore>()(
  devtools(
    (set) => ({
      userCart: null,
      setUserCart: (userCart) => set({ userCart }),
      clearCart: () => set({ userCart: null }),
      updateCartItems: (items) =>
        set((state) => ({
          userCart: state.userCart ? { ...state.userCart, items } : null,
        })),
    }),
    {
      name: "cart-store",
    }
  )
);
