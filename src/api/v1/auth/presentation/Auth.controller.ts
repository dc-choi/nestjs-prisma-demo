import { InvalidIdOrPassword, InvalidRefreshToken } from "@global/common/error/AuthError";
import { NotExistingMember } from "@global/common/error/MemberError";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthService } from "../application/Auth.service";
import { AuthTokenRequestDto, AuthTokenResponseDto } from "../domain/dto/AuthToken.dto";
import { LoginRequestDto, LoginResponseDto } from "../domain/dto/Login.dto";

@ApiTags("Auth API's")
@Controller("v1/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "사용자 로그인" })
    @ApiResponse({ status: HttpStatus.OK, type: LoginResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: InvalidIdOrPassword })
    async login(@Body() loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
        return await this.authService.login(loginRequestDto);
    }

    @Post("token")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "토큰 재발급" })
    @ApiResponse({ status: HttpStatus.OK, type: AuthTokenResponseDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: NotExistingMember })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: InvalidRefreshToken })
    async token(@Body() authTokenRequstdto: AuthTokenRequestDto): Promise<AuthTokenResponseDto> {
        return await this.authService.token(authTokenRequstdto);
    }
}
