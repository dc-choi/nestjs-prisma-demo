import { Module } from "@nestjs/common";

import { Repository } from "./Repository";

@Module({
    providers: [Repository],
})
export class DaoModule {}
