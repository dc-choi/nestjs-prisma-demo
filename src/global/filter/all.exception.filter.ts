import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';

import { Request, Response } from 'express';
import { deletePasswordInLog } from '~/global/common/utils/password';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const response = context.getResponse<Response>();

        const { method, originalUrl, params, body } = request;
        const { host: ip } = request.headers;

        const msg = `${method} ${originalUrl} ${ip}
        \n${exception.stack}
        \n[Params] ${JSON.stringify(params)}
        \n[Body] ${JSON.stringify(deletePasswordInLog(body))}`;

        this.logger.error(msg);

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
}
