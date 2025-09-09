import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { emptyValue, invalidMax, invalidMin, invalidValue } from '~/global/common/message/error.message';
import { IsBigInt } from '~/global/common/utils/isBigInt';

export class OrderV3ItemRequest {
    @ApiProperty({ description: '상품 ID', example: 1n })
    @IsNotEmpty({ message: emptyValue('상품 ID') })
    @IsBigInt({ message: invalidValue('상품 ID') })
    itemId: bigint;

    @ApiProperty({ description: '수량', example: 1 })
    @IsNotEmpty({ message: emptyValue('수량') })
    @IsNumber({}, { message: invalidValue('수량') })
    @Min(1, { message: invalidMin('수량', 1) })
    @Max(Number.MAX_SAFE_INTEGER, { message: invalidMax('수량', Number.MAX_SAFE_INTEGER) })
    quantity: number;
}

export class OrderV3RequestDto {
    @ApiProperty({ type: [OrderV3ItemRequest] })
    data: OrderV3ItemRequest[];
}

export class OrderV3ResponseDto {
    @ApiProperty({ description: '주문 완료', example: '주문 접수가 완료되었습니다.' })
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}
