import type { ColumnType } from 'kysely';

export type Generated<T> =
    T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const MemberRole = {
    ADMIN: 'ADMIN',
    SELLER: 'SELLER',
    CUSTOMER: 'CUSTOMER',
    GUEST: 'GUEST',
} as const;
export type MemberRole = (typeof MemberRole)[keyof typeof MemberRole];
export const ItemSaleStatus = {
    ALLOW: 'ALLOW',
    DENY: 'DENY',
} as const;
export type ItemSaleStatus = (typeof ItemSaleStatus)[keyof typeof ItemSaleStatus];
export type Item = {
    id: Generated<number>;
    name: string;
    supply_price: string;
    vat: string;
    total_price: string;
    is_tax_free: Generated<number>;
    sku: string;
    stock: Generated<number>;
    description: string | null;
    item_sale_status: Generated<ItemSaleStatus>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
    member_id: number;
};
export type Member = {
    id: Generated<number>;
    name: string;
    email: string;
    hashed_password: string | null;
    phone: string;
    role: Generated<MemberRole>;
    last_login_at: Timestamp | null;
    membership_at: Timestamp | null;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
};
export type Order = {
    id: Generated<number>;
    order_number: string;
    total_price: string;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
    member_id: number;
};
export type OrderItem = {
    id: Generated<number>;
    price: string;
    quantity: Generated<number>;
    is_tax_free: Generated<number>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
    item_id: number;
    order_id: number;
};
export type DB = {
    items: Item;
    members: Member;
    order_items: OrderItem;
    orders: Order;
};
