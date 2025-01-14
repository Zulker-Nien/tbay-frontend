import { Button, Flex, Popover, Stack, Text } from "@mantine/core";
import { IconTrashX } from "@tabler/icons-react";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useProductStore } from "../../../store/productStore";
import { DELETE_PRODUCT } from "../../../graphql/mutation";

const ProductDelete = ({ productId }: { productId: number }) => {
  const [opened, setOpened] = useState(false);
  const { deleteProduct } = useProductStore();

  const [deleteProductMutation, { loading }] = useMutation(DELETE_PRODUCT, {
    onCompleted: (data) => {
      if (data.deleteProduct) {
        deleteProduct(productId);
        notifications.show({
          title: "Success",
          position:"bottom-right",
          message: "Product deleted successfully",
          color: "green",
        });
        setOpened(false);
      }
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        position:"bottom-right",
        message: error.message || "Failed to delete product",
        color: "red",
      });
    },
  });

  const handleDelete = async () => {
    try {
      await deleteProductMutation({
        variables: {
          productId: productId,
        },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Popover
      position="top"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Button color="red" radius="md" onClick={() => setOpened(true)}>
          <IconTrashX />
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack>
          <Text size="sm">Are you sure you want to delete this product?</Text>
          <Text size="xs">This action cannot be undone.</Text>
          <Flex gap={10} justify="flex-end">
            <Button
              variant="default"
              size="xs"
              onClick={() => setOpened(false)}
            >
              Cancel
            </Button>
            <Button
              color="red"
              size="xs"
              loading={loading}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Flex>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ProductDelete;
