import { EnvConfig } from "@global/env/Env.config";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { RedisClientType, createClient } from "redis";

@Injectable()
export class Redis {
    private readonly redisClient: RedisClientType;

    constructor(private readonly configService: ConfigService<EnvConfig, true>) {
        this.redisClient = createClient({ url: this.configService.get("REDIS_URL") });
        this.redisClient.connect();
    }

    /**
     * @param key 키
     * @param value 값
     * @param expireSecond 만료초
     */
    async set(key: string, value: string | number, expireSecond: number = 180) {
        await this.redisClient.set(key, value, { EX: expireSecond });
    }

    /**
     * @param key 키
     * @returns 값
     */
    async get(key: string) {
        return await this.redisClient.get(key);
    }

    /**
     * @param key 키
     */
    async del(key: string) {
        await this.redisClient.del(key);
    }
}
