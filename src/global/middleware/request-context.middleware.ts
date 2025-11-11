import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import { v7 } from 'uuid';
import { RequestContext } from '~/global/context/request-context';

/**
 * 요청 단위 추적을 위한 Middleware
 *
 * 각 HTTP 요청마다 고유한 x-request-id를 생성하거나 헤더에서 읽어와서
 * AsyncLocalStorage 컨텍스트에 저장합니다.
 *
 * - 요청 헤더에 x-request-id가 있으면 해당 값을 사용
 * - 없으면 uuid.v7()로 새로 생성
 * - 응답 헤더에 x-request-id를 자동으로 추가
 * - 이후 모든 로그에 requestId가 자동으로 포함됨
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void {
        const headerId = req.header('x-request-id');
        const requestId = headerId || v7();

        // 응답 헤더에 x-request-id 추가
        res.setHeader('x-request-id', requestId);

        // AsyncLocalStorage 컨텍스트 생성 및 진입
        RequestContext.enterWith({ requestId });

        next();
    }
}
