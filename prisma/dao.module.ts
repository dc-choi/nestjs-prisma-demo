import { Global, Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { MysqlAdapterProvider } from './mysql.adapter';
import { REPOSITORY, Repository, RepositoryProvider } from './repository';

@Global()
@Module({
    providers: [RepositoryProvider, MysqlAdapterProvider],
    exports: [REPOSITORY],
})
export class DaoModule implements OnModuleInit, OnModuleDestroy {
    constructor(@Inject(REPOSITORY) private readonly repository: Repository) {}

    async onModuleInit() {
        await this.repository.$connect();
    }

    async onModuleDestroy() {
        await this.repository.$disconnect();
    }
}
