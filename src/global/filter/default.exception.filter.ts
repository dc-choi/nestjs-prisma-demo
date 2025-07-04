import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ConflictException,
    ExceptionFilter,
    HttpException,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { deletePasswordInLog } from '~/global/common/utils/password';

@Catch(HttpException, BadRequestException, UnauthorizedException, ConflictException, NotFoundException)
export class DefaultExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(DefaultExceptionFilter.name);

    catch(exception: HttpException | BadRequestException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const response = context.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        const { method, originalUrl, params, body } = request;
        const { host: ip } = request.headers;
        const message = exceptionResponse['message'];

        const msg = `${method} ${status} ${originalUrl} ${ip} ${message ?? null} ${JSON.stringify(
            params
        )} ${JSON.stringify(deletePasswordInLog(body))}`;

        this.logger.error(msg);

        response.status(status).json(exceptionResponse);
    }
}
