interface OrderItemDetailsEntity {
  id: number;
  orderId: number;
  productId: number;
  buyerId: string;
  sellerId: string;
  renterId: string;
  lenderId: string;
  price: number;
  orderType: string;
  quantity: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: number;
    title: string;
    description: string;
    price: number;
  };
  buyer: {
    id: string;
    name: string;
  };
  seller: {
    id: string;
    name: string;
  };
  renter?: {
    id: string;
    name: string;
  };
  lender?: {
    id: string;
    name: string;
  };
}

export interface OrderEntity {
  id: number;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDetailsEntity[];
}
