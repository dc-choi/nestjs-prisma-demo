import { deletePasswordInLog } from "@global/common/utils/password";
import { infoLogger } from "@global/config/logger/Winston.config";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const version = request.httpVersion;
        const origin = request._parsedUrl;
        const method = request.method;
        const url = request.url;
        const params = request.params;
        const query = request.query;
        const body = request.body;

        infoLogger.log(
            `HTTP REQUEST:\nversion: ${version}\norigin: ${JSON.stringify(origin)}\nmethod: ${method}\nurl: ${url}\nparams: ${JSON.stringify(params)}\nquery: ${JSON.stringify(query)}\nbody: ${JSON.stringify(deletePasswordInLog(body))}`
        );

        return next.handle().pipe(
            tap((response) => {
                infoLogger.log(
                    `HTTP RESPONSE:\norigin: ${JSON.stringify(origin)}\nmethod: ${method}\nurl: ${url}\nresponse: ${JSON.stringify(response)}`
                );
            })
        );
    }
}
