import { useMutation, ApolloCache } from "@apollo/client";

import { notifications } from "@mantine/notifications";
import { EditFormValues, IProduct } from "../types/product.types";
import { UPDATE_PRODUCT } from "../graphql/mutation";
import { VIEW_ALL_PRODUCTS, VIEW_PRODUCTS_BY_USER } from "../graphql/query";

interface UpdateProductResponse {
  updateProduct: IProduct;
}

interface UpdateProductVariables {
  productId: number;
  updateProduct: {
    id: number;
    title: string;
    description: string;
    available: string;
    quantity: number;
    categories: number[];
    rentDetails: {
      price: number;
    };
    saleDetails: {
      price: number;
    };
  };
}

interface QueryResponse {
  viewAllProducts: IProduct[];
}

interface UserQueryResponse {
  viewProductsByUser: IProduct[];
}

export const useProductMutation = () => {
  const [updateProduct, { loading }] = useMutation<
    UpdateProductResponse,
    UpdateProductVariables
  >(UPDATE_PRODUCT);

  const handleProductUpdate = async (values: EditFormValues) => {
    try {
      const mutationVariables: UpdateProductVariables = {
        productId: values.id,
        updateProduct: {
          id: values.id,
          title: values.title.trim(),
          description: values.description.trim(),
          available: values.available,
          quantity: values.quantity,
          categories: values.categories.map(Number),
          rentDetails: {
            price: values.rentDetails.price,
          },
          saleDetails: {
            price: values.saleDetails.price,
          },
        },
      };

      const result = await updateProduct({
        variables: mutationVariables,
        update: (cache: ApolloCache<unknown>, { data }) => {
          if (!data) return;

          const allProductsCache = cache.readQuery<QueryResponse>({
            query: VIEW_ALL_PRODUCTS,
          });

          if (allProductsCache) {
            const updatedProducts = allProductsCache.viewAllProducts.map(
              (product) =>
                product.id === values.id ? data.updateProduct : product
            );

            cache.writeQuery<QueryResponse>({
              query: VIEW_ALL_PRODUCTS,
              data: { viewAllProducts: updatedProducts },
            });
          }

          const userProductsCache = cache.readQuery<UserQueryResponse>({
            query: VIEW_PRODUCTS_BY_USER,
          });

          if (userProductsCache) {
            const updatedUserProducts =
              userProductsCache.viewProductsByUser.map((product) =>
                product.id === values.id ? data.updateProduct : product
              );

            cache.writeQuery<UserQueryResponse>({
              query: VIEW_PRODUCTS_BY_USER,
              data: { viewProductsByUser: updatedUserProducts },
            });
          }

          // Update individual product in cache
          cache.modify({
            id: cache.identify({ __typename: "Product", id: values.id }),
            fields: {
              title: () => data.updateProduct.title,
              description: () => data.updateProduct.description,
              available: () => data.updateProduct.available,
              quantity: () => data.updateProduct.quantity,
              categories: () => data.updateProduct.categories,
              rentDetails: () => data.updateProduct.rentDetails,
              saleDetails: () => data.updateProduct.saleDetails,
            },
          });
        },
        // Optimistic response for immediate UI update
        optimisticResponse: {
          updateProduct: {
            // __typename: "Product",
            id: values.id,
            title: values.title.trim(),
            description: values.description.trim(),
            available: values.available,
            quantity: values.quantity,
            averageRating: 0, // Default value for optimistic response
            categories: values.categories.map((categoryId) => ({
              __typename: "Category",
              id: Number(categoryId),
              name: "", // Will be updated with actual data from server
            })),
            rentDetails: {
              // __typename: "RentDetails",
              id: 0, // Will be updated with actual data
              productId: values.id,
              price: values.rentDetails.price,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            saleDetails: {
              // __typename: "SaleDetails",
              id: 0, // Will be updated with actual data
              productId: values.id,
              price: values.saleDetails.price,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            owner: {
              // __typename: "User",
              id: "", // Will be updated with actual data
              firstName: "",
              lastName: "",
              email: "",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      });

      notifications.show({
        title: "Success",
        position: "bottom-right",
        message: "Product updated successfully",
        color: "green",
      });

      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error updating product:", error);
      notifications.show({
        title: "Error",
        position: "bottom-right",
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while updating the product",
        color: "red",
      });

      return { success: false, error };
    }
  };

  return { updateProduct: handleProductUpdate, loading };
};
