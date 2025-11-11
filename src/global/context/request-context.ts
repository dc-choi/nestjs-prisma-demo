import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContextData {
    requestId: string;
}

/**
 * AsyncLocalStorage 기반 요청 컨텍스트 관리
 *
 * 각 HTTP 요청마다 고유한 requestId를 생성하고 요청 생명주기 동안 자동으로 전파합니다.
 *
 * @important
 * - HTTP 요청: RequestContextMiddleware에 의해 자동으로 컨텍스트가 생성되고 전파됩니다.
 * - 워커/크론/비동기 작업: 컨텍스트가 자동 전파되지 않으므로, 필요시 수동으로 `enterWith`를 호출해야 합니다.
 *
 * @example
 * ```ts
 * // HTTP 요청 내에서 (자동)
 * const requestId = RequestContext.getRequestId(); // 자동으로 추적됨
 *
 * // 크론/워커에서 (수동)
 * import { v7 } from "uuid";
 * RequestContext.enterWith({ requestId: v7() });
 * // 이후 해당 컨텍스트 내의 모든 로그에 requestId가 포함됨
 * ```
 */
export class RequestContext {
    private static readonly als = new AsyncLocalStorage<RequestContextData>();

    /**
     * 새로운 요청 컨텍스트를 생성하고 진입합니다.
     * 주로 Middleware에서 호출됩니다.
     */
    static enterWith(context: RequestContextData): void {
        this.als.enterWith(context);
    }

    /**
     * 콜백 함수를 새로운 컨텍스트 내에서 실행합니다.
     * 비동기 작업을 격리된 컨텍스트에서 실행할 때 유용합니다.
     */
    static run<R>(context: RequestContextData, callback: () => R): R {
        return this.als.run(context, callback);
    }

    /**
     * 현재 요청의 requestId를 반환합니다.
     * 컨텍스트가 없으면 undefined를 반환합니다.
     */
    static getRequestId(): string | undefined {
        return this.als.getStore()?.requestId;
    }

    /**
     * 현재 컨텍스트를 반환합니다.
     */
    static getStore(): RequestContextData | undefined {
        return this.als.getStore();
    }
}
