import { ApiProperty } from "@nestjs/swagger";
import { MemberRole } from "@prisma/client";

export class Unauthorized {
    constructor(role?: MemberRole) {
        this.role = role;
    }

    @ApiProperty({ example: "인증되지 않았습니다." })
    message = "인증되지 않았습니다.";

    @ApiProperty({ example: "UNAUTHORIZED" })
    type = "UNAUTHORIZED";

    @ApiProperty({ example: MemberRole.GUEST })
    role?: MemberRole | null;
}

export class InvalidIdOrPassword {
    @ApiProperty({ example: "아이디 또는 패스워드가 잘못되었습니다." })
    message = "아이디 또는 패스워드가 잘못되었습니다.";

    @ApiProperty({ example: "INVALID_ID_OR_PASSWORD" })
    type = "INVALID_ID_OR_PASSWORD";
}

export class InvalidRefreshToken {
    @ApiProperty({ example: "refreshToken이 잘못되었습니다." })
    message = "refreshToken이 잘못되었습니다.";

    @ApiProperty({ example: "INVALID_REFRESH_TOKEN" })
    type = "INVALID_REFRESH_TOKEN";
}
