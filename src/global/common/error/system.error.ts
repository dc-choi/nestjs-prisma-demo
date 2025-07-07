import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { QueueMessage } from '~/global/common/message/queue.message';

/**
 * BullMQ에서 예외처리가 Error로 처리되기 때문에 임의로 만든 함수
 */
export const checkQueueMessage = (queueMessage: QueueMessage) => {
    if (!queueMessage.success) {
        const { statusCode, message } = queueMessage;

        if (statusCode === 400) {
            throw new BadRequestException(message);
        }
        if (statusCode === 404) {
            throw new NotFoundException(message);
        }

        throw new InternalServerErrorException(message);
    }
};
