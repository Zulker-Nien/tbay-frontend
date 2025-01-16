import { Button, Card, Flex, Group, Pill, Stack, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { CartItem } from "../../../types/cart.types";
import { useMutation } from "@apollo/client";
import { REMOVE_FROM_CART } from "../../../graphql/mutation";
import { FETCH_CART } from "../../../graphql/query";
import { useCartStore } from "../../../store/cartStore";

const CartInformationCard = ({ item }: { item: CartItem }) => {
  const setUserCart = useCartStore((state) => state.setUserCart);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART, {
    onCompleted: async (data) => {
      if (data?.removeFromCart) {
        setUserCart(data.removeFromCart);
      }
    },
    onError: (error) => {
      console.error("Error removing item from cart:", error);
    },
  });

  const handleRemove = async (itemId: number) => {
    try {
      await removeFromCart({
        variables: { cartId: itemId },
        refetchQueries: [{ query: FETCH_CART }],
      });
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card key={item.id} shadow="sm" p="md" radius="md" withBorder>
      <Stack>
        <Flex justify={"space-between"} align={"center"}>
          <Group>
            <Text fw={500} size="lg">
              {item.product.title}
            </Text>
            <Pill>{item.itemType}</Pill>
          </Group>
          <Button
            variant="subtle"
            color="red"
            onClick={() => handleRemove(parseInt(item.id))}
          >
            <IconTrash size={16} color="red" />
          </Button>
        </Flex>
        <Text size="sm" c="dimmed" mt="xs" truncate="end">
          {item.product.description}
        </Text>

        <Stack gap={10}>
          <Flex direction={"column"} gap={0}>
            {item.itemType === "RENT" && (
              <Text size="sm" mt="xs">
                Rent from {formatDate(item.startDate)} to{" "}
                {formatDate(item.endDate)}
              </Text>
            )}
            <Text size="sm">Quantity: {item.quantity}</Text>
          </Flex>
          <Flex justify={"flex-end"}>
            <Text size={"lg"} fw={"normal"}>
              Total Price: ${item.price.toFixed(2)}
            </Text>
          </Flex>
        </Stack>
      </Stack>
    </Card>
  );
};

export default CartInformationCard;
