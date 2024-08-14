import { EnvConfig } from "@global/env/Env.config";
import { RedisModule } from "@infra/redis/Redis.module";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { TokenProvider } from "./TokenProvider";
import { JwtStrategy } from "./strategy/JwtStrategy";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService<EnvConfig, true>) => ({
                secret: configService.get("SECRET"),
                signOptions: { expiresIn: "2h" },
            }),
        }),
        RedisModule,
    ],
    providers: [TokenProvider, JwtStrategy],
    exports: [TokenProvider],
})
export class TokenModule {}
