import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';

import { Redis } from 'ioredis';
import { verboseLogger } from '~/global/config/logger/Winston.config';

@Injectable()
export class RedisService {
    constructor(@InjectRedis() private readonly redis: Redis) {
        this.redis.on('connect', () => verboseLogger.verbose!('Redis connected'));
        this.redis.on('error', (err) => verboseLogger.error!(`Redis error: ${err.message}`));
    }

    /**
     * @param key 키
     * @param value 값
     * @param expireSecond 만료초
     */
    async set(key: string, value: string | number, expireSecond: number = 180) {
        await this.redis.set(key, value, 'EX', expireSecond);
    }

    /**
     * @param key 키
     * @returns 값
     */
    async get(key: string) {
        return await this.redis.get(key);
    }

    /**
     * @param key 키
     */
    async del(key: string) {
        await this.redis.del(key);
    }
}
