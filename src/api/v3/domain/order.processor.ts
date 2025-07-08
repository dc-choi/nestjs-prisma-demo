import { TransactionHost, Transactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { BadRequestException, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

import { Job } from 'bullmq';
import { v7 as uuid } from 'uuid';
import { OrderedItemInterface } from '~/api/v2/order/domain/interface/orderedItem.interface';
import { OrderV3RequestDto } from '~/api/v3/domain/dto/orderV3.dto';
import { ItemStockShortage, NotExistingItem } from '~/global/common/error/item.error';
import { OrderServerError } from '~/global/common/error/order.error';
import { QueueMessage } from '~/global/common/message/queue.message';
import { JwtPayload } from '~/global/jwt/payload/jwt.payload';
import { ORDER_QUEUE } from '~/infra/queue/queue.symbol';

@Processor(ORDER_QUEUE)
export class OrderProcessor extends WorkerHost {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {
        super();
    }

    @Transactional<TransactionalAdapterPrisma>()
    async process(
        job: Job<{ jwtPayload: JwtPayload; orderV3RequestDto: OrderV3RequestDto }, QueueMessage, string>
    ): Promise<QueueMessage> {
        const { jwtPayload, orderV3RequestDto } = job.data;

        const { memberId } = jwtPayload;
        const { data: requestedData } = orderV3RequestDto;

        const items: OrderedItemInterface[] = [];
        let totalPrice = new Decimal(0);

        try {
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

            return {
                success: true,
                statusCode: 200,
                message: `${id}번 주문이 성공적으로 접수되었습니다. 총 ${totalPrice.toNumber()}원이 결제되었습니다.`,
            };
        } catch (error: unknown) {
            if (error instanceof HttpException) {
                return {
                    success: false,
                    message: error.message,
                    statusCode: error.getStatus(),
                };
            }

            if (error instanceof Error) {
                return {
                    success: false,
                    message: error.message,
                    statusCode: 500,
                };
            }

            // unknown 타입이거나 non-standard error
            return {
                success: false,
                message: 'Unknown error',
                statusCode: 500,
            };
        }
    }
}
