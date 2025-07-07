import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';

import { Queue, QueueEvents } from 'bullmq';
import { OrderV3RequestDto, OrderV3ResponseDto } from '~/api/v3/domain/dto/orderV3.dto';
import { checkQueueMessage } from '~/global/common/error/system.error';
import { DistributedLock } from '~/global/common/lock/DistributedLock';
import { QueueMessage } from '~/global/common/message/queue.message';
import { JwtPayload } from '~/global/jwt/payload/jwt.payload';
import { CREATE_ORDER, ORDER_QUEUE } from '~/infra/queue/queue.symbol';

@Injectable()
export class OrderV3Service {
    constructor(
        @InjectQueue(ORDER_QUEUE)
        private readonly orderQueue: Queue<
            { jwtPayload: JwtPayload; orderV3RequestDto: OrderV3RequestDto },
            QueueMessage,
            string
        >,
        @Inject(CREATE_ORDER)
        private readonly queueEvents: QueueEvents
    ) {}

    @DistributedLock((_: JwtPayload, orderV3RequestDto: OrderV3RequestDto) => {
        const itemIds = orderV3RequestDto.data.map((obj) => obj.itemId).sort();
        return itemIds.map((id) => `lock:item:${id}`);
    })
    async order(jwtPayload: JwtPayload, orderV3RequestDto: OrderV3RequestDto) {
        const job = await this.orderQueue.add(
            ORDER_QUEUE,
            { jwtPayload, orderV3RequestDto },
            { removeOnComplete: false }
        );

        const result = await job.waitUntilFinished(this.queueEvents, 2000);
        checkQueueMessage(result);

        return new OrderV3ResponseDto(result.message);
    }
}
