import { Types } from "mongoose";
import { OrderStatus } from "../enums/order.enum";
import { Product } from "./product";

export interface OrderItem {
  _id: Types.ObjectId;
  itemQuantity: number;
  itemPrice: number;
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: Types.ObjectId;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus | string;
  memberId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  /** from aggregation */
  orderItems?: OrderItem[];
  productData?: Product[];
}

export interface OrderItemInput {
  productId: Types.ObjectId;
  itemPrice: number;
  itemQuantity: number;
  orderId?: Types.ObjectId;
}

export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus: OrderStatus;
}

export interface OrderUpdateInput {
  orderId: string;
  orderStatus: OrderStatus;
}
