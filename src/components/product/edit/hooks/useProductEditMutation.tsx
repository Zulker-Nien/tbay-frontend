import { useMutation } from "@apollo/client";
import { UPDATE_PRODUCT } from "../../../../graphql/mutation";
import { EditFormValues } from "../../../../types/product.types";
import { notifications } from "@mantine/notifications";

export const useProductMutation = () => {
  const [updateProduct, { loading }] = useMutation(UPDATE_PRODUCT);

  const handleProductUpdate = async (values: EditFormValues) => {
    try {
      const mutationVariables = {
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
        update: (cache, { data }) => {
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
