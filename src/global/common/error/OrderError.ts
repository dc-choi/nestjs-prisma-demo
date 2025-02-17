import { ApiProperty } from '@nestjs/swagger';

export class OrderServerError {
    @ApiProperty({ example: '주문 처리중 서버 에러 발생' })
    message = '주문 처리중 서버 에러 발생';

    @ApiProperty({ example: 'ORDER_SERVER_ERROR' })
    type = 'ORDER_SERVER_ERROR';
}
