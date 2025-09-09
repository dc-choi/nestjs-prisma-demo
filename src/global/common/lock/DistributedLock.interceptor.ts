import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import Redlock from 'redlock';
import { Observable, catchError, from, retry, switchMap, throwError, timer } from 'rxjs';
import { DISTRIBUTED_LOCK_KEY, RED_LOCK } from '~/global/common/lock/DistributedLock';

@Injectable()
export class DistributedLockInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        @Inject(RED_LOCK) private readonly redlock: Redlock
    ) {}

    /**
     * 메서드 실행 전에 분산락을 확인하고 적용
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // 현재 메서드에 @DistributedLock 데코레이터가 있는지 확인
        const metadata = this.reflector.get(DISTRIBUTED_LOCK_KEY, context.getHandler());
        if (!metadata) {
            // 데코레이터가 없으면 그냥 원본 메서드 실행
            return next.handle();
        }

        // 데코레이터에서 설정한 옵션들 추출
        const { lockKeyFn, ttl, maxRetries, baseDelay } = metadata;

        // 현재 메서드의 인수들 가져오기 (jwtPayload, orderV3RequestDto 등)
        const args = context.getArgs();

        // lockKeyFn을 실행해서 락 키 생성
        // 예: ['lock:item:1', 'lock:item:2'] 또는 'lock:item:1'
        const keyOrKeys = lockKeyFn(...args);

        // 단일 키든 배열이든 배열로 통일
        const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];

        // 재시도 로직과 함께 락 획득 시도
        return this.tryAcquireLockWithRetry(keys, ttl, maxRetries, baseDelay, next);
    }

    /**
     * 분산락 획득을 재시도 로직과 함께 수행하는 메서드
     * RxJS Observable 체인으로 구성
     */
    private tryAcquireLockWithRetry(
        keys: string[], // 락을 걸 키들 ['lock:item:1', 'lock:item:2']
        ttl: number, // 락 유지 시간 (밀리초)
        maxRetries: number, // 최대 재시도 횟수
        baseDelay: number, // 기본 지연 시간
        next: CallHandler // 실제 비즈니스 로직
    ): Observable<any> {
        return from(this.redlock.acquire(keys, ttl)).pipe(
            // 락 획득 성공 시 실행되는 부분
            switchMap((lock) =>
                // 실제 비즈니스 로직 실행
                next.handle().pipe(
                    // 비즈니스 로직에서 에러 발생 시 처리
                    catchError((err) =>
                        // 에러가 나면 락 해제 시도
                        from(lock.release()).pipe(
                            // 락 해제도 실패할 수 있으니 에러 처리
                            catchError(() => {
                                // 락 해제 실패해도 원본 에러를 던져야 함
                                return throwError(() => err);
                            }),
                            // 락 해제 성공 후 원본 에러 던지기
                            switchMap(() => throwError(() => err))
                        )
                    ),
                    // 비즈니스 로직 성공 시 처리
                    switchMap((result) =>
                        // 성공 시에도 락 해제
                        from(lock.release()).pipe(
                            // 락 해제 실패해도 결과는 반환해야 함
                            catchError(() => {
                                // 결과는 그대로 반환 (락 해제 실패는 로그만)
                                return [result];
                            }),
                            // 락 해제 성공 후 결과 반환
                            switchMap(() => [result])
                        )
                    )
                )
            ),
            // 락 획득 실패 시 재시도 로직
            retry({
                count: maxRetries, // 최대 재시도 횟수
                delay: (error) => {
                    // 락 획득 실패가 아닌 다른 에러는 재시도하지 않음
                    // 예: 비즈니스 로직 에러, 네트워크 에러 등
                    if (!this.isLockAcquisitionError(error)) {
                        return throwError(() => error);
                    }

                    // timer로 지연 후 재시도
                    return timer(baseDelay);
                },
            }),
            // 모든 재시도 실패 시 최종 에러 처리
            catchError((error) => {
                // 최종적으로 실패한 에러를 그대로 던짐
                return throwError(() => error);
            })
        );
    }

    /**
     * 에러가 락 획득 실패인지 판단하는 메서드
     * 락 실패만 재시도하고, 다른 에러는 바로 실패 처리
     */
    private isLockAcquisitionError(error: any): boolean {
        return (
            error?.name === 'LockError' || // Redlock 기본 에러
            error?.message?.includes('Unable to acquire lock') || // 락 획득 실패 메시지
            error?.message?.includes('The operation was unable to achieve a quorum') || // Redis 클러스터에서 쿼럼 실패
            error?.constructor?.name === 'LockError' // 생성자 이름 확인
        );
    }
}
