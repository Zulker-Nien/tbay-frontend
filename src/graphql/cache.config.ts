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
    Category: {
      keyFields: ["id"],
    },
  },
});
