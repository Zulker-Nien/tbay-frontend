import { useMutation } from "@apollo/client";
import { PLACE_ORDER } from "../graphql/mutation";
import { FETCH_CART } from "../graphql/query";
import { useCartStore } from "../store/cartStore";
import { notifications } from "@mantine/notifications";

interface OrderResponse {
  createOrder: {
    id: string;
    totalAmount: number;
    createdAt: string;
    items: Array<{
      id: string;
      price: number;
      quantity: number;
      orderType: string;
      startDate: string;
      endDate: string;
      product: {
        id: string;
        title: string;
        description: string;
      };
      buyer: {
        id: string;
        email: string;
      };
      seller: {
        id: string;
        email: string;
      };
      renter: {
        id: string;
        email: string;
      };
      lender: {
        id: string;
        email: string;
      };
    }>;
  };
}

export const usePlaceOrder = () => {
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [placeOrder, { loading }] = useMutation<OrderResponse>(PLACE_ORDER, {
    onCompleted: (data) => {
      if (data?.createOrder) {
        notifications.show({
          title: "Success",
          message: "Order placed successfully!",
          color: "green",
        });
        clearCart();
      }
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to place order",
        color: "red",
      });
    },
    refetchQueries: [{ query: FETCH_CART }],
  });

  const handlePlaceOrder = async (cartId: number) => {
    try {
      await placeOrder({
        variables: {
          input: {
            cartId
          }
        }
      });
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return {
    placeOrder: handlePlaceOrder,
    loading
  };
};