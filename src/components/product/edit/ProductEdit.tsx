import { Button, Drawer, Stack, Group, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IProduct } from "../../../types/product.types";
import { IconEdit } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useMemo } from "react";
import { useProductStore } from "../../../store/productStore";
import { editValidation } from "./utils/editValidation";
import { FormFields } from "./FormFields";
import { useProductMutation } from "./hooks/useProductEditMutation";

const ProductEdit = ({ product }: { product: IProduct }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { categories } = useProductStore();
  const { updateProduct, loading } = useProductMutation();

  const form = useForm({
    initialValues: {
      id: product.id,
      title: product.title,
      description: product.description,
      available: product.available,
      quantity: product.quantity,
      categories: product.categories.map((cat) => cat.id.toString()),
      saleDetails: {
        price: product.saleDetails?.price || 0,
      },
      rentDetails: {
        price: product.rentDetails?.price || 0,
      },
    },
    validate: editValidation,
  });

  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      value: category.id.toString(),
      label: category.name,
    }));
  }, [categories]);

  const handleSubmit = async (values: typeof form.values) => {
    if (
      ["SALE", "BOTH"].includes(values.available) &&
      values.saleDetails.price <= 0
    ) {
      form.setFieldError(
        "saleDetails.price",
        "Sale price must be greater than 0"
      );
      return;
    }
    if (
      ["RENT", "BOTH"].includes(values.available) &&
      values.rentDetails.price <= 0
    ) {
      form.setFieldError(
        "rentDetails.price",
        "Rent price must be greater than 0"
      );
      return;
    }

    const result = await updateProduct(values);
    if (result.success) {
      close();
    }
  };

  return (
    <>
      <Drawer
        opened={opened}
        position="right"
        size="xl"
        onClose={close}
        title="Edit Product"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Container>
            <Stack>
              <FormFields form={form} categoryOptions={categoryOptions} />

              <Group justify="flex-end" mt="xl">
                <Button variant="outline" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Save Changes
                </Button>
              </Group>
            </Stack>
          </Container>
        </form>
      </Drawer>

      <Button variant="default" onClick={open}>
        <IconEdit />
      </Button>
    </>
  );
};

export default ProductEdit;
