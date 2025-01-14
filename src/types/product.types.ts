export interface IProduct {
  id: number;
  title: string;
  description: string;
  available: string;
  quantity: number;
  averageRating: number;
  categories: ICategory[];
  saleDetails?: saleDetails;
  rentDetails?: rentDetails;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type saleDetails = {
  id: number;
  productId: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};
export type rentDetails = {
  id: number;
  productId: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface CreateFormValues {
  title: string;
  description: string;
  available: string;
  quantity: number;
  categories: string[];
  saleDetails: {
    price: number;
  };
  rentDetails: {
    price: number;
  };
}

export interface ICategory {
  id: number;
  name: string;
}

export interface IPriceDetails {
  price: number;
}

export interface EditFormValues {
  id: number;
  title: string;
  description: string;
  available: string;
  quantity: number;
  categories: string[];
  saleDetails: IPriceDetails;
  rentDetails: IPriceDetails;
}

export const AVAILABILITY_OPTIONS = [
  { value: "SALE", label: "For Sale" },
  { value: "RENT", label: "For Rent" },
  { value: "BOTH", label: "Both" },
] as const;
