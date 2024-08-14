import { emptyValue, invalidValue } from "@global/common/message/ErrorMessage";
import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class AuthTokenRequestDto {
    @ApiProperty({ description: "회원 ID", example: 1 })
    @IsNotEmpty({ message: emptyValue("회원 ID") })
    @IsNumber({}, { message: invalidValue("회원 ID") })
    memberId: bigint;

    @ApiProperty({ description: "refreshToken", example: "f7b3b3b3-4b3b-4b3b-4b3b-4b3b4b3b4b3b" })
    @IsString({ message: invalidValue("refreshToken") })
    @IsUUID(4, { message: invalidValue("refreshToken") })
    @IsNotEmpty({ message: emptyValue("refreshToken") })
    refreshToken: string;
}

export class AuthTokenResponseDto {
    @ApiProperty({ description: "accessToken 값" })
    accessToken: string;

    @ApiProperty({ description: "refreshToken 값" })
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
