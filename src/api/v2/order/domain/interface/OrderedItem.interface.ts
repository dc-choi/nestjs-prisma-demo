import { Decimal } from '@prisma/client/runtime/library';

export interface OrderedItemInterface {
    itemId: bigint;
    quantity: number;
    itemPrice: Decimal;
}
