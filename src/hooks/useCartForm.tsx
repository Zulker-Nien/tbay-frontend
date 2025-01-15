import { useForm } from "@mantine/form";
import { IProduct } from "../types/product.types";
import { CartFormValues } from "../types/cart.types";

export const useCartForm = (product: IProduct) => {
  return useForm<CartFormValues>({
    initialValues: {
      itemType: product.available === "RENT" ? "RENT" : "BUY",
      quantity: 1,
      startDate: null,
      endDate: null,
    },

    validate: {
      quantity: (value) => {
        if (!value || value < 1) return "Quantity must be at least 1";
        if (value > product.quantity) {
          return `Requested quantity exceeds available stock. Available: ${product.quantity}`;
        }
        return null;
      },

      itemType: (value) => {
        if (
          value === "BUY" &&
          product.available !== "SALE" &&
          product.available !== "BOTH"
        ) {
          return "This product is not available for purchase";
        }
        if (
          value === "RENT" &&
          product.available !== "RENT" &&
          product.available !== "BOTH"
        ) {
          return "This product is not available for rent";
        }
        return null;
      },

      startDate: (value, values) => {
        if (values.itemType === "RENT") {
          if (!value) return "Start date is required for rentals";
          if (value < new Date()) return "Start date cannot be in the past";
        }
        if (values.itemType === "BUY" && value) {
          return "Start date should not be provided for purchase items";
        }
        return null;
      },

      endDate: (value, values) => {
        if (values.itemType === "RENT") {
          if (!value) return "End date is required for rentals";
          if (values.startDate && value <= values.startDate) {
            return "End date must be after start date";
          }
        }
        if (values.itemType === "BUY" && value) {
          return "End date should not be provided for purchase items";
        }
        return null;
      },
    },
  });
};
