import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "../types/auth.types";
import { useCartStore } from "./cartStore";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,
      setTokens: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, isAuthenticated: true, user }),
      clearTokens: () => {
        useCartStore.getState().clearCart();
        return set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);