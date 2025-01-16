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
  Button,
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
import { notifications } from "@mantine/notifications";

export const ProductCard = ({ product }: { product: IProduct }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const isOwner = user?.id === product.owner.id;

  const isDashboard = location.pathname === "/dashboard";
  const { setCategories, categories } = useProductStore();
  const { isAuthenticated } = useAuthStore();
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
  const SaleDetails = product.saleDetails ? product.saleDetails.price : null;
  const RentDetails = product.rentDetails
    ? product.rentDetails.price > 0 && product.rentDetails.price
    : null;

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
            {SaleDetails && <Text size="md" c={"indigo"} fw={700}>
              Buy: ${SaleDetails}
            </Text>}
            {product.available === "BOTH" && <Text size="md">or</Text>}
            {RentDetails && <Text size="md" c="lime" fw={700}>
              Rent: ${RentDetails}/ day
            </Text>}
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
          ) : isAuthenticated ? (
            <CartItem product={product} />
          ) : (
            <Button
              bg={"dark"}
              onClick={() => {
                notifications.show({
                  title: "ALMOST THERE",
                  message: "Please Login / Register to add to cart",
                  position: "bottom-center",
                  color: "Red",
                });
              }}
            >
              Add to Cart
            </Button>
          )}
        </Flex>
      </Stack>
    </Card>
  );
};
