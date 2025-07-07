import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { OrderV3Service } from '~/api/v3/application/orderV3.service';
import { OrderV3RequestDto, OrderV3ResponseDto } from '~/api/v3/domain/dto/orderV3.dto';
import { Jwt } from '~/global/jwt/decorator/jwt.decorator';
import { CommonGuard } from '~/global/jwt/guard/common.guard';
import { JwtPayload } from '~/global/jwt/payload/jwt.payload';

@ApiTags('Order APIs')
@Controller('v3/orders')
export class OrderV3Controller {
    constructor(private readonly orderV3Service: OrderV3Service) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(CommonGuard)
    @ApiBearerAuth('Authorization')
    @ApiOperation({ summary: '상품 주문' })
    @ApiResponse({ status: HttpStatus.CREATED, type: OrderV3ResponseDto })
    async order(@Jwt() jwtPayload: JwtPayload, @Body() orderRequestDto: OrderV3RequestDto) {
        return await this.orderV3Service.order(jwtPayload, orderRequestDto);
    }
}
