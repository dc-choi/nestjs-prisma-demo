import { SetMetadata } from '@nestjs/common';

export const RED_LOCK = 'RED_LOCK';

export const DISTRIBUTED_LOCK_KEY = 'DISTRIBUTED_LOCK_KEY';

export const DistributedLock = (lockKeyFn: (...args: any[]) => string | string[], ttl = 2000) =>
    SetMetadata(DISTRIBUTED_LOCK_KEY, { lockKeyFn, ttl });
