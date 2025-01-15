import { InMemoryCache } from "@apollo/client";

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        categories: {
          merge: false,
        },
      },
    },
    category: {
      keyFields: ["id"],
    },
    product: {
      keyFields: ["id", "saleDetails.price", "rentDetails.price", "quantity"],
    },
  },
});
