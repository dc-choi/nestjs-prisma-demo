import { Module } from "@nestjs/common";

import { OrderService } from "~/api/v1/order/application/Order.service";
import { OrderController } from "~/api/v1/order/presentation/Order.controller";

@Module({
    imports: [],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}
