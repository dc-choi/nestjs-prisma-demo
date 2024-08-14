import { Unauthorized } from "@global/common/error/AuthError";
import { WEEK } from "@global/common/utils/time";
import { Redis } from "@infra/redis/Redis";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { randomUUID } from "crypto";

@Injectable()
export class TokenProvider {
    constructor(
        private readonly jwtService: JwtService,
        private readonly redis: Redis
    ) {}

    /**
     * accessToken, refreshToken 발급
     */
    public async generateToken(memberId: bigint, role: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(memberId, role),
            this.generateRefreshToken(memberId),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    /**
     * refreshToken 검증
     */
    public async validateRefreshToken(memberId: bigint, refreshToken: string) {
        const redisToken = await this.redis.get(`token:${memberId}`);
        if (redisToken !== refreshToken) throw new UnauthorizedException(new Unauthorized());

        return redisToken;
    }

    /**
     * accessToken 발급
     */
    private async generateAccessToken(memberId: bigint, role: string) {
        const accessToken = this.jwtService.sign({
            memberId,
            role,
        });

        return accessToken;
    }

    /**
     * RTR방식으로 refreshToken 발급
     */
    private async generateRefreshToken(memberId: bigint) {
        let refreshToken = await this.redis.get(`token:${memberId}`);
        if (refreshToken) this.redis.del(`token:${memberId}`);

        refreshToken = randomUUID();

        // INFO: refreshToken의 유효기간은 2주로 설정
        await this.redis.set(`token:${memberId}`, refreshToken, WEEK * 2);

        return refreshToken;
    }
}
