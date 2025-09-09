import { Module } from '@nestjs/common';

import { OrderV3Service } from '~/api/v3/order/application/orderV3.service';
import { OrderProcessor } from '~/api/v3/order/domain/order.processor';
import { OrderV3Controller } from '~/api/v3/order/presentation/orderV3.controller';
import { QueueModule } from '~/infra/queue/queue.module';

@Module({
    imports: [QueueModule],
    providers: [OrderV3Service, OrderProcessor],
    controllers: [OrderV3Controller],
})
export class OrderV3Module {}
