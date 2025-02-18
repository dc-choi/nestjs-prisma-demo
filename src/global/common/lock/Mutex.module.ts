import { Module } from '@nestjs/common';

import { MutexService } from './Mutex.service';

@Module({
    providers: [MutexService],
    exports: [MutexService],
})
export class MutexModule {}
