import { EnvConfig } from "@global/env/Env.config";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { RedisClientType, createClient } from "redis";

@Injectable()
export class RedisService {
    private readonly redisClient: RedisClientType;

    constructor(private readonly configService: ConfigService<EnvConfig, true>) {
        this.redisClient = createClient({ url: this.configService.get("REDIS_URL") });
        this.redisClient.connect();
    }

    async set(key: string, value: string | number) {
        await this.redisClient.set(key, value, { EX: 180 });
    }

    async get(key: string) {
        return await this.redisClient.get(key);
    }
}
