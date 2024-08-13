import { Module } from "@nestjs/common";

import { RedisService } from "./Redis.service";

@Module({
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule {}
