import { useQuery } from "@apollo/client";
import { Card, Loader, ScrollArea, Stack, Text } from "@mantine/core";
import { IProduct } from "../../../types/product.types";
import OrderDetailsCard from "../OrderDetailsCard";
import { GET_USER_SALES } from "../../../graphql/query";

interface OrderItem {
  product: IProduct;
  orderType: string;
  seller: {
    id: string;
  };
}

interface Sale {
  id: number;
  userId: string;
  totalAmount: number;
  items: OrderItem[];
}

interface SoldProductWithAmount {
  product: IProduct;
  totalAmount: number;
}

const SoldProducts = () => {
  const { data, loading, error } = useQuery(GET_USER_SALES);
  if (loading) return <Loader />;
  if (error) return <Text c="red">Error loading bought products</Text>;
  if (!data?.getUserSales?.length) return <Text>No sold products found</Text>;

  console.log(data);
  const products: SoldProductWithAmount[] = data.getUserSales.flatMap(
    (sale: Sale) =>
      sale.items
        .filter(
          (item: OrderItem) =>
            item.orderType === "BUY" || item.orderType === "BOTH"
        )
        .map((item: OrderItem) => ({
          product: item.product,
          totalAmount: sale.totalAmount,
        }))
  );
  return (
    <ScrollArea h="70vh">
      <Stack>
        {products.map((item: SoldProductWithAmount, index: number) => {
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
