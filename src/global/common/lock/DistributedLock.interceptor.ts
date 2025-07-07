import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import Redlock from 'redlock';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { DISTRIBUTED_LOCK_KEY, RED_LOCK } from '~/global/common/lock/DistributedLock';

@Injectable()
export class DistributedLockInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        @Inject(RED_LOCK) private redlock: Redlock
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const metadata = this.reflector.get(DISTRIBUTED_LOCK_KEY, context.getHandler());
        if (!metadata) {
            return next.handle();
        }

        const { lockKeyFn, ttl } = metadata;

        const args = context.getArgs();
        const keyOrKeys = lockKeyFn(...args);
        const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];

        return from(this.redlock.acquire([keys], ttl)).pipe(
            switchMap((lock) =>
                next.handle().pipe(
                    catchError((err) => from(lock.release()).pipe(switchMap(() => throwError(() => err)))),
                    switchMap((result) => from(lock.release()).pipe(switchMap(() => [result])))
                )
            )
        );
    }
}