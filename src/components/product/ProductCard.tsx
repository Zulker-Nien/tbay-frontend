import { useMemo } from "react";
import {
  Card,
  Text,
  Badge,
  Group,
  Flex,
  Stack,
  Divider,
  Skeleton,
} from "@mantine/core";
import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { FETCH_ALL_CATEGORIES } from "../../graphql/query";
import { useAuthStore } from "../../store/authStore";
import { useProductStore } from "../../store/productStore";
import ProductDelete from "./delete/ProductDelete";
import ProductEdit from "./edit/ProductEdit";
import { IProduct } from "../../types/product.types";
import CartItem from "../cart/CartItem/CartItem";

export const ProductCard = ({ product }: { product: IProduct }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const isOwner = user?.id === product.owner.id;

  const isDashboard = location.pathname === "/dashboard";
  const { setCategories, categories } = useProductStore();
  const { loading } = useQuery(FETCH_ALL_CATEGORIES, {
    onCompleted: (data) => setCategories(data.fetchAllCategories),
  });

  const productCategories = useMemo(() => {
    if (!categories.length || !product.categories.length) return [];

    return product.categories
      .map((categoryId) => categories.find((cat) => cat.id === categoryId.id))
      .filter((category): category is (typeof categories)[0] => !!category)
      .map((category) => category.name);
  }, [categories, product.categories]);

  if (loading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
        <Stack>
          <Skeleton height={20} width="60%" />
          <Skeleton height={15} width="40%" />
          <Skeleton height={60} />
          <Group>
            <Skeleton height={36} width={100} />
            <Skeleton height={36} width={100} />
          </Group>
        </Stack>
      </Card>
    );
  }

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      w="100%"
      style={{
        borderColor: isOwner ? "skyblue" : undefined,
      }}
    >
      <Stack gap={"xs"}>
        <Flex justify="space-between" align={"center"}>
          <Text size="xl" fw={"bolder"} w={"50%"}>
            {product.title}
          </Text>
          {isOwner && <Badge variant="dot">Your Product</Badge>}
        </Flex>
        {productCategories.length > 0 && (
          <Flex gap="xs">
            {productCategories.map((categoryName, index) => (
              <Badge
                key={`${categoryName}-${index}`}
                variant="light"
                color="violet"
              >
                {categoryName}
              </Badge>
            ))}
          </Flex>
        )}
        <Divider />
        {isDashboard && (
          <Badge
            radius={"sm"}
            size="xl"
            bg={product.quantity < 3 ? "red" : "green"}
          >
            {product.quantity} in stock
          </Badge>
        )}
        <Flex direction={"column"}>
          <Text size="sm" c="dimmed">
            Product Description:
          </Text>
          <Text truncate={"end"}>{product.description}</Text>
        </Flex>
        <Flex justify="space-between" align={"center"}>
          <Flex gap={"sm"}>
            {product.saleDetails?.price && (
              <Text size="md" c={"blue.8"} fw={700}>
                Buy - $
                {product.saleDetails.price !== null &&
                  product.saleDetails.price}
              </Text>
            )}
            {product.available === "BOTH" && <Text size="md">or</Text>}
            {product.rentDetails?.price && (
              <Text size="md" c="indigo.6" fw={700}>
                Rent - $
                {product.rentDetails.price !== null &&
                  product.rentDetails.price}{" "}
                / day
              </Text>
            )}
          </Flex>
          {isOwner ? (
            isDashboard && (
              <Group>
                <Flex gap={10} justify="flex-end" align="center">
                  <ProductDelete productId={product.id} />
                  <ProductEdit product={product} />
                </Flex>
              </Group>
            )
          ) : (
            <CartItem product={product} />
          )}
        </Flex>
      </Stack>
    </Card>
  );
};
