import { ScrollArea, SimpleGrid, Text } from "@mantine/core";
import { useQuery } from "@apollo/client";
import { IProduct } from "../../types/product.types";
import { VIEW_ALL_PRODUCTS } from "../../graphql/query";
import { useProductStore } from "../../store/productStore";
import { ProductCard } from "./ProductCard";
import { useEffect } from "react";
import { client } from "../../graphql/apollo-client";

export const ProductGrid = () => {
  const setProducts = useProductStore((state) => state.setProducts);
  const products = useProductStore((state) => state.products);
  const { loading, data } = useQuery<{ viewAllProducts: IProduct[] }>(
    VIEW_ALL_PRODUCTS,
    {
      fetchPolicy: "cache-and-network",
      onCompleted: (data) => {
        setProducts(data.viewAllProducts);
      },
    }
  );
  useEffect(() => {
    const cachedData = client.readQuery<{ viewAllProducts: IProduct[] }>({
      query: VIEW_ALL_PRODUCTS,
    });

    if (cachedData?.viewAllProducts) {
      setProducts(cachedData.viewAllProducts);
    }
  }, [setProducts, data]);

  if (loading) return <div>Loading...</div>;

  return (
    <ScrollArea h={"80vh"}>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {products.length > 0 ? (
          products.map((product: IProduct) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <Text size="xl" ta={"center"} w={"100%"}>
            We Just Launched
          </Text>
        )}
      </SimpleGrid>
    </ScrollArea>
  );
};
