import { InvalidIdOrPassword } from "@global/common/error/AuthError";
import { NotExistingMember } from "@global/common/error/MemberError";
import { EnvConfig } from "@global/env/Env.config";
import { TokenProvider } from "@global/jwt/TokenProvider";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AuthTokenRequestDto, AuthTokenResponseDto } from "../domain/dto/AuthToken.dto";
import { LoginRequestDto, LoginResponseDto } from "../domain/dto/Login.dto";

import dayjs from "dayjs";
import { Repository } from "prisma/repository";

@Injectable()
export class AuthService {
    constructor(
        private readonly repository: Repository,
        private readonly config: ConfigService<EnvConfig, true>,
        private readonly tokenProvider: TokenProvider
    ) {}

    async login(loginRequestDto: LoginRequestDto) {
        const secret = this.config.get<string>("SECRET");
        const member = LoginRequestDto.toEntity(loginRequestDto, secret);
        const { email, hashedPassword } = member;

        const findMember = await this.repository.member.findFirst({
            where: {
                email,
                hashedPassword,
            },
        });
        if (!findMember) throw new UnauthorizedException(new InvalidIdOrPassword());

        const { id, role } = findMember;
        const { accessToken, refreshToken } = await this.tokenProvider.generateToken(id, role);

        let isFirstLogin = false;
        if (!findMember.lastLoginAt) isFirstLogin = true;

        await this.repository.member.update({
            data: {
                lastLoginAt: dayjs().toDate(),
            },
            where: {
                id,
            },
        });

        return LoginResponseDto.toDto({
            accessToken,
            refreshToken,
            role,
            isFirstLogin,
        });
    }

    async token(authTokenRequstdto: AuthTokenRequestDto) {
        const { accessToken, refreshToken } = authTokenRequstdto;

        const { memberId, role } = await this.tokenProvider.velifyToken(accessToken, refreshToken);
        const findMember = await this.repository.member.findFirst({
            where: {
                id: memberId,
            },
        });
        if (!findMember) throw new UnauthorizedException(new NotExistingMember());

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await this.tokenProvider.generateToken(
            memberId,
            role
        );

        return AuthTokenResponseDto.toDto({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    }
}
