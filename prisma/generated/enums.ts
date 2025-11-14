export const MemberRole = {
    ADMIN: "ADMIN",
    SELLER: "SELLER",
    CUSTOMER: "CUSTOMER",
    GUEST: "GUEST"
} as const;
export type MemberRole = (typeof MemberRole)[keyof typeof MemberRole];
export const ItemSaleStatus = {
    ALLOW: "ALLOW",
    DENY: "DENY"
} as const;
export type ItemSaleStatus = (typeof ItemSaleStatus)[keyof typeof ItemSaleStatus];
