import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { emptyValue, invalidValue } from '~/global/common/message/ErrorMessage';

export class AuthTokenRequestDto {
    @ApiProperty({
        description: 'accessToken',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1iZXJJZCI6IjciLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcyNDA3MzI1MSwiZXhwIjoxNzI0MDgwNDUxfQ.33KgiWxeKml1O75L2QxmqFANjxcZRZm3HgHEHLmAIgE',
    })
    @IsString({ message: invalidValue('accessToken') })
    @IsNotEmpty({ message: emptyValue('accessToken') })
    accessToken: string;

    @ApiProperty({ description: 'refreshToken', example: 'f7b3b3b3-4b3b-4b3b-4b3b-4b3b4b3b4b3b' })
    @IsString({ message: invalidValue('refreshToken') })
    @IsUUID(4, { message: invalidValue('refreshToken') })
    @IsNotEmpty({ message: emptyValue('refreshToken') })
    refreshToken: string;
}

export class AuthTokenResponseDto {
    @ApiProperty({ description: 'accessToken 값' })
    accessToken: string;

    @ApiProperty({ description: 'refreshToken 값' })
    refreshToken: string;

    constructor(data?: IAuthTokenProps) {
        if (data) {
            this.accessToken = data.accessToken;
            this.refreshToken = data.refreshToken;
        }
    }

    public static toDto(data: IAuthTokenProps) {
        return new AuthTokenResponseDto(data);
    }
}

interface IAuthTokenProps {
    accessToken: string;
    refreshToken: string;
}
