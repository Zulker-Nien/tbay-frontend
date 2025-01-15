import {
  Button,
  Flex,
  NumberInput,
  SegmentedControl,
  Text,
  Stack,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { IProduct } from "../../../types/product.types";
import { CartFormValues } from "../../../types/cart.types";

interface CartFormProps {
  form: UseFormReturnType<CartFormValues>;
  product: IProduct;
  onSubmit: (values: CartFormValues) => void;
  isLoading: boolean;
}

export const CartForm = ({
  form,
  product,
  onSubmit,
  isLoading,
}: CartFormProps) => {
  const calculateTotalPrice = () => {
    const quantity = form.values.quantity || 0;

    if (form.values.itemType === "RENT" || product.available === "RENT") {
      if (
        !form.values.startDate ||
        !form.values.endDate ||
        !product.rentDetails?.price
      ) {
        return 0;
      }

      const startDate = new Date(form.values.startDate);
      const endDate = new Date(form.values.endDate);
      const differenceInTime = endDate.getTime() - startDate.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

      return (
        product.rentDetails.price * quantity * Math.max(differenceInDays, 1)
      );
    } else {
      return (product.saleDetails?.price || 0) * quantity;
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Flex direction="column" gap="xl" mih={"40vh"} justify={"space-between"}>
        <Stack gap={"md"} mt={"md"}>
          {product.available === "BOTH" && (
            <SegmentedControl
              {...form.getInputProps("itemType")}
              data={[
                { label: "Buy", value: "BUY" },
                { label: "Rent", value: "RENT" },
              ]}
            />
          )}

          {form.values.itemType === "RENT" ? (
            <Text>Rent for ${product.rentDetails?.price || 0}/day only</Text>
          ) : (
            <Text>Buy for ${product.saleDetails?.price || 0} only</Text>
          )}

          <NumberInput
            label="Quantity"
            placeholder="Enter quantity"
            min={1}
            {...form.getInputProps("quantity")}
          />

          {(form.values.itemType === "RENT" ||
            product.available === "RENT") && (
            <Flex gap={"sm"}>
              <DatePickerInput
                label="Rent On"
                placeholder="Pick start date"
                minDate={new Date()}
                w={"100%"}
                {...form.getInputProps("startDate")}
              />
              <DatePickerInput
                label="Return On"
                placeholder="Pick end date"
                minDate={form.values.startDate || new Date()}
                clearable
                w={"100%"}
                {...form.getInputProps("endDate")}
              />
            </Flex>
          )}
        </Stack>

        <Flex gap={"sm"} justify={"center"} align={"flex-end"}>
          <Stack w={"100%"} gap={"0"}>
            <Text size="sm">Total Price:</Text>
            <Text size={"2rem"}>${calculateTotalPrice().toFixed(2)}</Text>
          </Stack>
          <Button w={"100%"} type="submit" loading={isLoading}>
            Add to Cart
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};
