import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { OrderV2Service } from '~/api/v2/order/application/OrderV2.service';
import { OrderV2RequestDto, OrderV2ResponseDto } from '~/api/v2/order/domain/dto/OrderV2.dto';
import { Jwt } from '~/global/jwt/decorator/Jwt.decorator';
import { CommonGuard } from '~/global/jwt/guard/Common.guard';
import { JwtPayload } from '~/global/jwt/payload/JwtPayload';

@ApiTags('Order APIs')
@Controller('v2/orders')
export class OrderV2Controller {
    constructor(private readonly orderV2Service: OrderV2Service) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(CommonGuard)
    @ApiBearerAuth('Authorization')
    @ApiOperation({ summary: '상품 주문' })
    @ApiResponse({ status: HttpStatus.CREATED, type: OrderV2ResponseDto })
    async order(@Jwt() jwtPayload: JwtPayload, @Body() orderRequestDto: OrderV2RequestDto) {
        return await this.orderV2Service.order(jwtPayload, orderRequestDto);
    }
}
