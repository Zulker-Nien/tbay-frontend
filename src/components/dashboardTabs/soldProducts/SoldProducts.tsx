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
  seller: {
    firstName: string;
    id: string;
  };
}

interface Order {
  id: number;
  orderType: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date;
}

interface SoldProductWithAmount {
  product: IProduct;
  totalAmount: number;
}

const SoldProducts = () => {
  const { data, loading, error } = useQuery(GET_USER_ORDERS);
  const { user } = useAuthStore();
  if (loading) return <Loader />;
  if (error) return <Text c="red">Error loading bought products</Text>;
  if (!data?.getUserOrders?.length) return <Text>No sold products found</Text>;

  const product: SoldProductWithAmount[] = data.getUserOrders.flatMap(
    (order: Order) =>
      order.items
        .filter(
          (item: OrderItem) =>
            item.seller !== null &&
            item.seller.id === user?.id &&
            item.orderType === "BUY"
        )
        .map((item: OrderItem) => ({
          product: item.product,
          totalAmount: order.totalAmount,
        }))
  );
  return (
    <ScrollArea h="70vh">
      <Stack>
        {product.map((item: SoldProductWithAmount, index: number) => {
          console.log(item);
          return (
            <div key={index}>
              <Card key={item.product.id} withBorder>
                <OrderDetailsCard
                  product={item.product}
                  type="Sold"
                  totalAmount={item.totalAmount}
                  startDate={null}
                  endDate={null}
                />
              </Card>
            </div>
          );
        })}
      </Stack>
    </ScrollArea>
  );
};

export default SoldProducts;
