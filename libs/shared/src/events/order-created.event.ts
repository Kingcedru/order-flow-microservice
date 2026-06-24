export interface OrderCreatedEvent {
  orderId: string;
  customerId: string;
  items: { productId: string; quantity: number }[];
  totalAmount: number;
  createdAt: string;
}