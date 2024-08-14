import { EnvConfig } from "@global/env/Env.config";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { JwtPayload } from "../payload/JwtPayload";

import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(readonly configService: ConfigService<EnvConfig, true>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("SECRET"),
        });
    }

    /**
     * JWT 토큰 검증을 passport에서 진행.
     * @param payload
     * @returns payload
     */
    async validate(payload: JwtPayload): Promise<JwtPayload> {
        return payload;
    }
}
