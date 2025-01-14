import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ICategory, IProduct } from "../types/product.types";

interface ProductStore {
  products: IProduct[];
  userProducts: IProduct[];
  categories: ICategory[];
  setProducts: (products: IProduct[]) => void;
  setUserProducts: (products: IProduct[]) => void;
  setCategories: (categories: ICategory[]) => void;
  selectedProduct: IProduct | null;
  setSelectedProduct: (product: IProduct | null) => void;
  deleteProduct: (productId: number) => void;
  updateProduct: (updatedProduct: IProduct) => void;
  addToProducts: (newProduct: IProduct) => void;
  addToUserProducts: (newProduct: IProduct) => void;
}

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