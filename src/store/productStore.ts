import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ProductStore } from "../types/product.types";

export const useProductStore = create<ProductStore>()(
  devtools(
    (set) => ({
      products: [],
      userProducts: [],
      categories:[],
      setProducts: (products) => set({ products }),
      setCategories: (categories) => set({categories}),
      setUserProducts: (products) => set({ userProducts: products }),
      selectedProduct: null,
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      deleteProduct: (productId: number) =>
        set((state) => ({
          userProducts: state.userProducts.filter((p) => p.id !== productId),
          products: state.products.filter((p) => p.id !== productId),
        })),
      updateProduct: (updatedProduct) =>
        set((state) => ({
          userProducts: state.userProducts.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          ),
          products: state.products.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          ),
        })),
      addToProducts: (newProduct) =>
        set((state) => ({
          products: [...state.products, {
            ...newProduct,
            saleDetails: newProduct.available === 'BOTH' || newProduct.available === 'SALE' 
              ? newProduct.saleDetails 
              : undefined,
            rentDetails: newProduct.available === 'BOTH' || newProduct.available === 'RENT' 
              ? newProduct.rentDetails 
              : undefined,
          }],
        })),
      addToUserProducts: (newProduct) =>
        set((state) => ({
          userProducts: [...state.userProducts, {
            ...newProduct,
            saleDetails: newProduct.available === 'BOTH' || newProduct.available === 'SALE' 
              ? newProduct.saleDetails 
              : undefined,
            rentDetails: newProduct.available === 'BOTH' || newProduct.available === 'RENT' 
              ? newProduct.rentDetails 
              : undefined,
          }],
        })),
    }),
    {
      name: "product-store",
    }
  )
);