import { Module } from '@nestjs/common';

import { OrderService } from '~/api/v1/order/application/order.service';
import { OrderController } from '~/api/v1/order/presentation/order.controller';

@Module({
    imports: [],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}
