import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { JwtPayload } from '../payload/jwt.payload';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvConfig } from '~/global/config/env/env.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(readonly configService: ConfigService<EnvConfig, true>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('SECRET'),
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
