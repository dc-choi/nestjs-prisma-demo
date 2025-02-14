import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { emptyValue, invalidMax, invalidMin, invalidValue } from "~/global/common/message/ErrorMessage";
import { IsBigInt } from "~/global/common/utils/IsBigInt";

export class OrderItemRequest {
    @ApiProperty({ description: "상품 ID", example: 1n })
    @IsNotEmpty({ message: emptyValue("상품 ID") })
    @IsBigInt({ message: invalidValue("상품 ID") })
    itemId: bigint;

    @ApiProperty({ description: "수량", example: 1 })
    @IsNotEmpty({ message: emptyValue("수량") })
    @IsNumber({}, { message: invalidValue("수량") })
    @Min(1, { message: invalidMin("수량", 1) })
    @Max(Number.MAX_SAFE_INTEGER, { message: invalidMax("수량", Number.MAX_SAFE_INTEGER) })
    quantity: number;
}

export class OrderRequestDto {
    @ApiProperty({ type: [OrderItemRequest] })
    data: OrderItemRequest[];
}

export class OrderResponseDto {
    @ApiProperty({ description: "주문 ID", example: 1n })
    id: bigint;

    constructor(id: bigint) {
        this.id = id;
    }
}
