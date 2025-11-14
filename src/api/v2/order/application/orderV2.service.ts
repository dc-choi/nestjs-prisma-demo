import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Item } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { REPOSITORY, Repository } from '../../../../../prisma/repository';

import { v4 as uuid } from 'uuid';
import { OrderV2RequestDto, OrderV2ResponseDto } from '~/api/v2/order/domain/dto/orderV2.dto';
import { OrderedItemInterface } from '~/api/v2/order/domain/interface/orderedItem.interface';
import { ItemStockShortage, NotExistingItem } from '~/global/common/error/item.error';
import { OrderServerError } from '~/global/common/error/order.error';
import { JwtPayload } from '~/global/jwt/payload/jwt.payload';

@Injectable()
export class OrderV2Service {
    constructor(@Inject(REPOSITORY) private readonly repository: Repository) {}

    async order(jwtPayload: JwtPayload, orderV2RequestDto: OrderV2RequestDto) {
        const { memberId } = jwtPayload;
        const { data: requestedData } = orderV2RequestDto;

        const items: OrderedItemInterface[] = [];
        let totalPrice = new Decimal(0);

        const id = await this.repository.$transaction(async (tx) => {
            for (const orderItem of requestedData) {
                const { itemId, quantity } = orderItem;

                const item = await tx.$kysely
                    .selectFrom('items')
                    .selectAll()
                    .where('id', '=', Number(itemId))
                    .forUpdate()
                    .executeTakeFirstOrThrow()
                    .then((result) => {
                        const { id, memberId, totalPrice, supplyPrice } = result;

                        return {
                            ...result,
                            id: BigInt(id),
                            memberId: BigInt(memberId),
                            supplyPrice: new Decimal(supplyPrice),
                            totalPrice: new Decimal(totalPrice),
                        } as unknown as Item;
                    });

                if (!item) throw new BadRequestException(new NotExistingItem());
                const { stock, totalPrice: storedTotalPrice } = item;
                if (stock < quantity) throw new BadRequestException(new ItemStockShortage());

                // 주문 가격 계산
                const itemPrice = storedTotalPrice.mul(quantity);
                totalPrice = totalPrice.add(itemPrice);
                items.push({ itemId, quantity, itemPrice });

                await tx.item.update({
                    where: {
                        id: itemId,
                    },
                    data: {
                        stock: {
                            decrement: quantity,
                        },
                    },
                });
            }

            // 주문 생성
            const { id } = await tx.order.create({
                data: {
                    orderNumber: uuid(),
                    totalPrice,
                    memberId,
                },
            });
            const { count } = await tx.orderItem.createMany({
                data: items.map(({ itemId, quantity, itemPrice }) => ({
                    orderId: id,
                    itemId,
                    quantity,
                    price: itemPrice,
                })),
            });
            if (items.length !== count) throw new InternalServerErrorException(new OrderServerError());

            return id;
        });

        return new OrderV2ResponseDto(id);
    }
}
