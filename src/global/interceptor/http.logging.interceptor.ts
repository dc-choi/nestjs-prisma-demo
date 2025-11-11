import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { httpLog } from '~/global/common/logger/channel.logger';
import { deletePasswordInLog } from '~/global/common/utils/password';
import { EnvConfig } from '~/global/config/env/env.config';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
    constructor(private readonly configService: ConfigService<EnvConfig, true>) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const env = this.configService.get<string>('ENV');
        const request = context.switchToHttp().getRequest<Request>();
        const { httpVersion: version, originalUrl: origin, method, url, params, query, body } = request;

        httpLog.log({
            type: 'HTTP REQUEST',
            env,
            version,
            origin,
            method,
            url,
            params,
            query,
            body: deletePasswordInLog(body),
        });

        return next.handle().pipe(
            tap((response) => {
                httpLog.log({
                    type: 'HTTP RESPONSE',
                    env,
                    origin,
                    method,
                    url,
                    response,
                });
            })
        );
    }
}
