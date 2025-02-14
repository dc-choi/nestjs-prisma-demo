import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { TokenProvider } from "./TokenProvider";
import { JwtStrategy } from "./strategy/JwtStrategy";

import { EnvConfig } from "~/global/config/env/Env.config";
import { RedisModule } from "~/infra/redis/Redis.module";

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService<EnvConfig, true>) => ({
                secret: configService.get<string>("SECRET"),
                signOptions: { expiresIn: "2h" },
            }),
        }),
        RedisModule,
    ],
    providers: [TokenProvider, JwtStrategy],
    exports: [TokenProvider],
})
export class TokenModule {}
