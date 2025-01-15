import { EditFormValues } from "../../../../types/product.types";

export const editValidation = {
  title: (value?: string) => {
    if (!value?.trim()) return "Title is required";
    if (value.length < 2) return "Title must be at least 2 characters";
    if (value.length > 512) return "Title must be less than 512 characters";
    return null;
  },

  description: (value?: string) =>
    !value?.trim() ? "Description is required" : null,

  quantity: (value?: number) => {
    if (!value) return "Quantity is required";
    if (value < 1) return "Quantity must be at least 1";
    if (!Number.isInteger(value)) return "Quantity must be a whole number";
    return null;
  },

  available: (value?: string) =>
    !value ? "Availability type is required" : null,

  categories: (value?: string[]) =>
    !value || value.length === 0 ? "At least one category is required" : null,

  saleDetails: {
    price: (value: number | undefined, values: EditFormValues) => {
      if (["SALE", "BOTH"].includes(values.available)) {
        if (value === undefined || value === null)
          return "Sale price is required";
        if (value <= 0) return "Sale price must be greater than 0";
        if (!Number.isFinite(value)) return "Please enter a valid price";
      }
      return null;
    },
  },

  rentDetails: {
    price: (value: number | undefined, values: EditFormValues) => {
      if (["RENT", "BOTH"].includes(values.available)) {
        if (value === undefined || value === null)
          return "Rent price is required";
        if (value <= 0) return "Rent price must be greater than 0";
        if (!Number.isFinite(value)) return "Please enter a valid price";
      }
      return null;
    },
  },
};
