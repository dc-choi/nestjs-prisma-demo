import { TransactionHost, Transactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

import { v4 as uuid } from 'uuid';
import { OrderV2RequestDto, OrderV2ResponseDto } from '~/api/v2/order/domain/OrderV2.dto';
import { ItemStockShortage, NotExistingItem } from '~/global/common/error/ItemError';
import { OrderServerError } from '~/global/common/error/OrderError';
import { MutexService } from '~/global/common/lock/Mutex.service';
import { JwtPayload } from '~/global/jwt/payload/JwtPayload';

@Injectable()
export class OrderV2Service {
    constructor(
        private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
        private readonly mutexService: MutexService
    ) {}

    async order(jwtPayload: JwtPayload, orderV2RequestDto: OrderV2RequestDto) {
        return await this.mutexService.lock(async () => {
            return await this.transactionOrder(jwtPayload, orderV2RequestDto);
        });
    }

    @Transactional<TransactionalAdapterPrisma>()
    private async transactionOrder(jwtPayload: JwtPayload, orderV2RequestDto: OrderV2RequestDto) {
        const { memberId } = jwtPayload;
        const { data: requestedData } = orderV2RequestDto;

        const items: { itemId: bigint; quantity: number; itemPrice: Decimal }[] = [];
        let totalPrice = new Decimal(0);

        await Promise.all(
            requestedData.map(async (orderItem) => {
                const { itemId, quantity } = orderItem;

                // 주문 요청한 상품의 존재 여부 확인, 재고 확인
                const item = await this.txHost.tx.item.findFirst({
                    where: {
                        id: itemId,
                    },
                });
                if (!item) throw new BadRequestException(new NotExistingItem());
                if (item.stock < quantity) throw new BadRequestException(new ItemStockShortage());

                // 주문 가격 계산
                const itemPrice = item.totalPrice.mul(quantity);
                totalPrice = totalPrice.add(itemPrice);
                items.push({ itemId, quantity, itemPrice });

                // 주문 요청한 상품의 재고 차감
                await this.txHost.tx.item.update({
                    where: {
                        id: itemId,
                    },
                    data: {
                        stock: {
                            decrement: quantity,
                        },
                    },
                });
            })
        );

        // 주문 생성
        const { id } = await this.txHost.tx.order.create({
            data: {
                orderNumber: uuid(),
                totalPrice,
                memberId,
            },
        });
        const { count } = await this.txHost.tx.orderItem.createMany({
            data: items.map(({ itemId, quantity, itemPrice }) => ({
                orderId: id,
                itemId,
                quantity,
                price: itemPrice,
            })),
        });
        if (items.length !== count) throw new InternalServerErrorException(new OrderServerError());

        return new OrderV2ResponseDto(id);
    }
}
