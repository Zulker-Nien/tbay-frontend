import { useQuery } from "@apollo/client";
import { Card, Loader, ScrollArea, Stack, Text } from "@mantine/core";
import { IProduct } from "../../../types/product.types";
import OrderDetailsCard from "../OrderDetailsCard";
import { GET_USER_RENTALS } from "../../../graphql/query";

interface OrderItem {
  product: IProduct;
  orderType: string;
  lender: {
    id: string;
  };
  renter: {
    id: string;
  };
  startDate: string;
  endDate: string;
}

interface Rental {
  id: number;
  userId: string;
  totalAmount: number;
  items: OrderItem[];
}

interface LendedProduct {
  product: IProduct;
  totalAmount: number;
  startDate: string;
  endDate: string;
}

const RentedProducts = () => {
  const { data, loading, error } = useQuery(GET_USER_RENTALS);
  if (loading) return <Loader />;
  if (error) return <Text c="red">Error loading rentals</Text>;
  if (!data?.getUserRentals?.length)
    return <Text>No rented products found</Text>;

  const product: LendedProduct[] = data.getUserRentals.flatMap(
    (rental: Rental) =>
      rental.items
        .filter((item: OrderItem) => item.orderType === "RENT")
        .map((item: OrderItem) => ({
          product: item.product,
          totalAmount: rental.totalAmount,
          startDate: item.startDate,
          endDate: item.endDate,
        }))
  );

  return (
    <ScrollArea h="70vh">
      <Stack>
        {product.map((item: LendedProduct, index: number) => (
          <div key={index}>
            <Card key={item.product.id} withBorder>
              <OrderDetailsCard
                product={item.product}
                type="Rented"
                totalAmount={item.totalAmount}
                startDate={item.startDate}
                endDate={item.endDate}
              />
            </Card>
          </div>
        ))}
      </Stack>
    </ScrollArea>
  );
};

export default RentedProducts;
