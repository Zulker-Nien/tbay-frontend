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
import Cart from "../cart/Cart";
import { IProduct } from "../../types/product.types";

export const ProductCard = ({ product }: {product:IProduct}) => {
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

  const formattedDate = useMemo(() => {
    return new Date(product.createdAt).toLocaleDateString();
  }, [product.createdAt]);

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
      padding="lg"
      radius="md"
      withBorder
      w="100%"
      style={{
        borderColor: isOwner ? "skyblue" : undefined,
      }}
    >
      <Stack>
        <Group justify="space-between">
          <Group>
            <Text size="xl" fw={700}>
              {product.title}
            </Text>
            {isOwner && <Badge variant="dot">Your Product</Badge>}
          </Group>
          <Text c="white" fw={500} size="xs">
            {formattedDate}
          </Text>
        </Group>

        <Flex
          direction={"column"}
          gap={10}
          mih={60}
          justify={"flex-start"}
          wrap={"wrap"}
        >
          <Text fw={500} size="sm">
            Categories:{" "}
          </Text>
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
        </Flex>

        <Divider />

        <Text size="sm" c="dimmed" lineClamp={2}>
          {product.description}
        </Text>

        <Divider />

        <Group justify="space-between" align="center">
          <Flex direction="column" gap="xs">
            {product.saleDetails?.price && (
              <Text size="md" c="blue" fw={700}>
                On Sale - ${product.saleDetails.price}
              </Text>
            )}
            {product.rentDetails?.price && (
              <Text size="md" c="teal" fw={700}>
                Rent For - ${product.rentDetails.price} / day
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
            <Cart product={product} />
          )}
        </Group>
      </Stack>
    </Card>
  );
};
