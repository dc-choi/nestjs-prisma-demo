import { Module } from "@nestjs/common";

import { Redis } from "./Redis";

@Module({
    providers: [Redis],
    exports: [Redis],
})
export class RedisModule {}
