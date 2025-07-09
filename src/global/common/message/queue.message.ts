import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    HttpException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

/**
 * Message Interface
 */
export interface QueueResponse {
    readonly success: boolean;
    readonly statusCode: number;
    readonly message: string;
    readonly error?: unknown;
}

/**
 * BullMQ에서 예외처리가 Error로 처리되기 때문에 임의로 만든 함수
 */
export const checkQueueMessage = (response: QueueResponse) => {
    if (!response.success) {
        const { statusCode, message, error } = response;

        switch (statusCode) {
            case 400:
                throw new BadRequestException(error ?? message);
            case 401:
                throw new UnauthorizedException(error ?? message);
            case 403:
                throw new ForbiddenException(error ?? message);
            case 404:
                throw new NotFoundException(error ?? message);
            case 409:
                throw new ConflictException(error ?? message);
            default:
                throw new InternalServerErrorException(error ?? message);
        }
    }
};

/**
 * 예외처리를 직렬화 하기 위한 함수
 */
export const queueErrorHandler = (error: unknown): QueueResponse => {
    if (error instanceof HttpException) {
        return {
            success: false,
            message: error.message,
            statusCode: error.getStatus(),
            error: error.getResponse(),
        };
    }

    if (error instanceof Error) {
        return {
            success: false,
            message: error.message,
            statusCode: 500,
        };
    }

    // unknown 타입이거나 non-standard error
    return {
        success: false,
        message: 'Unknown error',
        statusCode: 500,
    };
};
