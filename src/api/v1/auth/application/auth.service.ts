import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoginRequestDto, LoginResponseDto } from '../domain/dto/login.dto';
import { TokenRequestDto, TokenResponseDto } from '../domain/dto/token.dto';

import dayjs from 'dayjs';
import { Repository } from 'prisma/repository';
import { MemberDomain } from '~/api/v1/member/domain/member.domain';
import { InvalidIdOrPassword } from '~/global/common/error/auth.error';
import { NotExistingMember } from '~/global/common/error/member.error';
import { EnvConfig } from '~/global/config/env/env.config';
import { TokenProvider } from '~/global/jwt/token.provider';

@Injectable()
export class AuthService {
    constructor(
        private readonly repository: Repository,
        private readonly config: ConfigService<EnvConfig, true>,
        private readonly tokenProvider: TokenProvider
    ) {}

    async login(loginRequestDto: LoginRequestDto) {
        const salt = this.config.get<string>('SECRET');
        const { email, password } = loginRequestDto;

        const findMember = await this.repository.member.findFirst({
            where: {
                email,
                hashedPassword: MemberDomain.generateHashedPassword(password, salt),
            },
        });
        if (!findMember) throw new UnauthorizedException(new InvalidIdOrPassword());

        const { id, role, lastLoginAt } = findMember;
        const isFirstLogin = !lastLoginAt;

        const { accessToken, refreshToken } = await this.tokenProvider.generateToken(id, role);

        await this.repository.member.update({
            data: { lastLoginAt: dayjs().toDate() },
            where: { id },
        });

        return LoginResponseDto.toDto({
            accessToken,
            refreshToken,
            role,
            isFirstLogin,
        });
    }

    async token(authTokenRequestDto: TokenRequestDto) {
        const { accessToken, refreshToken } = authTokenRequestDto;

        const { memberId, role } = await this.tokenProvider.verifyToken(accessToken, refreshToken);
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

        return TokenResponseDto.toDto({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    }
}
