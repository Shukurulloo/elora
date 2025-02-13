import { ObjectId } from "mongoose"
import { OrderStatus } from "../enums/order.enum";
import { Product } from "./product";

export interface OrderItem {
    _id: ObjectId;
    itemQuantity: number;
    itemPrice: number;
    orderId: ObjectId;
    productId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface Order {
    _id: ObjectId; // mongoDb auto idni hosl qilishi uchn
    orderTotal: number;
    orderDelivery: number;
    orderStatus: OrderStatus;
    memberId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    /** from aggregation **/
    orderItems: OrderItem[];
    productData: Product[];  // productdan tashkil topgan array
}

export interface OrderItemInput {
    itemQuantity: number;
    itemPrice: number;
    productId: ObjectId;
    orderId?: ObjectId;   // bu bizni postmanimizdan kemedi o'zimz hosl qilamz
}

export interface OrderInquiry {  // kirib kelayotgan malumotlar uchn
    page: number;
    limit: number;
    orderStatus: OrderStatus; // enum
}

export interface OrderUpdateInput {
    orderId: string;
    orderStatus: OrderStatus;
} 