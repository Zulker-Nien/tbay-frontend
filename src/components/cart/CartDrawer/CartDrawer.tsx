import { useQuery } from "@apollo/client";
import {
  Button,
  Drawer,
  Group,
  Stack,
  Text,
  Box,
  Flex,
  ScrollArea,
  Pill,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconShoppingCart } from "@tabler/icons-react";
import { FETCH_CART } from "../../../graphql/query";
import { CartList } from "../../../types/cart.types";
import { useCartStore } from "../../../store/cartStore";
import { useAuthStore } from "../../../store/authStore";
import { useEffect } from "react";
import { usePlaceOrder } from "../../../hooks/usePlaceOrder";
import CartInformationCard from "./CartInformationCard";

const CartDrawer = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { isAuthenticated, user } = useAuthStore();
  const setUserCart = useCartStore((state) => state.setUserCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const userCart = useCartStore((state) => state.userCart);
  const { placeOrder, loading: orderLoading } = usePlaceOrder();

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
  const handlePlaceOrder = async () => {
    if (userCart?.id) {
      await placeOrder(parseInt(userCart.id));
      close();
    }
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
                {userCart.items.map((item) => {
                  return <CartInformationCard item={item} />;
                })}
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
              onClick={handlePlaceOrder}
              disabled={!userCart?.items?.length}
              loading={orderLoading}
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
