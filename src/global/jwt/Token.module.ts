import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TokenProvider } from './TokenProvider';
import { JwtStrategy } from './strategy/JwtStrategy';

import { EnvConfig } from '~/global/config/env/Env.config';
import { RedisService } from '~/infra/redis/Redis.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService<EnvConfig, true>) => ({
                secret: configService.get<string>('SECRET'),
                signOptions: { expiresIn: '2h' },
            }),
        }),
    ],
    providers: [TokenProvider, JwtStrategy, RedisService],
    exports: [TokenProvider],
})
export class TokenModule {}
