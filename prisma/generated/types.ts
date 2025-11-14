import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { MemberRole, ItemSaleStatus } from "./enums";

export type Item = {
    id: Generated<number>;
    name: string;
    supplyPrice: string;
    vat: string;
    totalPrice: string;
    isTaxFree: Generated<number>;
    sku: string;
    stock: Generated<number>;
    description: string | null;
    itemSaleStatus: Generated<ItemSaleStatus>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    deletedAt: Timestamp | null;
    memberId: number;
};
export type Member = {
    id: Generated<number>;
    name: string;
    email: string;
    hashedPassword: string | null;
    phone: string;
    role: Generated<MemberRole>;
    lastLoginAt: Timestamp | null;
    membershipAt: Timestamp | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    deletedAt: Timestamp | null;
};
export type Order = {
    id: Generated<number>;
    orderNumber: string;
    totalPrice: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    deletedAt: Timestamp | null;
    memberId: number;
};
export type OrderItem = {
    id: Generated<number>;
    price: string;
    quantity: Generated<number>;
    isTaxFree: Generated<number>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    deletedAt: Timestamp | null;
    itemId: number;
    orderId: number;
};
export type DB = {
    items: Item;
    members: Member;
    orderItems: OrderItem;
    orders: Order;
};
