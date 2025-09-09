import { SetMetadata } from '@nestjs/common';

export const RED_LOCK = 'RED_LOCK';

export const DISTRIBUTED_LOCK_KEY = 'DISTRIBUTED_LOCK_KEY';

export const DEFAULT_LOCK_TTL = 2000;
export const DEFAULT_LOCK_MAX_RETRIES = 3;
export const DEFAULT_LOCK_BASE_DELAY = 100;

/**
 * 분산락 옵션
 */
interface DistributedLockOptions {
    ttl?: number;
    maxRetries?: number;
    baseDelay?: number;
}

export const DistributedLock = (
    lockKeyFn: (...args: any[]) => string | string[],
    options: DistributedLockOptions = {}
) => {
    const {
        ttl = DEFAULT_LOCK_TTL,
        maxRetries = DEFAULT_LOCK_MAX_RETRIES,
        baseDelay = DEFAULT_LOCK_BASE_DELAY,
    } = options;

    return SetMetadata(DISTRIBUTED_LOCK_KEY, {
        lockKeyFn,
        ttl,
        maxRetries,
        baseDelay,
    });
};
