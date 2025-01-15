import { IProduct } from "../../types/product.types";
import { Flex, Stack, Text } from "@mantine/core";
const OrderDetailsCard = ({
  product,
  type,
  totalAmount,
  startDate,
  endDate,
}: {
  product: IProduct;
  type: string;
  totalAmount: number;
  startDate: string | null;
  endDate: string | null;
}) => {
  const StartDate = startDate ? startDate.split("T")[0] : null;
  const EndDate = endDate ? endDate.split("T")[0] : null;
  const SalePrice = product.saleDetails ? product.saleDetails.price : null;
  const RentDetails = product.rentDetails ? product.rentDetails.price : null;

  return (
    <Stack gap={"xs"}>
      <Text size="xl">{product.title}</Text>
      {(type === "Bought" || type === "Sold") && (
        <Text size="md">Item Price: ${SalePrice}</Text>
      )}
      {(type === "Rented" || type === "Borrowed") && (
        <Text size="md">Item Price: ${RentDetails}</Text>
      )}
      {type === "Rented" && (
        <Flex>
          <Text size="md" c={"#606060"}>
            From: {StartDate} -
          </Text>
          <Text size="md" c={"#606060"}>
            {EndDate}
          </Text>
        </Flex>
      )}

      <Text fw={"bolder"} c={"indigo"}>
        Total order amount: {totalAmount}
      </Text>
    </Stack>
  );
};

export default OrderDetailsCard;
