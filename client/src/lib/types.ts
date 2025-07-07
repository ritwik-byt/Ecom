import type { Product, Category, User, Order, CartItem } from "@shared/schema";

export interface CartItemWithProduct extends CartItem {
  product?: Product;
}

export interface OrderWithDetails extends Order {
  items: OrderItemWithProduct[];
  user?: User;
}

export interface OrderItemWithProduct {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
  product?: Product;
}

export { type Product, type Category, type User, type Order, type CartItem };
