import { useQuery, useMutation } from "@apollo/client";
import {
  Button,
  Drawer,
  Group,
  Stack,
  Text,
  Card,
  Box,
  Flex,
  ScrollArea,
  Pill,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconShoppingCart, IconTrash } from "@tabler/icons-react";
import { FETCH_CART } from "../../../graphql/query";
import { REMOVE_FROM_CART } from "../../../graphql/mutation";
import { CartList } from "../../../types/cart.types";
import { useCartStore } from "../../../store/cartStore";
import { useAuthStore } from "../../../store/authStore";
import { useEffect } from "react";

const CartDrawer = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { isAuthenticated, user } = useAuthStore();
  const setUserCart = useCartStore((state) => state.setUserCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const userCart = useCartStore((state) => state.userCart);

  const { loading, refetch, data } = useQuery<{ getCart: CartList }>(
    FETCH_CART,
    {
      fetchPolicy: "cache-and-network",
      onCompleted: (data) => {
        if (data?.getCart) {
          setUserCart(data.getCart);
        }
      },
    }
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      refetch();
    } else {
      clearCart();
    }
  }, [clearCart, isAuthenticated, refetch, user]);

  useEffect(() => {
    if (data?.getCart) {
      setUserCart(data.getCart);
    }
  }, [data, setUserCart]);

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

  if (loading && !userCart) return <div>Loading...</div>;

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="MY CART"
        position="right"
        size="md"
        padding="md"
      >
        <Flex direction="column" h={"90vh"}>
          <ScrollArea h="calc(80vh - 200px)">
            {!userCart?.items?.length ? (
              <Text ta="center" c="dimmed" mt="xl">
                Your cart is empty
              </Text>
            ) : (
              <Stack>
                {userCart.items.map((item) => (
                  <Card key={item.id} shadow="sm" p="md" radius="md" withBorder>
                    <Flex justify="space-between">
                      <Box>
                        <Text fw={500} size="lg">
                          {item.product.title}
                        </Text>
                        <Text size="sm" c="dimmed" mt="xs">
                          {item.product.description}
                        </Text>
                        {item.itemType === "RENTAL" && (
                          <Text size="sm" mt="xs">
                            {formatDate(item.startDate)} -{" "}
                            {formatDate(item.endDate)}
                          </Text>
                        )}
                        <Group mt="sm">
                          <Text>Quantity: {item.quantity}</Text>
                          <Text fw={500}>${item.price.toFixed(2)}</Text>
                        </Group>
                      </Box>
                      <Button
                        variant="subtle"
                        color="red"
                        onClick={() => handleRemove(parseInt(item.id))}
                      >
                        <IconTrash size={16} />
                      </Button>
                    </Flex>
                  </Card>
                ))}
              </Stack>
            )}
          </ScrollArea>
          <Box mt="auto" pt="md">
            <Divider />
            <Group my="md">
              <Text fw={500}>Total:</Text>
              <Text fw={500}>${userCart?.totalPrice?.toFixed(2)}</Text>
            </Group>

            <Button
              fullWidth
              size="md"
              onClick={() => {}}
              disabled={!userCart?.items?.length}
            >
              Place Order
            </Button>
          </Box>
        </Flex>
      </Drawer>

      {isAuthenticated && (
        <Button variant="transparent" onClick={open}>
          <IconShoppingCart />
          <Pill radius={"xl"} bg={"red.9"}>
            {userCart?.items?.length || 0}
          </Pill>
        </Button>
      )}
    </>
  );
};

export default CartDrawer;
