import { ScrollArea, SimpleGrid } from "@mantine/core";
import { IProduct } from "../../../types/product.types";
import { ProductCard } from "../../product/ProductCard";
import { VIEW_PRODUCTS_BY_USER } from "../../../graphql/query";
import { useQuery } from "@apollo/client";
import { useProductStore } from "../../../store/productStore";

const MyProducts = () => {
  const setUserProducts = useProductStore((state) => state.setUserProducts);
  const userProducts = useProductStore((state) => state.userProducts);

  const { loading } = useQuery(VIEW_PRODUCTS_BY_USER, {
    onCompleted: (data) => {
      setUserProducts(data.viewProductsByUser);
    },
  });

  if (loading) return <div>Loading...</div>;

  return (
    <ScrollArea h={"75vh"}>
      <SimpleGrid cols={1}>
        {userProducts.length > 0 ? (
          userProducts.map((product: IProduct) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <h1>No Products Yet</h1>
        )}
      </SimpleGrid>
    </ScrollArea>
  );
};

export default MyProducts;
