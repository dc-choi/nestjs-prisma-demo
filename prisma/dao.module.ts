import { Global, Module } from '@nestjs/common';

import { Repository } from './repository';

@Global()
@Module({
    providers: [Repository],
    exports: [Repository],
})
export class DaoModule {}
