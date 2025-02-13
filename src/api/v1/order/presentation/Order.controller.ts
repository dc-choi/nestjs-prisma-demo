import { OrderService } from "@api/v1/order/application/Order.service";
import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Order APIs")
@Controller("v1/orders")
export class OrderController {
    constructor(private readonly orderService: OrderService) {}
}
