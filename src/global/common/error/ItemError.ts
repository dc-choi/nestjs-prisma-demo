import { ApiProperty } from '@nestjs/swagger';

export class NotExistingItem {
    @ApiProperty({ example: '존재하지 않는 상품입니다.' })
    message = '존재하지 않는 상품입니다.';

    @ApiProperty({ example: 'NOT_EXISTING_ITEM' })
    type = 'NOT_EXISTING_ITEM';
}

export class ItemStockShortage {
    @ApiProperty({ example: '주문하려는 상품의 재고가 부족합니다.' })
    message = '주문하려는 상품의 재고가 부족합니다.';

    @ApiProperty({ example: 'ITEM_STOCK_SHORTAGE' })
    type = 'ITEM_STOCK_SHORTAGE';
}
