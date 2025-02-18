import { Injectable } from '@nestjs/common';

import { Mutex } from 'async-mutex';

@Injectable()
export class MutexService {
    private mutex = new Mutex();

    async lock<T>(callback: () => Promise<T>) {
        const release = await this.mutex.acquire();
        try {
            return await callback();
        } finally {
            release();
        }
    }
}
