import { OrderService } from "@api/v1/order/application/Order.service";
import { OrderRequestDto, OrderResponseDto } from "@api/v1/order/domain/Order.dto";
import { Jwt } from "@global/jwt/decorator/Jwt.decorator";
import { CommonGuard } from "@global/jwt/guard/Common.guard";
import { JwtPayload } from "@global/jwt/payload/JwtPayload";
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Order APIs")
@Controller("v1/orders")
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(CommonGuard)
    @ApiBearerAuth("Authorization")
    @ApiOperation({ summary: "상품 주문" })
    @ApiResponse({ status: HttpStatus.CREATED, type: OrderResponseDto })
    async order(@Jwt() jwtPayload: JwtPayload, @Body() orderRequestDto: OrderRequestDto) {
        return await this.orderService.order(jwtPayload, orderRequestDto);
    }
}
