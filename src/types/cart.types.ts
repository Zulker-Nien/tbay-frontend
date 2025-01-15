import { IProduct } from "./product.types";

export type CartItemType = "BUY" | "RENT";

export interface CartFormValues {
  itemType: CartItemType;
  quantity: number;
  startDate: Date | null;
  endDate: Date | null;
}

export interface CartProps {
  product: IProduct;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  price: number;
  quantity: number;
  itemType: string;
  startDate: string;
  endDate: string;
  product: IProduct;
  createdAt: string;
  updatedAt: string;
}

export interface CartList {
  id: string;
  userId: string;
  totalPrice: number;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartStore {
  userCart: CartList | null;
  setUserCart: (userCart: CartList) => void;
  clearCart: () => void;
  updateCartItems: (items: CartItem[]) => void;
}
