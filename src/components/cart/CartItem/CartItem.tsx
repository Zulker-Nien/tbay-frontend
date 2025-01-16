import { Button, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "@apollo/client";
import { notifications } from "@mantine/notifications";
import { CartForm } from "./CartForm";
import { useCartForm } from "../../../hooks/useCartForm";
import { ADD_BUY_TO_CART, ADD_RENT_TO_CART } from "../../../graphql/mutation";
import { CartFormValues, CartProps } from "../../../types/cart.types";
import { FETCH_CART } from "../../../graphql/query";
import { useCartStore } from "../../../store/cartStore";
import { CartList } from "../../../types/cart.types";

const CartItem = ({ product }: CartProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const setUserCart = useCartStore((state) => state.setUserCart);
  const updateCartItems = useCartStore((state) => state.updateCartItems);

  const { refetch } = useQuery<{ getCart: CartList }>(FETCH_CART, {
    fetchPolicy: "network-only",
    skip: true,
  });
  

  const [addBuyToCart, { loading: buyLoading }] = useMutation(ADD_BUY_TO_CART, {
    onCompleted: async (data) => {
      if (data.addBuyToCart) {
        setUserCart(data.addBuyToCart);
        updateCartItems(data.addBuyToCart.items);
        await refetch()
      }
    },
    update: (cache) => {
      cache.evict({ fieldName: "getCart" });
      cache.gc();
    },
  });

  const [addRentToCart, { loading: rentLoading }] = useMutation(
    ADD_RENT_TO_CART,
    {
      onCompleted: async (data) => {
        if (data.addRentToCart) {
          setUserCart(data.addRentToCart);
          updateCartItems(data.addRentToCart.items);
        }
      },
      update: (cache) => {
        cache.evict({ fieldName: "getCart" });
        cache.gc();
      },
    }
  );

  const form = useCartForm(product);

  const handleSubmit = async (values: CartFormValues) => {
    try {
      const mutation = values.itemType === "BUY" ? addBuyToCart : addRentToCart;
      const input = {
        productId: product.id,
        itemType: values.itemType,
        quantity: values.quantity,
        ...(values.itemType === "RENT" && {
          startDate: values.startDate?.toISOString(),
          endDate: values.endDate?.toISOString(),
        }),
      };

      await mutation({
        variables: { input },
        refetchQueries: [{ query: FETCH_CART }],
      });

      notifications.show({
        title: "Success",
        message: "Product added to cart successfully",
        color: "green",
      });

      close();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: `${error}`,
        color: "red",
      });
    }
  };

  const isLoading = buyLoading || rentLoading;

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={<h3 style={{ margin: "0" }}>Add this item to your cart</h3>}
        centered
      >
        <Stack gap={"0"}>
          <Text size={"2rem"}>{product.title}</Text>
          <Text c={"#606060"} fw={"bolder"}>
            Only {product.quantity} in stock
          </Text>
        </Stack>
        <CartForm
          form={form}
          product={product}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Modal>

      <Button color="dark" onClick={open}>
        Add to Cart
      </Button>
    </>
  );
};

export default CartItem;
