import { Container, Stack } from "@mantine/core";
import { ProductGrid } from "../components/product/ProductGrid";
import { useProductStore } from "../store/productStore";
import { useQuery } from "@apollo/client";
import { FETCH_ALL_CATEGORIES } from "../graphql/query";

function Home() {
  const { setCategories } = useProductStore();
  const { loading } = useQuery(FETCH_ALL_CATEGORIES, {
    onCompleted: (data) => setCategories(data.fetchAllCategories),
  });
  if (loading) return <div>Loading...</div>;
  return (
    <Container size={"xl"} mt={"xl"}>
      <Stack>
        <ProductGrid />
      </Stack>
    </Container>
  );
}

export default Home;
