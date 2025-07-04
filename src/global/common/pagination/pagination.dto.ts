import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationRequestDto {
    @ApiProperty({ description: '페이지 번호', default: 1, example: 1, nullable: false, required: false })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    @Max(Number.MAX_SAFE_INTEGER)
    page = 1;

    @ApiProperty({ description: '페이지당 데이터 수', default: 10, example: 10, nullable: false, required: false })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    @Max(100)
    limit = 10;
}

export class PaginationResponseDto {
    @ApiProperty({ description: '페이지 번호', example: 1 })
    page: number;

    @ApiProperty({ description: '총 페이지 수', example: 1 })
    totalPage: number;

    @ApiProperty({ description: '페이지당 데이터 수', example: 10 })
    limit: number;

    @ApiProperty({ description: '총 데이터 수', example: 10, nullable: true, required: false })
    totalCount?: number;

    constructor(data: { page: number; totalPage: number; limit: number; totalCount?: number }) {
        this.page = data?.page;
        this.totalPage = data?.totalPage;
        this.limit = data?.limit;
        this.totalCount = data?.totalCount;
    }
}

export interface PageCount {
    count: number;
}
