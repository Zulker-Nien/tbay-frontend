import { useQuery } from "@apollo/client";
import { Card, Loader, ScrollArea, Stack, Text } from "@mantine/core";
import { IProduct } from "../../../types/product.types";
import OrderDetailsCard from "../OrderDetailsCard";
import { useAuthStore } from "../../../store/authStore";
import { GET_USER_ORDERS } from "../../../graphql/query";

interface OrderItem {
  id: number;
  product: IProduct;
  orderType: string;
  lender: {
    firstName: string;
    id: string;
  };
  startDate: string;
  endDate: string;
}

interface Order {
  id: number;
  orderType: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date;
}

interface LendedProduct {
  product: IProduct;
  totalAmount: number;
  startDate: string;
  endDate: string;
}

const RentedProducts = () => {
  const { data, loading, error } = useQuery(GET_USER_ORDERS);
  const { user } = useAuthStore();
  if (loading) return <Loader />;
  if (error) return <Text c="red">Error loading bought products</Text>;
  if (!data?.getUserOrders?.length)
    return <Text>No bought products found</Text>;

  const product: LendedProduct[] = data.getUserOrders.flatMap((order: Order) =>
    order.items
      .filter(
        (item: OrderItem) =>
          item.lender !== null &&
          item.lender.id === user?.id &&
          item.orderType === "RENT"
      )
      .map((item: OrderItem) => ({
        product: item.product,
        totalAmount: order.totalAmount,
        startDate: item.startDate,
        endDate: item.endDate,
      }))
  );

  return (
    <ScrollArea h="70vh">
      <Stack>
        {product.map((item: LendedProduct, index: number) => (
          <div key={index}>
            <Card key={item.product.id}>
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
