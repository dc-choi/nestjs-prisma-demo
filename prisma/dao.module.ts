import { Global, Module } from '@nestjs/common';

import { MysqlAdapterProvider } from './mysql.adapter';
import { Repository } from './repository';

@Global()
@Module({
    providers: [Repository, MysqlAdapterProvider],
    exports: [Repository],
})
export class DaoModule {}
